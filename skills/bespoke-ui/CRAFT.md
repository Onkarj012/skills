# Craft — execution taste

The direction (SKILL.md) decides *what* to build; craft decides whether the build feels professionally made. Direction without craft is a good idea shipped badly. Every principle below serves one root: **coherence**.

This file is consulted at build time and again at the critique pass. It is principles, not a rulebook — enumerated ban-lists rot as the culture absorbs styles; principles do not.

## 1. Coherence — the one idea

State the direction's idea in one sentence before writing code. Every choice — color, type, spacing, motion, copy — must trace back to it. An element that cannot explain itself in terms of the idea is decoration; cut it.

The test at any moment: point at any pixel and ask "why is this here?" The answer must end at the idea, not at "it looked nice" or "pages usually have this."

## 2. Systems, not instances

Professional work is systematic: values are picked once, named, and reused. A magic number appearing once is a bug.

- **Type**: one scale (pick a ratio, derive every size from it), 2–3 faces with named roles — a characterful display face used with restraint, a body face built for reading, optionally a utility face for captions/data. Weights and spacing set per role, not per element.
- **Spacing**: one base unit; every gap, padding, and margin is a multiple. Rhythm is what makes a layout feel considered rather than assembled.
- **Color**: 4–6 named values from the direction's brief, assigned to semantic roles (background, surface, ink, accent, positive/negative) — never used raw by hex at the point of styling. The accent is scarce; scarcity is what makes it an accent.
- **Material**: one logic for radii, borders, and shadows, applied everywhere. Mixed corner radii and inconsistent elevation are the fastest amateur tells.

## 3. Hierarchy and restraint

Spend boldness in one place. The direction's **signature** is the one memorable move; everything around it stays quiet and disciplined so the signature can land. Two bold moves compete; three is noise.

Each screen has one primary action, and size, weight, and color express importance honestly — the biggest thing on the screen is the most important thing, or the hierarchy is lying.

Restraint is not timidity: an empty region held deliberately is a choice; a region filled because it was empty is not.

## 4. Detail craft

The last 10% is where "clean" becomes "professional":

- **States are designed, not defaulted**: hover, focus, active, disabled, loading, empty, error. An empty state invites the first action; an error state says what happened and how to fix it.
- **Optical over mathematical**: align to what the eye sees — icons optically centered, display type compensated for bearings, hairlines that read as intentional.
- **Real content**: real names, real numbers, plausible domain data. Placeholder people, lorem text, and round fake metrics announce that nobody imagined a real user.
- **Numbers**: tabular figures wherever values are compared or change; right-align compared columns.
- **Edges**: what touches the viewport edge is deliberate — full-bleed is a statement, not an accident of missing padding.

## 5. Copy is design material

Templated copy makes a design read machine-made as fast as templated visuals. Words exist to make the interface easier to understand and use:

- Name things from the user's side of the screen — what they control and recognize, never how the system is built.
- Active verbs that say what happens: "Save changes," not "Submit." The action keeps its name through the whole flow — "Publish" produces "Published."
- Sentence case, plain verbs, no filler. Each element does one job: a label labels, an example demonstrates.
- Specific beats clever, everywhere.

## 6. Motion

Motion must earn its place from the direction — a precise instrument gets near-none; a launch moment may deserve choreography. When it earns it:

- One orchestrated moment lands harder than scattered effects. Choose where the moment is; keep the rest still.
- Duration and easing are system values, not per-element improvisation.
- `prefers-reduced-motion` is always respected — motion collapses to opacity or nothing, and the design still works.

Default is restraint. Extra animation is one of the strongest signals of machine-generated work.

## 7. Theming

Themes derive; they are not hand-patched. Because color is assigned through semantic roles (§2), a second mode is a re-mapping of roles, not a hunt through the stylesheet.

- Pick the primary mode from the subject, not from fashion — playback and focus contexts earn dark; reading and care contexts usually earn light.
- If both modes ship, both are *designed*: a dark theme is not an inverted light theme; surfaces, elevation, and accent behavior are re-decided.
- Whatever ships is verified in every shipped mode before done.

## 8. Data display

Where the UI shows data, the data's legibility is the design:

- Alignment does the work: compared numbers right-aligned in tabular figures; labels left-aligned; units consistent.
- Scales are honest — bars start at zero, axes are labeled, truncation is declared. Drama from a truncated axis is a lie the reader eventually catches.
- In data contexts, color is meaning, never decoration: if green is "positive," nothing decorative may be green.
- Density follows the task: a monitoring view earns packed; a decision view earns focused.

## 9. Quality floor — non-negotiable

Not aspirations; failing any of these is shipping broken work:

- Responsive to narrow mobile (≈360px) with no horizontal scroll; wide content scrolls inside its own container.
- Visible keyboard focus on every interactive element.
- Text contrast meets WCAG AA against its actual background.
- `prefers-reduced-motion` respected (§6).
- Semantic HTML: headings in order, controls are buttons/links, images have alt text.
- Performance sanity: no decorative element costing hundreds of DOM nodes or continuous main-thread work.

## The critique pass — mandatory, one round

After building and before the user sees the result, run exactly one structured pass:

1. **See it.** If the environment can render (browser, screenshot, preview), look at the real output at desktop and mobile widths, in every shipped theme. If it cannot, re-read the built output top-to-bottom in the order a user would see it — not the order it was written.
2. **Judge it** against, in order: the direction brief (is the fit intact? is the signature present and does it land?), the coherence test (§1), then each territory above (§2–§9).
3. **Argue against it.** Adversarial framing: make the honest case that this output is generic, incoherent, or sloppy — that a template could have produced it. Wherever the case lands, it is a finding.
4. **Fix every finding.** Then present to the user with the tradeoffs named plainly.

The user is the final critic — their eyes outrank this file. Iterate on their verdict; do not loop privately past the one pass.
