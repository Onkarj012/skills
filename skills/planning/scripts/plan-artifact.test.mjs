import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const script = fileURLToPath(new URL('./plan-artifact.mjs', import.meta.url));
const temporaryRoots = [];

function hash(contents) {
  return createHash('sha256').update(contents).digest('hex');
}

async function fixture({
  title = 'Example plan',
  slug = 'example-plan',
  profile = 'systems',
  html,
  metadata,
} = {}) {
  const root = await mkdtemp(path.join(tmpdir(), 'plan-artifact-'));
  temporaryRoots.push(root);
  const directory = path.join(root, 'docs', 'plans');
  await import('node:fs/promises').then(({ mkdir }) => mkdir(directory, { recursive: true }));
  const sourcePath = path.join(directory, `${slug}.md`);
  const htmlPath = path.join(directory, `${slug}.waymark.html`);
  const metadataPath = path.join(directory, `${slug}.waymark.json`);
  const markdown = `# ${title}\n\n## Destination\n\nShip the planned result.\n`;
  const body = html ?? `<article class="plan" data-plan-profile="${profile}"><nav><a href="#destination">Destination</a></nav><section id="destination"><h2>Destination</h2></section></article>\n`;
  await writeFile(sourcePath, markdown);
  await writeFile(htmlPath, body);
  if (metadata !== undefined) {
    await writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
  }
  return {
    root,
    relativeMetadata: `docs/plans/${slug}.waymark.json`,
    sourcePath,
    htmlPath,
    metadataPath,
  };
}

function run(root, ...arguments_) {
  return spawnSync(process.execPath, [script, ...arguments_, '--root', root], {
    encoding: 'utf8',
  });
}

async function metadata(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

async function updateMetadata(file, update) {
  const value = await metadata(file);
  update(value);
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

test.after(async () => {
  await Promise.all(temporaryRoots.map((root) => rm(root, { recursive: true, force: true })));
});

test('stamp writes exactly the version-2 fields and hashes canonical sources', async () => {
  const files = await fixture();
  const result = run(files.root, 'stamp', files.relativeMetadata);
  assert.equal(result.status, 0, result.stderr);
  const value = await metadata(files.metadataPath);
  assert.deepEqual(Object.keys(value), [
    'version', 'status', 'title', 'slug', 'visual_profile', 'source_path',
    'source_sha256', 'html_path', 'html_sha256', 'page_id', 'url', 'ttl_days',
    'last_known_updated_at',
  ]);
  assert.equal(value.version, 2);
  assert.equal(value.status, 'draft');
  assert.equal(value.title, 'Example plan');
  assert.equal(value.slug, 'example-plan');
  assert.equal(value.visual_profile, 'systems');
  assert.equal(value.source_path, 'docs/plans/example-plan.md');
  assert.equal(value.html_path, 'docs/plans/example-plan.waymark.html');
  assert.equal(value.source_sha256, hash(await readFile(files.sourcePath)));
  assert.equal(value.html_sha256, hash(await readFile(files.htmlPath)));
});

test('stamp preserves remote publication metadata and discards unrelated fields', async () => {
  const files = await fixture({
    metadata: {
      version: 1,
      title: 'Old title',
      page_id: 'page_123',
      url: 'https://waymark.leo4.dev/p/page_123',
      ttl_days: 14,
      last_known_updated_at: '2026-08-13T12:00:00Z',
      unrelated: true,
    },
  });
  const result = run(files.root, 'stamp', files.relativeMetadata, '--status', 'approved');
  assert.equal(result.status, 0, result.stderr);
  const value = await metadata(files.metadataPath);
  assert.equal(value.status, 'approved');
  assert.equal(value.page_id, 'page_123');
  assert.equal(value.url, 'https://waymark.leo4.dev/p/page_123');
  assert.equal(value.ttl_days, 14);
  assert.equal(value.last_known_updated_at, '2026-08-13T12:00:00Z');
  assert.equal('unrelated' in value, false);
});

test('stamp preserves approved status only while canonical hashes are unchanged', async () => {
  const files = await fixture();
  assert.equal(run(files.root, 'stamp', files.relativeMetadata, '--status', 'approved').status, 0);
  assert.equal(run(files.root, 'stamp', files.relativeMetadata).status, 0);
  assert.equal((await metadata(files.metadataPath)).status, 'approved');
  await writeFile(files.sourcePath, '# Example plan\n\nChanged.\n');
  assert.equal(run(files.root, 'stamp', files.relativeMetadata).status, 0);
  assert.equal((await metadata(files.metadataPath)).status, 'draft');
  assert.equal(run(files.root, 'stamp', files.relativeMetadata, '--status', 'completed').status, 0);
  assert.equal((await metadata(files.metadataPath)).status, 'completed');
});

test('verify accepts a clean synchronized artifact without writing it', async () => {
  const files = await fixture();
  assert.equal(run(files.root, 'stamp', files.relativeMetadata).status, 0);
  const before = await readFile(files.metadataPath, 'utf8');
  const result = run(files.root, 'verify', files.relativeMetadata);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Verified/);
  assert.equal(await readFile(files.metadataPath, 'utf8'), before);
});

test('verify rejects stale Markdown', async () => {
  const files = await fixture();
  assert.equal(run(files.root, 'stamp', files.relativeMetadata).status, 0);
  await writeFile(files.sourcePath, '# Example plan\n\nChanged.\n');
  const result = run(files.root, 'verify', files.relativeMetadata);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Markdown source hash is stale/);
});

test('verify rejects stale body HTML', async () => {
  const files = await fixture();
  assert.equal(run(files.root, 'stamp', files.relativeMetadata).status, 0);
  await writeFile(files.htmlPath, '<article class="plan" data-plan-profile="systems"></article>\n');
  const result = run(files.root, 'verify', files.relativeMetadata);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /body HTML hash is stale/);
});

test('verify rejects an invalid visual profile', async () => {
  const files = await fixture();
  assert.equal(run(files.root, 'stamp', files.relativeMetadata).status, 0);
  await updateMetadata(files.metadataPath, (value) => { value.visual_profile = 'poster'; });
  const result = run(files.root, 'verify', files.relativeMetadata);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /invalid visual_profile/);
});

test('verify rejects forbidden full-document and active-content tags', async () => {
  const files = await fixture();
  assert.equal(run(files.root, 'stamp', files.relativeMetadata).status, 0);
  const unsafe = '<article class="plan" data-plan-profile="systems"><script>alert(1)</script></article>\n';
  await writeFile(files.htmlPath, unsafe);
  await updateMetadata(files.metadataPath, (value) => { value.html_sha256 = hash(unsafe); });
  const result = run(files.root, 'verify', files.relativeMetadata);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /forbidden tag/);
});

test('verify rejects unresolved fragment anchors', async () => {
  const files = await fixture();
  assert.equal(run(files.root, 'stamp', files.relativeMetadata).status, 0);
  const broken = '<article class="plan" data-plan-profile="systems"><a href="#missing">Missing</a></article>\n';
  await writeFile(files.htmlPath, broken);
  await updateMetadata(files.metadataPath, (value) => { value.html_sha256 = hash(broken); });
  const result = run(files.root, 'verify', files.relativeMetadata);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /unresolved anchor/);
});

test('verify rejects metadata paths that are confined but inconsistent', async () => {
  const files = await fixture();
  assert.equal(run(files.root, 'stamp', files.relativeMetadata).status, 0);
  await updateMetadata(files.metadataPath, (value) => { value.source_path = 'docs/plans/other.md'; });
  const result = run(files.root, 'verify', files.relativeMetadata);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /source_path must be docs\/plans\/example-plan\.md/);
});

test('stamp rejects a canonical source symlink that escapes the artifact root', async () => {
  const files = await fixture();
  const outside = await mkdtemp(path.join(tmpdir(), 'plan-artifact-outside-'));
  temporaryRoots.push(outside);
  const outsideSource = path.join(outside, 'outside.md');
  await writeFile(outsideSource, '# Outside\n');
  await rm(files.sourcePath);
  await symlink(outsideSource, files.sourcePath);
  const result = run(files.root, 'stamp', files.relativeMetadata);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /outside artifact root/);
});

test('verify rejects a canonical body symlink that escapes the artifact root', async () => {
  const files = await fixture();
  assert.equal(run(files.root, 'stamp', files.relativeMetadata).status, 0);
  const outside = await mkdtemp(path.join(tmpdir(), 'plan-artifact-outside-'));
  temporaryRoots.push(outside);
  const outsideHtml = path.join(outside, 'outside.html');
  await writeFile(outsideHtml, '<article class="plan" data-plan-profile="systems"></article>\n');
  await rm(files.htmlPath);
  await symlink(outsideHtml, files.htmlPath);
  const result = run(files.root, 'verify', files.relativeMetadata);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /outside artifact root/);
});

test('stamp rejects event-handler attributes and scriptable href or src schemes', async () => {
  const unsafeBodies = [
    '<article class="plan" data-plan-profile="systems" onLoad="alert(1)"></article>\n',
    '<article class="plan" data-plan-profile="systems"><a href="JaVa\nScRiPt:\u0009alert(1)">bad</a></article>\n',
    '<article class="plan" data-plan-profile="systems"><img src="\u0000DATA:text/html,alert(1)"></article>\n',
  ];
  for (const body of unsafeBodies) {
    const files = await fixture({ html: body });
    const result = run(files.root, 'stamp', files.relativeMetadata);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /(?:event-handler attribute|scriptable URL scheme)/);
  }
});
