# Orchestration patterns

Shapes for structuring work across many agents. Reached from [SKILL.md](SKILL.md) when a dispatch grows past one agent. Compose freely — tournament brackets, staged escalation, and self-repair loops are all legal; these are the recurring shapes, not a closed menu.

## Why many agents at all

Three reasons: **comprehensive** (decompose and cover in parallel), **confident** (independent perspectives and adversarial checks before committing), **scale** (work one context can't hold — migrations, audits, broad sweeps). If none apply, one agent — or the main thread — is the right size.

## Pipeline over barrier

The default multi-stage shape is a pipeline: each item flows through all stages independently, so item A can be in stage 3 while item B is still in stage 1. A barrier (wait for ALL of stage N before starting stage N+1) is correct only when the next stage genuinely needs cross-item context: dedup/merge across the full set, early-exit on a zero count, or a prompt that references "the other findings". "The stages are conceptually separate" does not justify a barrier — barrier latency is real, and the fastest items idle behind the slowest.

## Discovery

- **Multi-modal sweep** — parallel agents each searching a *different way* (by container, by content, by entity, by time), blind to each other. Use when no single search angle finds everything.
- **Loop-until-dry** — for unknown-size discovery (bugs, edge cases, call sites), declare K consecutive-empty rounds and a total round or cost budget, then keep spawning finders until K consecutive rounds return nothing new. Fixed counters miss the tail. Dedup fresh findings against ALL previously seen (not just confirmed) — otherwise judge-rejected findings reappear every round and the loop never converges. If the total round or cost cap arrives first, report partial coverage and the uncompleted dry-out condition.

## Verification

- **Adversarial verify** — N independent skeptics per finding, each prompted to REFUTE it; kill on majority refutation. Prevents plausible-but-wrong findings surviving.
- **Perspective-diverse verify** — when a finding can fail in more than one way, give each verifier a distinct lens (correctness, security, perf, does-it-reproduce) instead of N identical refuters. Diversity catches failure modes redundancy can't.

## Synthesis

- **Judge panel** — N independent attempts from different angles (MVP-first, risk-first, user-first), scored by parallel judges; synthesize from the winner while grafting the best ideas from runners-up. Beats one-attempt-iterated when the solution space is wide.
- **Completeness critic** — a final agent asking "what's missing: an angle not run, a claim unverified, a source unread?" Its findings become the next round of work.

## Honesty rules

- **No silent caps** — if coverage is bounded (top-N, sampling, no-retry), report what was dropped. Silent truncation reads as full coverage.
- **Scale to the ask** — "find any bugs" → a few finders, single-vote verify. "Thoroughly audit this" → large finder pool, 3–5-vote adversarial pass, synthesis stage.

## Mechanics

- One dispatch → the harness's subagent tool (`Agent` in Claude Code, `task` in opencode). Deterministic control flow over many (loops, conditionals, fan-out) → the `Workflow` tool in Claude Code; in opencode, drive the loop from the main thread across `task` dispatches.
- Model and effort are set per stage, not per workflow — route each stage through [SKILL.md](SKILL.md).
- gpt-5.6 (sol/terra/luna) stages go through a thin wrapper agent — see [CODEX.md](CODEX.md).
