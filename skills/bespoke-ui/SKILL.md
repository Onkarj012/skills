---
name: bespoke-ui
description: Derive distinct, fit-for-purpose UI directions grounded in the specific project, then build them. Use when the user wants distinctive or non-generic UI ("make it unique", "not look AI-made", "break the norm"), or wants design options curated to the app's real purpose instead of a generic style menu. Other skills (e.g. design-directions) reach for this when they need fit-grounded directions rather than arbitrary contrast.
---

# Bespoke UI

Generic AI design has a tell deeper than purple gradients: it reaches for the **slop menu** — the reflexive Brutalist / Organic / Glassmorphism / Neumorphism lineup — and bolts one onto any project regardless of what the project is. Five "distinct" directions that all ignore the subject is not variety. It is five guesses from the same hat.

This skill makes every direction earn its **fit**: drawn from the subject's own world, filtered against what the project actually is, and distinct from its siblings on composition rather than costume. The output is a short brief the user can redirect, then code.

The single check, applied to every choice: the **slop test** — could a generic LLM have produced this for any project? If yes, it is slop. If it could only exist for *this* subject, it fits.

## Branches

- **Standalone** — run all steps; present 3-5 directions; user picks one; build it.
- **Addon to `design-directions`** — run Steps 1-6 to produce fit-grounded directions, then hand them to `design-directions` as its Phase 3 style synthesis (it builds the 5 variant files). Your job is replacing its generic style-pick with fitted directions; it keeps its file routing and contrast matrix.

Do not duplicate `design-taste-frontend`'s anti-slop pre-flight (Inter, AI-purple, three-equal-cards, em-dash ban, Jane Doe, etc.). When writing code, that checklist still applies — point to it, run it, do not restate it here.

## Step 1 — Read the subject

Pin three things in one line each, even if the user gave little: the **concrete subject** (what this is), the **audience** (who uses it), and **the one job** the primary screen does. Fold in any palette/style/reference the user supplied as a constraint, not a suggestion.

The subject's own world — its materials, instruments, artifacts, vocabulary — is where fit comes from. A trading tool's world is tickers, ledgers, fills, terminals. A meditation app's world is breath, dusk, analog warmth. Name that world; it is the well every direction draws from.

**Completion:** subject, audience, one-job, and named subject-world all written. No generic ("a modern web app") allowed.

## Step 2 — Fit-filter

Open `ARCHETYPES.md` and locate the nearest project archetype. Take its **anti-fits** as hard eliminations — aesthetics that fight this project type are off the table now. Take its fitting directions as a launch pad, never a cage.

If no archetype fits cleanly, derive from the subject-world directly (Step 1).

**Completion:** wrong-fit aesthetics named and eliminated, with the slop menu explicitly checked against this project ("Brutalism is an anti-fit for a clinical tool — eliminated").

## Step 3 — Ground the survivors

Turn surviving aesthetics into **specific** directions tied to the subject-world. Cultural reference worlds (transit signage, film titles, print editorial, instrument panels, music packaging) are fuel for derivation — but they surface in plain language, never as name-dropping. "High-contrast directional, like wayfinding signage: no decoration, every label earns its place" — not "Bauhaus-inspired."

Any direction NOT from the archetype map must pass a one-line subject-justification ("terminal-green because this user lives in a CLI all day"). No subject-tie = rejected, no matter how good it looks.

**Completion:** each direction has a one-line fit-justification tied to the subject. Off-map directions justified or cut.

## Step 4 — Contrast on composition

Once fit is locked, the directions must still differ — but they contrast on **how they are built**, not on wild costume swings (all 5 fitting an efficiency tool should not converge into 5 minimal clones, nor diverge into a circus). Spread them across:

- **Component placement & layout** — where things sit, what the grid does, what breaks it
- **Information density** — airy to packed
- **Typographic voice** — the type's personality and hierarchy
- **Interaction model** — how the user moves through it

3-5 directions. Seeing one should give no information about another's *composition*, while all share the same fit.

**Completion:** no two directions repeat a value on the same contrast axis; all still pass Step 3's fit-justification.

## Step 5 — Name the signature

Each direction names its one **signature**: the single element someone would screenshot and share. This is what separates "clean" from memorable. A big number is not a signature. The signature embodies the subject — name it before any code exists.

**Completion:** every direction has one named signature element, specific to the subject.

## Step 6 — Absorbed?

Was this aesthetic absorbed by the culture — once novel, now expected? Cream+serif, AI-purple, bento-everything: all former novelties, now slop. Ask each run; do not hardcode answers.

**Completion:** every direction survives the absorbed test, or is revised.

## Step 7 — Brief, then pause

Write the brief: per direction, 3-5 lines — name, fit-justification, palette (4-6 named hex), type roles, layout concept, signature. Then **pause** for redirect before building.

If addon to `design-directions`: hand these directions over now as its Phase 3 and let it build the 5 files. **Addon branch ends here. Steps 8–9 are standalone only.**

**Completion:** brief shown; user has picked a direction (standalone) or directions handed off (addon).

## Step 8 — Novelty critique

Before building, run the slop test as an adversarial pass — self-assessment is too lenient. Argue, hard, that the chosen direction *could* have come from a generic LLM. If the argument lands, sharpen the weakest element (usually the signature or the palette) until it fails. For a thorough run, spin this as a subagent prompted to prove the design generic. Use the specificity test below as the adversarial checklist.

**Completion:** the slop test has been attempted and fails for the chosen direction.

## Step 9 — Build

Build the chosen direction in the target stack — HTML/CSS or React, Tailwind v4. Derive every color and type decision from the brief; do not drift. Run `design-taste-frontend`'s pre-flight as the quality floor (responsive, contrast, reduced-motion, no AI tells). Match motion to the direction — restraint for precise directions, choreography only where the subject calls for it.

**Completion:** code matches the brief exactly; `design-taste-frontend` pre-flight passes; signature is present and works.

## The specificity test (reference)

Consult when grounding or critiquing. A direction is bespoke only if it can answer these — answers a generic LLM could not give for any project:

- What in the *subject's world* did the palette come from?
- What does the *type voice* say about who made this and for whom?
- What is the one element someone screenshots, and why does it only make sense for this subject?
- Strip the content — would the shell still be recognizably *this* product, or any product?
- If a competitor copied the layout, what would they fail to copy?
