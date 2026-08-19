# Report contract

These checklists define coverage and mechanical invariants only. They do not
prescribe a visual style, layout, class names, component grammar, or mandatory
headings. The composing agent chooses the document structure that best serves
the system and audience.

## Required content coverage

- Identity and one-sentence pitch.
- Idea: problem, proposed solution, and why it matters now when evidence exists.
- Inspiration and difference: influences, prior art, and what is distinct here.
- Users, capabilities, and explicit non-goals.
- Architecture: stack, module map, data flow, and integrations.
- Code: entry points, key modules, build/run, test approach, and configuration.
- Decisions and tradeoffs, including rejected alternatives when known.
- Roadmap: next work, blocked work, and deferred work when known.
- Appendix and sources: repository evidence, interview context, dates, links, and limitations.

## Mechanical HTML invariants

- One complete raw HTML document with `<!doctype html>` and an `<html lang="…">` root.
- The document has UTF-8 charset metadata, a viewport meta tag, and a non-empty title.
- CSS is inline; there are no external subresources.
- Print behavior is defined with `@media print` and does not clip required content.
- Layouts work from approximately 360px mobile through tablet and wide desktop
  without document-level horizontal overflow; wide content scrolls inside its
  own container.
- Interactive elements have visible keyboard focus.
- Text and meaningful controls meet WCAG AA contrast against their actual backgrounds.
- Motion respects `prefers-reduced-motion`; JavaScript is optional and nonessential.
- Semantic elements, ordered headings, and meaningful `alt` text are used where applicable.
- Same-page navigation targets resolve, and the report remains understandable without styling or script.
