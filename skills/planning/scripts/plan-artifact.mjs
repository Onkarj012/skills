#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const STATUSES = new Set(['draft', 'approved', 'completed', 'superseded']);
const PROFILES = new Set(['systems', 'journey', 'migration', 'decision', 'delivery']);
const FIELDS = [
  'version',
  'status',
  'title',
  'slug',
  'visual_profile',
  'source_path',
  'source_sha256',
  'html_path',
  'html_sha256',
  'page_id',
  'url',
  'ttl_days',
  'last_known_updated_at',
];
const REMOTE_FIELDS = ['page_id', 'url', 'ttl_days', 'last_known_updated_at'];
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HASH_PATTERN = /^[a-f0-9]{64}$/;

class ArtifactError extends Error {}

function help() {
  return `Usage:
  plan-artifact.mjs stamp <metadata-file> [options]
  plan-artifact.mjs verify <metadata-file> [options]

Operations:
  stamp    Compute SHA-256 hashes and write canonical version-2 metadata.
  verify   Read only; validate metadata, paths, hashes, and body HTML structure.

Options:
  --root <directory>   Artifact root. Defaults to the current directory.
  --status <status>    draft, approved, completed, or superseded (stamp only).
  --title <title>      Override the Markdown H1-derived title (stamp only).
  --slug <slug>        Confirm the path-derived lowercase slug (stamp only).
  --profile <profile>  systems, journey, migration, decision, or delivery
                       (stamp only; otherwise read from the article root).
  -h, --help           Show this help.

Canonical repository example:
  node plan-artifact.mjs stamp docs/plans/example-plan.waymark.json
  node plan-artifact.mjs verify docs/plans/example-plan.waymark.json

The repository form expects sibling example-plan.md and example-plan.waymark.html files.
The external form expects <slug>/waymark.json beside plan.md and plan.waymark.html.
A sibling example-plan.html (or plan.html) is a derived standalone preview and is
not checksummed by this helper.
`;
}

function sha256(contents) {
  return createHash('sha256').update(contents).digest('hex');
}

function parseArgs(argv) {
  if (argv.length === 0 || argv.includes('-h') || argv.includes('--help')) {
    return { help: true };
  }

  const operation = argv[0];
  if (operation !== 'stamp' && operation !== 'verify') {
    throw new ArtifactError(`unknown operation: ${operation}`);
  }

  const options = { operation, root: process.cwd() };
  const valueOptions = new Map([
    ['--root', 'root'],
    ['--status', 'status'],
    ['--title', 'title'],
    ['--slug', 'slug'],
    ['--profile', 'profile'],
  ]);

  for (let index = 1; index < argv.length; index += 1) {
    const argument = argv[index];
    if (valueOptions.has(argument)) {
      const value = argv[index + 1];
      if (value === undefined || value.startsWith('--')) {
        throw new ArtifactError(`${argument} requires a value`);
      }
      options[valueOptions.get(argument)] = value;
      index += 1;
      continue;
    }
    if (argument.startsWith('-')) {
      throw new ArtifactError(`unknown option: ${argument}`);
    }
    if (options.metadata) {
      throw new ArtifactError('provide exactly one metadata file');
    }
    options.metadata = argument;
  }

  if (!options.metadata) {
    throw new ArtifactError(`${operation} requires a metadata file`);
  }
  if (operation === 'verify') {
    for (const option of ['status', 'title', 'slug', 'profile']) {
      if (options[option] !== undefined) {
        throw new ArtifactError(`--${option} is only valid with stamp`);
      }
    }
  }

  options.root = path.resolve(options.root);
  return options;
}

function resolveWithin(root, candidate, label) {
  const absolute = path.resolve(root, candidate);
  const relative = path.relative(root, absolute);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new ArtifactError(`${label} must stay inside artifact root ${root}`);
  }
  return absolute;
}

function storedPath(root, absolute) {
  return path.relative(root, absolute).split(path.sep).join('/');
}

function resolveStoredPath(root, stored, label) {
  if (typeof stored !== 'string' || stored.length === 0) {
    throw new ArtifactError(`${label} must be a non-empty relative path`);
  }
  if (stored.includes('\\') || path.posix.isAbsolute(stored) || path.posix.normalize(stored) !== stored) {
    throw new ArtifactError(`${label} must be a normalized POSIX relative path`);
  }
  return resolveWithin(root, stored, label);
}

function canonicalPaths(root, metadataInput) {
  const metadata = resolveWithin(root, metadataInput, 'metadata file');
  const directory = path.dirname(metadata);
  const basename = path.basename(metadata);
  let slug;
  let source;
  let html;

  if (basename === 'waymark.json') {
    slug = path.basename(directory);
    source = path.join(directory, 'plan.md');
    html = path.join(directory, 'plan.waymark.html');
  } else if (basename.endsWith('.waymark.json')) {
    slug = basename.slice(0, -'.waymark.json'.length);
    source = path.join(directory, `${slug}.md`);
    html = path.join(directory, `${slug}.waymark.html`);
  } else {
    throw new ArtifactError('metadata file must be <slug>.waymark.json or <slug>/waymark.json');
  }

  if (!SLUG_PATTERN.test(slug)) {
    throw new ArtifactError(`invalid slug derived from metadata path: ${slug}`);
  }

  return {
    metadata,
    source,
    html,
    slug,
    sourceStored: storedPath(root, source),
    htmlStored: storedPath(root, html),
  };
}

function markdownTitle(markdown) {
  for (const line of markdown.replace(/^﻿/, '').split(/\r?\n/)) {
    const match = /^#\s+(.+?)\s*$/.exec(line);
    if (match) {
      return match[1].replace(/\s+#+\s*$/, '').trim();
    }
  }
  throw new ArtifactError('Markdown source must contain an ATX H1 title');
}

function stripComments(html) {
  return html.replace(/<!--([\s\S]*?)-->/g, '');
}

function parseAttributes(source) {
  const attributes = new Map();
  const pattern = /(?:^|\s)([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match;
  while ((match = pattern.exec(source)) !== null) {
    attributes.set(match[1].toLowerCase(), match[2] ?? match[3] ?? match[4] ?? '');
  }
  return attributes;
}

function inspectPlanHtml(html) {
  const body = stripComments(html).trim();
  const forbidden = /<!doctype\b|<\s*\/?\s*(?:html|head|body|style|script)\b/i.exec(body);
  if (forbidden) {
    throw new ArtifactError(`body HTML contains forbidden tag: ${forbidden[0]}`);
  }

  const root = /^<article\b([^>]*)>/i.exec(body);
  if (!root) {
    throw new ArtifactError('body HTML root must be one article.plan element');
  }
  let articleDepth = 0;
  let rootClosedAt = -1;
  const articlePattern = /<\/?article\b[^>]*>/gi;
  let articleTag;
  while ((articleTag = articlePattern.exec(body)) !== null) {
    if (/^<\/article/i.test(articleTag[0])) {
      articleDepth -= 1;
      if (articleDepth < 0) {
        throw new ArtifactError('body HTML contains an unmatched </article> tag');
      }
      if (articleDepth === 0) {
        rootClosedAt = articlePattern.lastIndex;
        break;
      }
    } else {
      articleDepth += 1;
    }
  }
  if (rootClosedAt !== body.length || articleDepth !== 0) {
    throw new ArtifactError('body HTML root must be one article.plan element');
  }
  const attributes = parseAttributes(root[1]);
  const classes = (attributes.get('class') ?? '').split(/\s+/).filter(Boolean);
  if (!classes.includes('plan')) {
    throw new ArtifactError('body HTML root must include class="plan"');
  }
  const profile = attributes.get('data-plan-profile');
  if (!PROFILES.has(profile)) {
    throw new ArtifactError(`invalid or missing data-plan-profile: ${profile ?? '(missing)'}`);
  }

  const ids = new Set();
  const anchors = [];
  const openingTagPattern = /<([A-Za-z][A-Za-z0-9:-]*)\b([^>]*)>/g;
  let tag;
  while ((tag = openingTagPattern.exec(body)) !== null) {
    const tagAttributes = parseAttributes(tag[2]);
    const id = tagAttributes.get('id');
    if (id) {
      ids.add(id);
    }
    const href = tagAttributes.get('href');
    if (href?.startsWith('#')) {
      anchors.push(href.slice(1));
    }
  }
  for (const target of anchors) {
    let decoded = target;
    try {
      decoded = decodeURIComponent(target);
    } catch {
      throw new ArtifactError(`invalid percent-encoding in anchor href="#${target}"`);
    }
    if (!decoded || !ids.has(decoded)) {
      throw new ArtifactError(`unresolved anchor href="#${target}"`);
    }
  }

  return { profile };
}

async function readJson(file) {
  let contents;
  try {
    contents = await readFile(file, 'utf8');
  } catch (error) {
    throw new ArtifactError(`cannot read metadata file ${file}: ${error.message}`);
  }
  try {
    return JSON.parse(contents);
  } catch (error) {
    throw new ArtifactError(`invalid JSON in ${file}: ${error.message}`);
  }
}

async function readText(file, label) {
  try {
    return await readFile(file);
  } catch (error) {
    throw new ArtifactError(`cannot read ${label} ${file}: ${error.message}`);
  }
}

function validateRemoteFields(metadata) {
  if (!(metadata.page_id === null || (typeof metadata.page_id === 'string' && metadata.page_id.length > 0))) {
    throw new ArtifactError('page_id must be null or a non-empty string');
  }
  if (!(metadata.url === null || (typeof metadata.url === 'string' && /^https?:\/\//.test(metadata.url)))) {
    throw new ArtifactError('url must be null or an http(s) URL');
  }
  if (!Number.isInteger(metadata.ttl_days) || metadata.ttl_days < 0) {
    throw new ArtifactError('ttl_days must be a non-negative integer');
  }
  if (!(metadata.last_known_updated_at === null || (typeof metadata.last_known_updated_at === 'string' && metadata.last_known_updated_at.length > 0))) {
    throw new ArtifactError('last_known_updated_at must be null or a non-empty string');
  }
}

function validateSchema(metadata) {
  if (!metadata || Array.isArray(metadata) || typeof metadata !== 'object') {
    throw new ArtifactError('metadata must be a JSON object');
  }
  const keys = Object.keys(metadata);
  const missing = FIELDS.filter((field) => !keys.includes(field));
  const extra = keys.filter((field) => !FIELDS.includes(field));
  if (missing.length || extra.length) {
    const details = [
      missing.length ? `missing: ${missing.join(', ')}` : '',
      extra.length ? `unexpected: ${extra.join(', ')}` : '',
    ].filter(Boolean).join('; ');
    throw new ArtifactError(`metadata fields do not match version 2 schema (${details})`);
  }
  if (metadata.version !== 2) {
    throw new ArtifactError('version must be 2');
  }
  if (!STATUSES.has(metadata.status)) {
    throw new ArtifactError(`invalid status: ${metadata.status}`);
  }
  if (typeof metadata.title !== 'string' || metadata.title.trim() !== metadata.title || metadata.title.length === 0) {
    throw new ArtifactError('title must be a non-empty trimmed string');
  }
  if (typeof metadata.slug !== 'string' || !SLUG_PATTERN.test(metadata.slug)) {
    throw new ArtifactError(`invalid slug: ${metadata.slug}`);
  }
  if (!PROFILES.has(metadata.visual_profile)) {
    throw new ArtifactError(`invalid visual_profile: ${metadata.visual_profile}`);
  }
  if (!HASH_PATTERN.test(metadata.source_sha256)) {
    throw new ArtifactError('source_sha256 must be a lowercase SHA-256 digest');
  }
  if (!HASH_PATTERN.test(metadata.html_sha256)) {
    throw new ArtifactError('html_sha256 must be a lowercase SHA-256 digest');
  }
  validateRemoteFields(metadata);
}

async function stamp(options) {
  const paths = canonicalPaths(options.root, options.metadata);
  const [source, html] = await Promise.all([
    readText(paths.source, 'Markdown source'),
    readText(paths.html, 'body HTML'),
  ]);
  const sourceText = source.toString('utf8');
  const htmlText = html.toString('utf8');
  const derivedTitle = markdownTitle(sourceText);
  const htmlInspection = inspectPlanHtml(htmlText);

  if (options.slug !== undefined && options.slug !== paths.slug) {
    throw new ArtifactError(`--slug ${options.slug} does not match metadata path slug ${paths.slug}`);
  }
  if (options.title !== undefined && options.title !== derivedTitle) {
    throw new ArtifactError(`--title does not match Markdown H1 ${JSON.stringify(derivedTitle)}`);
  }
  if (options.profile !== undefined && options.profile !== htmlInspection.profile) {
    throw new ArtifactError(`--profile ${options.profile} does not match article profile ${htmlInspection.profile}`);
  }

  let existing = {};
  if (existsSync(paths.metadata)) {
    existing = await readJson(paths.metadata);
  }
  const status = options.status ?? (STATUSES.has(existing.status) ? existing.status : 'draft');
  if (!STATUSES.has(status)) {
    throw new ArtifactError(`invalid status: ${status}`);
  }

  const metadata = {
    version: 2,
    status,
    title: options.title ?? derivedTitle,
    slug: paths.slug,
    visual_profile: options.profile ?? htmlInspection.profile,
    source_path: paths.sourceStored,
    source_sha256: sha256(source),
    html_path: paths.htmlStored,
    html_sha256: sha256(html),
    page_id: existing.page_id ?? null,
    url: existing.url ?? null,
    ttl_days: existing.ttl_days ?? 0,
    last_known_updated_at: existing.last_known_updated_at ?? null,
  };
  validateSchema(metadata);

  await mkdir(path.dirname(paths.metadata), { recursive: true });
  const temporary = `${paths.metadata}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');
  await rename(temporary, paths.metadata);
  process.stdout.write(`Stamped ${storedPath(options.root, paths.metadata)}\n`);
}

async function verify(options) {
  const paths = canonicalPaths(options.root, options.metadata);
  const metadata = await readJson(paths.metadata);
  validateSchema(metadata);

  if (metadata.slug !== paths.slug) {
    throw new ArtifactError(`slug ${metadata.slug} does not match metadata path slug ${paths.slug}`);
  }
  resolveStoredPath(options.root, metadata.source_path, 'source_path');
  resolveStoredPath(options.root, metadata.html_path, 'html_path');
  if (metadata.source_path !== paths.sourceStored) {
    throw new ArtifactError(`source_path must be ${paths.sourceStored}`);
  }
  if (metadata.html_path !== paths.htmlStored) {
    throw new ArtifactError(`html_path must be ${paths.htmlStored}`);
  }

  const [source, html] = await Promise.all([
    readText(paths.source, 'Markdown source'),
    readText(paths.html, 'body HTML'),
  ]);
  if (sha256(source) !== metadata.source_sha256) {
    throw new ArtifactError('Markdown source hash is stale; run stamp after deliberate edits');
  }
  if (sha256(html) !== metadata.html_sha256) {
    throw new ArtifactError('body HTML hash is stale; run stamp after deliberate edits');
  }

  const title = markdownTitle(source.toString('utf8'));
  if (title !== metadata.title) {
    throw new ArtifactError(`metadata title does not match Markdown H1 ${JSON.stringify(title)}`);
  }
  const inspection = inspectPlanHtml(html.toString('utf8'));
  if (inspection.profile !== metadata.visual_profile) {
    throw new ArtifactError(`article profile ${inspection.profile} does not match metadata visual_profile ${metadata.visual_profile}`);
  }

  process.stdout.write(`Verified ${storedPath(options.root, paths.metadata)}\n`);
}

export { ArtifactError, canonicalPaths, inspectPlanHtml, markdownTitle, stamp, verify };

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
      process.stdout.write(help());
      return;
    }
    if (options.operation === 'stamp') {
      await stamp(options);
    } else {
      await verify(options);
    }
  } catch (error) {
    if (error instanceof ArtifactError) {
      process.stderr.write(`plan-artifact: ${error.message}\n`);
      process.exitCode = 1;
      return;
    }
    throw error;
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  await main();
}
