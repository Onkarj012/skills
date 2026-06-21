# onkar-skills

Skills for AI coding agents — Claude Code, OpenCode, Codex, and more.

## Install

```bash
npx onkar-skills
```

Auto-detects installed agents and copies skills to each.

Force a specific agent:

```bash
npx onkar-skills --agent=claude
npx onkar-skills --agent=opencode
```

## Skills

| Skill | Description |
|-------|-------------|
| `report` | Deep system report — scans repo + interviews you → single `REPORT.md` |
| `design-directions` | Generate 5 contrast-maximal UI mockups for a project |

## Add to Claude Code

After install, restart Claude Code and trigger with:
- `/report` — generate system report
- `/design-directions` — generate UI design directions

## Supported Agents

- Claude Code (`~/.claude/skills/`)
- OpenCode (`~/.opencode/skills/`)
- Codex (`~/.codex/skills/`)
- Cursor (`~/.cursor/skills/`)
