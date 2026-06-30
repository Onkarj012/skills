# onkar-skills

A curated set of skills for AI coding agents.

`onkar-skills` installs reusable agent workflows into local skill directories for
Claude Code, OpenCode, Codex, and Cursor. The goal is simple: keep high-value
workflows portable, versioned, and easy to reuse across coding agents.

## What is included

| Skill | Trigger | Purpose |
| --- | --- | --- |
| `design-directions` | `/design-directions` | Generate five distinct UI directions for a project, each grounded in the product, audience, and stack. |
| `report` | `/report` | Produce a single-file `REPORT.md` by scanning a repository and interviewing the user for missing product context. |
| `bespoke-ui` | Agent-routed | Derive non-generic UI directions that fit the specific subject, audience, and job of the product. |

## Supported agents

The installer copies skills into the standard local skill directory for each
supported agent:

| Agent | Skill directory |
| --- | --- |
| Claude Code | `~/.claude/skills/` |
| OpenCode | `~/.opencode/skills/` |
| Codex | `~/.codex/skills/` |
| Cursor | `~/.cursor/skills/` |

By default, the installer detects which supported agents are present by checking
for their configuration directories.

## Installation

Run the installer with `npx`:

```bash
npx onkar-skills
```

The installer will:

1. Detect supported agents installed on your machine.
2. Create the relevant `skills/` directories if needed.
3. Copy each skill into every detected agent.
4. Print a summary of what was installed.

Restart your agent after installation so it can load the new skills.

## Install for one agent

Use `--agent=<name>` to target one agent explicitly:

```bash
npx onkar-skills --agent="Claude Code"
npx onkar-skills --agent=OpenCode
npx onkar-skills --agent=Codex
npx onkar-skills --agent=Cursor
```

The value must match one of the supported agent names above, ignoring case.

## Updating

Re-run the installer whenever you want the latest published skills:

```bash
npx onkar-skills@latest
```

The current installer performs a copy-based install. Existing installed skill
files are overwritten with the version from the package.

## Uninstalling

Remove a skill by deleting its folder from the relevant agent directory. For
example:

```bash
rm -rf ~/.claude/skills/design-directions
rm -rf ~/.codex/skills/report
```

Restart the agent after removing skills.

## Local development

Clone the repository and run the installer from the working tree:

```bash
git clone https://github.com/onkarj012/SKILLS.git
cd SKILLS
node bin/install.js
```

To test one destination:

```bash
node bin/install.js --agent=Codex
```

Skills are directories that contain a `SKILL.md` file. Keep each skill focused,
self-contained, and documented enough that an agent can follow it without
external context.

## Requirements

- Node.js 16 or newer
- At least one supported agent configuration directory, unless `--agent` is used

## License

MIT
