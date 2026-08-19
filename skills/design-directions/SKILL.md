---
name: design-directions
description: Generate 3-5 contrast-maximal working UI mockups, each fit-grounded in the specific project via the bespoke-ui skill. Use when the user wants to explore design options as real files — "show me versions", "mockups", "different designs for X". Supports React/Next.js, SvelteKit, Nuxt/Vue, and HTML/CSS. Requires the bespoke-ui skill (its fit engine and craft doctrine).
---

# Design Directions

Build 3–5 working variants — distinct points in design space, every one grounded in what the project actually is. Fit comes first (the `bespoke-ui` fit engine), contrast second (no two variants share a dominant strategy on any composition axis), craft throughout (`bespoke-ui`'s CRAFT.md).

**Hard dependency:** this skill requires `bespoke-ui` installed alongside it — its Steps 1–6 are Phase 3 here, and its `CRAFT.md` is the build standard. Without it, stop and say so.

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

## Phase 3 — Fit engine

Run `bespoke-ui` Steps 1–6 (subject, fit-filter, grounding, contrast, signature, absorbed test) with the intake as input. It returns 3–5 fit-grounded directions, each with a fit-justification and a named signature — as many as genuinely distinct fits exist, never a filler variant to hit five.

Present the directions in 2–3 lines each and **pause** — the user may redirect before generation.

## Phase 4 — Contrast matrix

Before writing code, output the plan:

| # | Color | Layout | Typography | Density | Interaction |
|---|---|---|---|---|---|

Hard constraint: **no axis value repeated across variants.** Composition vocabulary for the axes → [REFERENCE.md](REFERENCE.md) — inspiration, not a checklist.

Default expectations — dropped only with one stated reason when fit forbids:
- At least one light and one dark variant ("dark fights a care-context product — all variants light, surfaces differentiate instead")
- At least one unconventional or editorial layout
- At least one mobile-first layout

Fit always outranks coverage: a spread the subject can't support is the slop menu wearing a matrix.

## Phase 5 — Generate

**File routing by stack:**

| Stack | Pattern |
|---|---|
| React/Next.js App Router | `app/1/page.tsx` → `app/N/page.tsx` |
| React/Next.js Pages Router | `pages/1.tsx` → `pages/N.tsx` |
| SvelteKit | `src/routes/1/+page.svelte` → `src/routes/N/+page.svelte` |
| Nuxt / Vue | `pages/1.vue` → `pages/N.vue` |
| HTML/CSS | `1.html` → `N.html` |

Each file: fully self-contained, no shared imports between variants. Built to the standard in `bespoke-ui`'s [CRAFT.md](../bespoke-ui/CRAFT.md) — coherence to its direction, systematic tokens, designed states, real content, its quality floor. Each variant's signature element present and working. Write all of them; don't stop early.

## Phase 6 — Critique pass

Run CRAFT.md's mandatory critique pass once across all variants: see the real output (render if the environment can), judge each against its direction brief and the craft territories, argue that each is generic, fix every finding. Also check the set: if two variants converged during the build, re-separate them on the axis they collapsed.

## Phase 7 — Summary

One-liner per variant — direction name, composition, signature:

```
/1 — Fill-ledger · dense grid, right-aligned tabular columns · dark · signature: the running P&L tape
/2 — Trade-desk calm · sidebar + focused canvas · light · signature: one oversized position card
/3 — Terminal-native · keyboard-first, command palette · dark · signature: the ⌘K order ticket
/4 — Print-report · editorial single column · light · signature: the broadsheet daily summary
```

The user is the final critic: they pick, redirect, or ask for another round on a specific variant.

**Completion**: all variants exist, each passes the contrast test — seeing one gives no information about any other's composition — and each traces to its fit-justification.
