#!/usr/bin/env node

import fs from "node:fs";

const HELP = `Usage:
  node skills/report/scripts/report-doc.mjs check <file.html>
  node skills/report/scripts/report-doc.mjs --help`;

function getAttribute(tag, name) {
  const pattern = new RegExp(
    `\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
    "i",
  );
  const match = tag.match(pattern);
  return match ? (match[1] ?? match[2] ?? match[3] ?? "") : null;
}

function isInlineResource(value) {
  const trimmed = value.trim();
  return trimmed === "" || trimmed.startsWith("data:") || trimmed.startsWith("#");
}

function hasExternalResource(value) {
  return !isInlineResource(value);
}

function hasExternalCssUrl(styles) {
  return [...styles.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/gi)].some(
    (match) => hasExternalResource(match[1] ?? match[2] ?? match[3] ?? ""),
  );
}

function checkHtml(source) {
  const violations = [];
  const documentStart = source.replace(/^\uFEFF/, "");

  if (!/^\s*<!doctype\s+html\s*>/i.test(documentStart)) {
    violations.push("missing <!doctype html>");
  }

  const htmlTag = source.match(/<html\b[^>]*>/i)?.[0] ?? null;
  if (!htmlTag || !getAttribute(htmlTag, "lang")?.trim()) {
    violations.push("html root is missing a non-empty lang attribute");
  }

  const metaTags = [...source.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0]);
  const hasCharset = metaTags.some((tag) =>
    /\bcharset\s*=\s*["']?\s*utf-8\b/i.test(tag),
  );
  if (!hasCharset) {
    violations.push("missing UTF-8 charset metadata");
  }

  const hasViewport = metaTags.some((tag) => {
    const name = getAttribute(tag, "name");
    const content = getAttribute(tag, "content");
    return (
      name?.trim().toLowerCase() === "viewport" &&
      content !== null &&
      /\bwidth\s*=\s*device-width\b/i.test(content)
    );
  });
  if (!hasViewport) {
    violations.push("missing viewport metadata with width=device-width");
  }

  const title = source.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  if (!title) {
    violations.push("missing non-empty title");
  }

  const styleBlocks = [...source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map(
    (match) => match[1],
  );
  if (styleBlocks.length === 0) {
    violations.push("missing inline style block");
  }
  const styles = styleBlocks.join("\n");
  if (!/@media\s+print\b/i.test(styles)) {
    violations.push("missing @media print rules");
  }

  if (/<script\b[^>]*\bsrc\s*=/i.test(source)) {
    violations.push("external script is forbidden: remove script[src]");
  }

  const linkTags = [...source.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0]);
  if (linkTags.some((tag) => getAttribute(tag, "rel")?.toLowerCase().split(/\s+/).includes("stylesheet"))) {
    violations.push("stylesheet link is forbidden; keep CSS inline");
  }

  if (/@import\b/i.test(styles)) {
    violations.push("@import is forbidden; keep CSS inline");
  }

  if (hasExternalCssUrl(styles)) {
    violations.push("external CSS url() is forbidden");
  }

  const resourceAttributes = {
    img: ["src", "srcset", "poster"],
    picture: ["src", "srcset", "poster"],
    source: ["src", "srcset", "poster"],
    video: ["src", "srcset", "poster"],
    audio: ["src", "srcset", "poster"],
    iframe: ["src"],
    object: ["data"],
    embed: ["src"],
    track: ["src"],
    use: ["href"],
    link: ["href"],
  };
  const resourceTags = [...source.matchAll(/<([a-z][\w:-]*)\b[^>]*>/gi)];
  for (const match of resourceTags) {
    const tag = match[0];
    const tagName = match[1].toLowerCase();
    const attributes = resourceAttributes[tagName];
    if (!attributes) {
      continue;
    }
    for (const attribute of attributes) {
      const value = getAttribute(tag, attribute);
      if (value === null) {
        continue;
      }
      if (attribute === "srcset") {
        violations.push("srcset is forbidden; use a single inline src");
      } else if (hasExternalResource(value)) {
        violations.push(`external ${tagName}[${attribute}] is forbidden`);
      }
    }
  }

  return violations;
}

function main(args) {
  if (args.length === 1 && args[0] === "--help") {
    console.log(HELP);
    return 0;
  }

  if (args[0] !== "check" || !args[1] || args.length !== 2) {
    console.error(HELP);
    return 2;
  }

  let source;
  try {
    source = fs.readFileSync(args[1], "utf8");
  } catch (error) {
    console.error(`cannot read ${args[1]}: ${error.message}`);
    return 1;
  }

  const violations = checkHtml(source);
  if (violations.length > 0) {
    console.error(`Report contract failed: ${args[1]}`);
    for (const violation of violations) {
      console.error(`- ${violation}`);
    }
    return 1;
  }

  console.log(`Report contract passed: ${args[1]}`);
  return 0;
}

process.exitCode = main(process.argv.slice(2));
