---
name: design-directions
description: Generate 5 contrast-maximal UI mockups for a project, each grounded in the project's vibe. Use when user wants UI mockups, design exploration, "5 versions of", "show me different designs for X", or invokes /design-directions. Asks dynamic questions to understand style requirements before generating. Supports React/Next.js, SvelteKit, Nuxt/Vue, and HTML/CSS.
---

# Design Directions

Five **contrast** variants — distinct points in design space, each grounded in the project's vibe. Contrast governs all axes simultaneously: color, layout, typography, density, interaction. No two variants share a dominant strategy on any axis.

## Phase 1 — Intake

Ask in one message:
- Project name + one-sentence description of what it does
- Target user (who will use it)
- Tech stack

## Phase 2 — Dynamic questions

Infer project type from intake. Ask 2–3 questions relevant to that type. Don't ask what you can infer.

**Landing / marketing**: tone (bold/playful/serious/minimal), product category, primary CTA goal  
**Dashboard / data app**: data density preference (scannable vs detailed), user expertise, key metric types  
**E-commerce**: product type, brand personality, primary conversion action  
**SaaS / tool**: core task the user comes to do, user expertise level, most-used actions  
**Portfolio / personal**: creator's personality, target audience or industries, content volume  

## Phase 3 — Style synthesis

In 2–3 lines: state the vibe you're designing for and the 5 design directions you'll take. Pause — user may redirect before you generate.

## Phase 4 — Contrast matrix

Before writing code, output the plan:

| # | Color | Layout | Typography | Density | Interaction |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |

Hard constraints:
- All 5 fit the project's vibe — no jarring mismatches
- No axis value repeated across variants
- At least one light, one dark color scheme
- At least one unconventional or editorial layout
- At least one mobile-first layout

Style, layout, interaction, and color taxonomy → [REFERENCE.md](REFERENCE.md) — use as inspiration, not a checklist. Invent hybrids or unlisted styles when they fit the project better.

## Phase 5 — Generate

**File routing by stack:**

| Stack | Pattern |
|---|---|
| React/Next.js App Router | `app/1/page.tsx` → `app/5/page.tsx` |
| React/Next.js Pages Router | `pages/1.tsx` → `pages/5.tsx` |
| SvelteKit | `src/routes/1/+page.svelte` → `src/routes/5/+page.svelte` |
| Nuxt / Vue | `pages/1.vue` → `pages/5.vue` |
| HTML/CSS | `1.html` → `5.html` |

Each file: fully self-contained, no shared imports between variants. Visually complete — no placeholder boxes, no lorem soup. Functional — interactable, not a static wireframe. Write all 5; don't stop early.

## Phase 6 — Summary

One-liner per variant:
```
/1 — Minimal · single-column · monochrome · low density
/2 — Bold editorial · asymmetric grid · vibrant dark · high density
/3 — Glassmorphism · card grid · modal-driven · gradient
/4 — Brutalist · full-bleed · command palette · high-contrast
/5 — Claymorphism · bento · drag-and-drop · pastel
```

**Completion**: all 5 exist, each passes the contrast test — seeing one gives no information about any other's visual strategy.
