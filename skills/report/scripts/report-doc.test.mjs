import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, test } from "node:test";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("./report-doc.mjs", import.meta.url));
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "report-doc-test-"));

after(() => fs.rmSync(tempDir, { recursive: true, force: true }));

function run(args) {
  return spawnSync(process.execPath, [script, ...args], {
    encoding: "utf8",
  });
}

function checkFixture(name, source) {
  const file = path.join(tempDir, name);
  fs.writeFileSync(file, source);
  return run(["check", file]);
}

const compliant = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>System report</title>
    <style>
      :root { color-scheme: light; }
      a:focus-visible { outline: 2px solid currentColor; }
      @media print { nav { display: none; } }
      @media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto; } }
    </style>
  </head>
  <body>
    <nav><a href="#overview">Overview</a><a href="https://example.com/source">Source</a></nav>
    <main><h1 id="overview">System report</h1><p>Evidence-backed content.</p></main>
  </body>
</html>`;

test("accepts a compliant self-contained document", () => {
  const result = checkFixture("compliant.html", compliant);
  assert.equal(result.status, 0, result.stderr);
});

test("reports missing required metadata", () => {
  const result = checkFixture(
    "missing-metadata.html",
    `<html><head><title> </title></head><body></body></html>`,
  );
  assert.equal(result.status, 1);
  for (const text of ["doctype", "lang", "charset", "viewport", "title"]) {
    assert.match(result.stderr, new RegExp(text, "i"));
  }
});

test("requires print rules", () => {
  const result = checkFixture(
    "missing-print.html",
    compliant.replace("@media print { nav { display: none; } }", ""),
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /@media print/i);
});

test("rejects external scripts, styles, imports, CSS, and images", () => {
  const result = checkFixture(
    "external-resources.html",
    `<!doctype html><html lang="en"><head>
      <meta charset="utf-8"><meta name="viewport" content="width=device-width">
      <title>External</title><link rel="stylesheet" href="https://example.com/report.css">
      <style>@import url("https://example.com/fonts.css"); .x { background: url(https://example.com/bg.png); }</style>
    </head><body><script src="https://example.com/app.js"></script>
      <img src="https://example.com/a.png" srcset="https://example.com/a@2x.png 2x" poster="https://example.com/poster.png">
      <style>@media print { body { color: black; } }</style></body></html>`,
  );
  assert.equal(result.status, 1);
  for (const text of ["script", "stylesheet", "@import", "CSS url", "external img[src]", "srcset", "poster"]) {
    assert.match(result.stderr, new RegExp(text.replace(/[()[\]]/g, "\\$&"), "i"));
  }
});

test("rejects relative subresources too", () => {
  const result = checkFixture(
    "relative-resources.html",
    `<!doctype html><html lang="en"><head>
      <meta charset="utf-8"><meta name="viewport" content="width=device-width">
      <title>Relative resources</title>
      <style>@media print { body { color: black; } } .hero { background: url(./hero.svg); }</style>
    </head><body><img src="./logo.svg"><video poster="poster.jpg"></video></body></html>`,
  );
  assert.equal(result.status, 1);
  for (const text of ["CSS url", "external img[src]", "external video[poster]"]) {
    assert.match(result.stderr, new RegExp(text.replace(/[()[\]]/g, "\\$&"), "i"));
  }
});

test("allows inline data resources and external anchor links", () => {
  const result = checkFixture(
    "inline-resources.html",
    compliant.replace(
      "</main>",
      '<img alt="Inline mark" src="data:image/svg+xml,%3Csvg%3E%3C/svg%3E"><div class="mark"></div></main>',
    ).replace(
      "@media print { nav { display: none; } }",
      '@media print { nav { display: none; } } .mark { background: url(#mark); }',
    ),
  );
  assert.equal(result.status, 0, result.stderr);
});

test("fails for a missing file", () => {
  const result = run(["check", path.join(tempDir, "does-not-exist.html")]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /cannot read/i);
});

test("prints help", () => {
  const result = run(["--help"]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Usage:/);
});
