# onkar-skills

[![skills.sh](https://skills.sh/b/onkarj012/SKILLS)](https://skills.sh/onkarj012/SKILLS)

A curated set of skills for AI coding agents.

These are reusable workflows for Claude Code, Codex, Cursor, OpenCode, and any
agent that supports [skills.sh](https://skills.sh/). The goal is simple: keep
high-value workflows portable, versioned, and easy to reuse across coding
agents.

## Included Skills

| Skill | Trigger | Purpose |
| --- | --- | --- |
| `design-directions` | `/design-directions` | Generate five distinct UI directions for a project, each grounded in the product, audience, and stack. |
| `report` | `/report` | Produce a single-file `REPORT.md` by scanning a repository and interviewing the user for missing product context. |
| `bespoke-ui` | Agent-routed | Derive non-generic UI directions that fit the specific subject, audience, and job of the product. |

## Quickstart

Run the skills.sh installer:

```bash
npx skills@latest add onkarj012/SKILLS
```

Pick the skills you want and the agents you want to install them on. Restart
your agent after installation so it can load the new skills.

## Useful Install Commands

List available skills without installing:

```bash
npx skills@latest add onkarj012/SKILLS --list
```

Install every skill for every detected agent:

```bash
npx skills@latest add onkarj012/SKILLS --all
```

Install one skill:

```bash
npx skills@latest add onkarj012/SKILLS --skill design-directions
```

Install globally instead of project-level:

```bash
npx skills@latest add onkarj012/SKILLS --global
```

Update later:

```bash
npx skills@latest update
```

## Repository Layout

```text
skills/<name>/SKILL.md
```

A skill is installable when it lives at `skills/<name>/SKILL.md`. Keep each
skill focused, self-contained, and documented enough that an agent can follow it
without external context.

## Local Development

Clone the repository and list the skills through the same installer:

```bash
git clone https://github.com/onkarj012/SKILLS.git
cd SKILLS
npx skills@latest add . --list
```

To test a local install:

```bash
npx skills@latest add . --agent codex --copy
```

## Requirements

- Node.js 16 or newer
- `npx`, which ships with npm

## License

MIT
