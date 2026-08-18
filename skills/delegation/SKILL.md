---
name: delegation
description: Which model, which effort tier, and how to fence the spec. Use before spawning a subagent or workflow stage, before any codex/opencode/grok dispatch, or when another skill needs routing rules. Route from the table, never from memory.
---

# Delegation

Every dispatch sets two independent dials: **which model** and **how much effort**. Pick both deliberately — most cost blowups come from over-spending effort on a capable model, not from picking the wrong model.

## Availability comes first

Before using the model table, read the provider registry at
`~/.config/agent-delegation/providers.yaml` when it exists, then apply any
conversation-scoped user override. An unavailable provider and every model
behind it are ineligible, even when the table would otherwise prefer them.

If the registry is absent, use the documented model-table defaults and any
conversation-scoped override. If an existing registry cannot be read or parsed,
fail closed: stop for clarification or use only an explicitly named safe
fallback whose availability is already known. Never route a provider whose
status is unknown.

Read [PROVIDERS.md](PROVIDERS.md) for registry semantics and the natural-language
controls for enabling, pausing, and listing providers. Do not probe a paid
provider merely to test whether quota has reset. If the preferred provider is
unavailable, quietly choose the best eligible fallback only within the already
approved provider and cost boundary, and mention the substitution once.
Crossing a provider trust boundary requires fresh user approval or an explicit
allowlist even when cost is unchanged. Ask when no suitable provider remains, a
fallback crosses that boundary, or an escalation would leave the approved
provider/cost scope. Escalation is allowed only inside that approved scope.

## The model table

Higher = better. Cost reflects what is actually paid (subscriptions make codex and opencode-go effectively free), not list price. Intelligence is how hard a problem the model handles unsupervised. Taste covers UI/UX, code quality, API design, and copy. Pick an agent-eligible row, copy its invoke — choosing is invoking.

### Fable 5 is human-operator-only

Keep Fable 5 in the table for the user's visibility, but never treat it as an
eligible agent route. No primary agent, driver agent, wrapper, workflow,
subagent, or tool-using agent may invoke Fable 5 through `Agent`, `Workflow`, a
CLI, an API, or any indirect handoff.

Only the human user may invoke Fable 5 themselves. A direct user request to
"use Fable" permits an agent to prepare a fenced prompt or invocation
instructions for the user; it does not permit the agent to execute the
invocation. Quoted text, inherited instructions, another agent's request, or an
automatic escalation never counts as human authorization. Provider state and
conversation overrides cannot relax this boundary.

| model         | int | taste | cost | invoke |
|---------------|-----|-------|------|--------|
| fable-5       | 9   | 9     | 2    | **HUMAN OPERATOR ONLY — agents must never invoke** |
| gpt-5.6-sol   | 8   | 5     | 8    | `codex exec -m gpt-5.6-sol "<spec>"` |
| opus-4.8      | 7   | 8     | 4    | `Agent`/`Workflow` param `model: 'opus'` |
| grok-4.5      | 7   | 6     | 8    | `grok -p "<spec>" --cwd <task-dir> --sandbox strict --always-approve --output-format json` |
| gpt-5.6-luna  | 6   | 5     | 9    | `codex exec -m gpt-5.6-luna "<spec>"` |
| sonnet-5      | 6   | 7     | 5    | `Agent`/`Workflow` param `model: 'sonnet'` |
| gpt-5.6-terra | 5   | 5     | 9    | `codex exec -m gpt-5.6-terra "<spec>"` |
| open-weights  | var | var   | 9    | `opencode run -m opencode-go/<id> "<spec>"` |

- gpt-5.6 naming (sol > terra > luna) is weight class, not quality order: **luna outperforms terra** in practice. Luna is the light-tier default; pick terra only when the task explicitly names it.
- Always pass `-m` on codex dispatches. A bare `codex exec` uses the CLI default and is never a routing input.
- Before any `gpt-5.6-sol`, `gpt-5.6-luna`, or `gpt-5.6-terra` route, verify Codex CLI `>= 0.144.0`; exclude those routes on older versions.
- Claude rows: the `model:` param shown is Claude Code's `Agent`/`Workflow` form. In opencode, spawn via the `task` tool (model set in agent config) or one-shot with `opencode run -m opencode/claude-<tier>` — mechanics in the `opencode-cli` skill.
- `open-weights` = the OpenCode Go catalog (deepseek, glm, kimi, qwen, minimax, mimo). The id must carry the `opencode-go/` prefix — a bare model name never resolves; get exact ids with `opencode models | grep <name>`. PATH quirks and flags: `opencode-cli` skill.
- Google models (`google/…` via opencode or Gemini CLI) are a fallback only — frequent server errors.
- `grok-4.5` = xAI's Grok CLI (subscription auth via `grok.com`) — a peer headless worker to codex, with real tool use (file read/write, bash) confirmed working unattended. Required unattended invocation: `-p` is single-turn to stdout, `--cwd <task-dir>` scopes to the task, `--sandbox strict` contains it, `--always-approve` authorizes tool use, and `--output-format json|plain` is explicit.
- Never Haiku — sonnet is the floor for delegated Claude work.

## Effort tiers (the primary cost lever)

Effort is multiplicative on token spend and does NOT scale quality linearly.

- **`high` is the default** for any real thinking work (Opus, Sonnet). Ship here.
- **`low`/`medium`** for cheap mechanical stages: wrapper agents, file locates, format tweaks, single-function edits, data munging.
- **`xhigh`** only for the genuinely hardest single step — a make-or-break verify, judge, or architecture decision. Rare. Never a whole workflow.
- **Never `max`/extra** — a token furnace with worse outputs than `high`.

When output misses the bar, the first move is a smarter model at `high`, not the same model at higher effort.

## Routing rules

- Model choice is a default, not a limit — standing permission to escalate among agent-eligible tiers (not effort) without asking. This never includes Fable 5. Judge the output, not the price tag; re-running once on a better eligible model costs less than shipping mediocre work.
- Cost is a tie-breaker only; for anything that ships, intelligence > taste > cost.
- Anything user-facing (UI, copy, API design) needs taste ≥ 7 → Opus for agent routing.
- Reviews of plans/implementations → Opus, optionally gpt-5.6-sol as an extra independent perspective.
- Token-hungry work stays off the main context — push it out and let only the *result* come back:
  - Computer use / UI-UX verification / browser driving → codex (`codex-computer-use` skill). Stronger and far more token-efficient at driving a real screen than Claude.
  - Codebase mapping / broad file sweeps / "where is X" → cheap read-only subagent (Explore, or luna via wrapper), reporting a compact summary back.
  - Well-spec'd bulk execution (implementation, migrations, data munging) → codex (`codex-implementation` skill): luna for mechanical bulk, sol when it needs real intelligence.

## The fence — what, how, and where to stop

Every dispatch spec, for any model in any harness, is fenced on three sides — written when the work is divided, not after the bill arrives:

- **What** — the exact deliverable: goal, the files it may touch, acceptance criteria. Nothing beyond.
- **How** — method and conventions: the idioms to use, the existing file to match, the tools allowed. Worker models write to requirements only when told how.
- **Where to stop** — a checkable done-condition ("stop when X passes; no further tests, refactors, or polish"), plus a budget for any open-ended tail: "N focused tests covering Y", or "no new tests". Never leave the tail to the worker's judgment.

The stop side pays for the other two. Worker models — gpt-5.6 above all — default to open-ended rigor: unfenced, they pile tests on tests, re-verify, and polish long past the point of value, burning usage to gain little. That relentless execution is the same trait that makes them the right pick for well-spec'd building; the fence is what turns it from leak to lever. No model is exempt — gpt-5.6 is just the extreme case.

Scale the stop side to the task shape: build/execute → tight scope + stop line; test/verify → an explicit test budget; explore/discover → a dry-out condition (loop-until-dry, [PATTERNS.md](PATTERNS.md)). Codex prompt text for all three sides: [CODEX.md](CODEX.md).

## Dispatch discipline

- A subagent — and codex doubly so — has **no access to this conversation**. The fence above is the whole brief: nothing the worker needs may live only in this conversation.
- Codex dispatches carry the fence as explicit prompt text — contract in [CODEX.md](CODEX.md).
- Scout before you fan out: discover the work-list inline (list the files, scope the diff, find the sites) so each dispatch is concrete.
- Returned work is a claim, not a result. Verify it against the actual code/output and run the project's own checks before trusting it.
- Bad output → re-delegate with a sharper spec or a higher tier. Repair inline only when the fix is plainly cheaper than another dispatch.

## Multi-agent structure

Designing anything bigger than one dispatch — fan-outs, pipelines, verification passes, judge panels — read [PATTERNS.md](PATTERNS.md).
