---
name: report
description: User-invoked. Produce single-file deep system report (REPORT.md) by scanning current repo + interviewing user for non-code context. Trigger /report.
disable-model-invocation: true
---

# report

Build one **REPORT.md** at repo root covering name, idea, inspiration, system, architecture, code. Hybrid source: scan code for structure, grill user for intent.

## Workflow

1. **Locate target.** cwd is the system. If no repo here, ask user for path. Confirm before writing.
2. **Scan pass (silent).** Read in parallel:
   - `README*`, `package.json`/`pyproject.toml`/`Cargo.toml`/`go.mod` — name, deps, scripts
   - top-level dirs (depth 2) — module map
   - entry points (`src/index.*`, `main.*`, `app/*`)
   - config (`.env.example`, `*.config.*`)
   - any existing `docs/`, `ARCHITECTURE.md`
   Collect: stack, deps, dir structure, entry points, build/run commands.
3. **Interview pass.** Use AskUserQuestion. Ask only what scan cannot answer. Batch 2-4 questions per turn. Cover in order:
   - **Idea** — one-sentence pitch, problem solved
   - **Inspiration** — prior art, what sparked it, what's different
   - **Target users** — who, why they care
   - **Decisions/tradeoffs** — non-obvious choices, rejected alternatives
   - **Roadmap** — next, blocked, deferred
   Skip section if user says "skip" or scan already answers.
4. **Draft REPORT.md** using template below. Fill every section. Mark unknowns `_TBD_` rather than fabricate.
5. **Ask HTML?** Single question: also render `REPORT.html`? If yes, use `pandoc REPORT.md -o REPORT.html --standalone --css` or inline minimal CSS via `<style>` block. If pandoc missing, write self-contained HTML with embedded CSS directly.
6. **Done criterion.** REPORT.md exists at repo root, every template section present, no section empty except explicit `_TBD_`. Echo file path to user.

## Template

```markdown
# {{Name}}

> {{one-sentence pitch}}

## Idea
- Problem
- Solution
- Why now

## Inspiration
- Prior art / influences
- What's different here

## System
- Target users
- Core capabilities (bullets)
- Non-goals

## Architecture
- Stack: {{lang, framework, runtime, db, infra}}
- Diagram (mermaid or ascii)
- Module map: {{dir → responsibility}}
- Data flow: {{request → response path}}
- External deps / integrations

## Code
- Entry points: {{file:line}}
- Key modules: {{path — purpose}}
- Build/run: {{commands}}
- Test: {{commands, coverage approach}}
- Config / env vars

## Decisions & Tradeoffs
- {{decision}} — {{reason}} — {{rejected alt}}

## Roadmap
- Next
- Blocked
- Deferred

## Appendix
- Repo: {{path or url}}
- Generated: {{ISO date}}
- Sources: scan + interview
```

## Rules

- **One file.** Never split into multiple .md.
- **No fabrication.** `_TBD_` beats guessing.
- **Scan before ask.** Don't ask user what `package.json` already answers.
- **Mermaid for diagrams** when stack supports it; ascii fallback.
- **Idempotent.** If REPORT.md exists, diff intent: ask overwrite vs update vs abort.
