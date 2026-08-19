---
name: bespoke-ui
description: Derive distinct, fit-for-purpose UI directions grounded in the specific project, then build the chosen one to professional craft. Use when the user wants distinctive or non-generic UI ("make it unique", "not look AI-made", "break the norm"), or wants design options curated to the app's real purpose instead of a generic style menu. design-directions invokes this as its fit engine.
---

# Bespoke UI

Generic AI design has a tell deeper than purple gradients: it reaches for the **slop menu** — the reflexive Brutalist / Organic / Glassmorphism / Neumorphism lineup — and bolts one onto any project regardless of what the project is. Five "distinct" directions that all ignore the subject is not variety. It is five guesses from the same hat.

This skill makes every direction earn its **fit**: drawn from the subject's own world, filtered against what the project actually is, and distinct from its siblings on composition rather than costume. The output is a short brief the user can redirect, then code built to the craft standard in [CRAFT.md](CRAFT.md).

The single check, applied to every choice: the **slop test** — could a generic LLM have produced this for any project? If yes, it is slop. If it could only exist for *this* subject, it fits.

## Branches

- **Standalone** — run all steps; present 3–5 directions; user picks one; build it.
- **Fit engine for `design-directions`** — that skill's Phase 3 runs Steps 1–6 here to produce fit-grounded directions, then returns to its own flow (contrast matrix, file routing, building every variant). **The fit-engine branch ends at Step 7's handoff; Steps 8–10 are standalone only.**

## Step 1 — Read the subject

Pin three things in one line each, even if the user gave little: the **concrete subject** (what this is), the **audience** (who uses it), and **the one job** the primary screen does. Fold in any palette/style/reference the user supplied as a constraint, not a suggestion.

The subject's own world — its materials, instruments, artifacts, vocabulary — is where fit comes from. A trading tool's world is tickers, ledgers, fills, terminals. A meditation app's world is breath, dusk, analog warmth. Name that world; it is the well every direction draws from.

**Completion:** subject, audience, one-job, and named subject-world all written. No generic ("a modern web app") allowed.

## Step 2 — Fit-filter

Open [ARCHETYPES.md](ARCHETYPES.md) and locate the nearest project archetype. Take its **anti-fits** as hard eliminations — aesthetics that fight this project type are off the table now. Take its fitting directions as a launch pad, never a cage.

If no archetype fits cleanly, derive from the subject-world directly (Step 1).

**Completion:** wrong-fit aesthetics named and eliminated, with the slop menu explicitly checked against this project ("Brutalism is an anti-fit for a clinical tool — eliminated").

## Step 3 — Ground the survivors

Turn surviving aesthetics into **specific** directions tied to the subject-world. Cultural reference worlds (transit signage, film titles, print editorial, instrument panels, music packaging) are fuel for derivation — but they surface in plain language, never as name-dropping. "High-contrast directional, like wayfinding signage: no decoration, every label earns its place" — not "Bauhaus-inspired."

Any direction NOT from the archetype map must pass a one-line subject-justification ("terminal-green because this user lives in a CLI all day"). No subject-tie = rejected, no matter how good it looks.

**Completion:** each direction has a one-line fit-justification tied to the subject. Off-map directions justified or cut.

## Step 4 — Contrast on composition

Once fit is locked, the directions must still differ — but they contrast on **how they are built**, not on wild costume swings (all directions fitting an efficiency tool should not converge into minimal clones, nor diverge into a circus). Spread them across:

- **Component placement & layout** — where things sit, what the grid does, what breaks it
- **Information density** — airy to packed
- **Typographic voice** — the type's personality and hierarchy
- **Interaction model** — how the user moves through it

As many directions as genuinely distinct fits exist — 3–5. Forcing a fifth when only four fit produces the filler variant. Seeing one direction should give no information about another's *composition*, while all share the same fit.

**Completion:** no two directions repeat a value on the same contrast axis; all still pass Step 3's fit-justification; count justified by fit, not quota.

## Step 5 — Name the signature

Each direction names its one **signature**: the single element someone would screenshot and share. This is what separates "clean" from memorable. A big number is not a signature. The signature embodies the subject — name it before any code exists.

**Completion:** every direction has one named signature element, specific to the subject.

## Step 6 — Absorbed?

Was this aesthetic absorbed by the culture — once novel, now expected? Cream+serif, AI-purple, bento-everything: all former novelties, now slop. Ask each run; do not hardcode answers.

**Completion:** every direction survives the absorbed test, or is revised.

## Step 7 — Brief, then pause

Write the brief: per direction, 3–5 lines — name, fit-justification, palette (4–6 named hex), type roles, layout concept, signature. Then **pause** for redirect before building. The user's redirect outranks everything derived so far.

If running as fit engine for `design-directions`: hand the directions back now — it builds every variant per [CRAFT.md](CRAFT.md). **Fit-engine branch ends here.**

**Completion:** brief shown; user has picked a direction (standalone) or directions handed off (fit engine).

## Step 8 — Novelty critique

Before building, run the slop test as an adversarial pass — self-assessment is too lenient. Argue, hard, that the chosen direction *could* have come from a generic LLM. If the argument lands, sharpen the weakest element (usually the signature or the palette) until it fails. Where the environment allows, spin this as a fresh agent prompted to prove the design generic; single-threaded, argue it yourself in earnest. Use the specificity test below as the adversarial checklist.

**Completion:** the slop test has been attempted and fails for the chosen direction.

## Step 9 — Build

Build the chosen direction in the project's stack (default: one self-contained HTML/CSS file when no stack exists). Derive every color and type decision from the brief; do not drift. Build to the standard in [CRAFT.md](CRAFT.md) — coherence, systems, hierarchy, detail, copy, motion, theming, data display, and its non-negotiable quality floor.

**Completion:** code matches the brief exactly; every CRAFT.md territory addressed; signature present and working.

## Step 10 — Critique pass, then user verdict

Run the mandatory critique pass exactly as specified in [CRAFT.md](CRAFT.md) ("The critique pass"): see the real output, judge against brief and craft, argue against it, fix every finding. Then present to the user with tradeoffs named. The user is the final critic; iterate on their verdict.

**Completion:** one critique pass done, findings fixed, result presented for user verdict.

## The specificity test (reference)

Consult when grounding or critiquing. A direction is bespoke only if it can answer these — answers a generic LLM could not give for any project:

- What in the *subject's world* did the palette come from?
- What does the *type voice* say about who made this and for whom?
- What is the one element someone screenshots, and why does it only make sense for this subject?
- Strip the content — would the shell still be recognizably *this* product, or any product?
- If a competitor copied the layout, what would they fail to copy?
