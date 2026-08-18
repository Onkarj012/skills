# Codex (gpt-5.6 family) mechanics

Single source of truth for invoking the gpt-5.6 family through the Codex CLI, and for the prompt contract every codex dispatch must carry. The branch skills — `codex-implementation`, `codex-review`, `codex-computer-use` — hold their when-to-use rules and prompt templates; the shared mechanics live here.

## Invocation

```bash
# edit task
codex exec -m gpt-5.6-sol --sandbox workspace-write "<self-contained edit prompt>"   # intelligence tier
codex exec -m gpt-5.6-luna --sandbox workspace-write "<self-contained edit prompt>"  # worker tier
# inspection or review task
codex exec -m gpt-5.6-sol --sandbox read-only "<self-contained review prompt>"
codex exec -m gpt-5.6-luna --sandbox read-only "<self-contained review prompt>"
```

Always pass `-m` — a bare `codex exec` uses the CLI default and is not a routing input. Tiers and scores: [SKILL.md](SKILL.md) model table. (Also reachable via opencode as `opencode/gpt-5.6-*`; codex is the primary path.)

## Prompt contract — an unfenced dispatch runs forever

Codex is the extreme case of the worker that won't stop. Every codex prompt therefore carries all three fence sides ([SKILL.md](SKILL.md)) as literal prompt text — nothing implied, nothing inferable from a repo it has never seen. Two codex-specific pressures:

- **Style is not optional.** Codex writes to requirements only when told how; with no conventions named or file to match, it invents its own idiom.
- **The test budget is the side it breaks first.** State a number even when the task looks test-free — an unstated budget reads to codex as "as many as rigor demands."

## Sandbox flags (`-s` / `--sandbox`)

- `workspace-write` — default for edits; codex may modify the repo it runs in.
- `read-only` — analysis only. **Always pass this for read-only work** (review, analysis, computer-use verification) so codex cannot mutate the repo.
- `danger-full-access` — only when the task genuinely needs it.

Before a read-only gpt-5.6 review, require `codex-lb >= 1.21.0-beta.1` or run
a tool-availability smoke check through the selected route. If the version is
older and the smoke check fails or cannot establish availability, exclude that
route and send the review to a compatible read-only worker profile. Do not
continue a review on an unverified route.

## Inside a workflow/subagent

Harness subagent tools can't spawn OpenAI models — Claude Code's `Agent`/`Workflow` `model:` param and opencode's `task` tool both reach Claude tiers only. Spawn a thin Claude wrapper (`model: 'sonnet', effort: 'low'`) whose prompt tells it to write the fenced, self-contained codex prompt, run `codex exec -m <tier> --sandbox <profile>` via Bash (`workspace-write` for edits, `read-only` for inspection/review), and return codex's output verbatim.

After codex returns, apply the shared dispatch discipline in [SKILL.md](SKILL.md).
