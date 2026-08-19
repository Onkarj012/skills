---
name: report
description: User-invoked. Produce a self-contained, agent-designed REPORT.html by scanning the current repository and interviewing the user only for missing product context. Trigger /report.
disable-model-invocation: true
---

# report

Produce one complete, self-contained `REPORT.html` at the repository root. It
is a code-aligned system report, not a fixed template. Scan first, ask only for
context the repository cannot establish, and never fabricate missing facts.

## Workflow

1. **Locate and protect the target.** Treat cwd as the system. If it is not a
   repository, ask for its path. Before writing, if `REPORT.html` or
   `REPORT.md` already exists, ask whether to overwrite, update, or abort.
2. **Scan silently before asking.** Read the README, manifests and lockfiles,
   top-level directories to depth 2, entry points, configuration examples,
   architecture/design docs, build and test scripts, and relevant source
   modules. Record file paths and line references where useful. Separate
   implemented behavior from aspirational documentation and mark unresolved
   facts as `_TBD_`.
3. **Interview only the gap.** Ask only what the scan cannot establish. Cover
   the pitch/idea, inspiration and difference, audience, capabilities and
   non-goals, non-obvious decisions and tradeoffs, and roadmap. Audience is
   required when the scan cannot establish it. Batch concise questions; skip
   any answer the repository already proves.
4. **Design the report.** Ground composition in the reported system's
   subject-world and audience. Resolve the optional sibling `bespoke-ui` paths
   from this loaded `SKILL.md` directory. When present, apply Steps 1–6 of its
   `SKILL.md` and consult its `CRAFT.md` for coherence, hierarchy, systems,
   detail, copy, motion, and its quality floor. Adapt those
   principles to a report; do not add a fixed report style, CSS skeleton,
   component grammar, or five-style menu. Do not pause for design options
   unless the user explicitly requests options.
5. **Compose the canonical artifact.** Use the coverage checklist in
   [report-contract.md](references/report-contract.md), but choose the
   headings, layout, typography, diagrams, and information hierarchy yourself.
   Write exactly one complete `<!doctype html>` document with inline CSS,
   responsive behavior, print rules, semantic/accessibility structure, and no
   external subresources. Reports are raw HTML: never themed, never body-only,
   and never sent through `waymark preview`. JavaScript is optional and must
   not be needed to read the report. Escape every scanned or user-provided
   value before inserting it; Waymark trusts publisher HTML.
6. **Critique once before handoff.** When browser tooling exists, render the
   exact document at desktop (~1440px), tablet (~768px), narrow mobile (~360px),
   print preview, and reduced-motion emulation, in each color scheme the report
   implements. Check content visibility, navigation, focus, contrast, heading order, alt text,
   clipping, and horizontal overflow. When browser tooling is unavailable,
   inspect the source as fallback and report each render check as skipped, never
   passed. Make one adversarial generic/slop challenge: argue that a generic
   LLM/template could have made it, then fix every finding. Resolve this skill's
   install directory from the loaded `SKILL.md` path, then run its bundled
   checker: `node "<report-skill-directory>/scripts/report-doc.mjs" check REPORT.html`.

## Modes and handoff

- **Default:** HTML-only; `REPORT.html` is canonical.
- **Markdown:** create `REPORT.md` only when explicitly requested. It is a
  secondary companion, not the source that changes the HTML default; do not
  use Pandoc conversion.
- **Publish:** publish or update only when explicitly requested. Before any
  remote Waymark operation, run `waymark status` and continue only after a
  successful authenticated result. For a new raw report use
  `waymark create --raw --json`; for an existing page use
  `waymark update --raw --if-updated-at "<last-known-updated-at>" --json`.
  Record the returned page ID, URL, TTL, and `updated_at` when maintaining a
  page. Never publish automatically from `/report`.

Done means the requested local artifact exists, every available browser check
and the bundled structural check pass, and any unavailable render checks are
reported as skipped. Any optional markdown or publication action was explicitly
requested and completed. Report unknowns plainly.
