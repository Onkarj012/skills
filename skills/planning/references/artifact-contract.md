# Planning artifact contract

## Canonical paths

Inside a repository:

```text
docs/plans/<slug>.md
docs/plans/<slug>.waymark.json
```

Outside a repository:

```text
~/.local/share/waymark/plans/<slug>/plan.md
~/.local/share/waymark/plans/<slug>/waymark.json
```

Use a short lowercase hyphenated slug. Do not overwrite an unrelated plan with
the same slug.

## Specification structure

1. Title, status, and last updated date
2. Executive summary
3. Destination
4. Current state and verified evidence
5. Settled decisions
6. Scope and non-goals
7. Requirements
8. Proposed design
9. Ordered implementation phases
10. Acceptance and verification criteria
11. Risks and mitigations
12. Non-blocking open questions

Adapt headings to the work, but preserve the information. Label facts,
decisions, and assumptions when their provenance would otherwise be unclear.

## Metadata

```json
{
  "version": 1,
  "title": "Example plan",
  "slug": "example-plan",
  "page_id": null,
  "url": null,
  "ttl_days": 0,
  "last_known_updated_at": null
}
```

`ttl_days: 0` means permanent. After creation or update, store the exact values
returned by Waymark. Before updating, fetch current metadata and compare its
update time with `last_known_updated_at` when both are available.

## Waymark view

Render semantic, themed, body-only HTML. For a full plan, use section
navigation and these sections when present:

- Summary
- Evidence
- Decisions
- Scope
- Requirements and design
- Phases
- Acceptance and verification
- Risks
- Open questions

Use callouts only for a real destination, decision, or risk. Use tables only
for genuinely comparative information. Do not use raw mode, embedded scripts,
custom styles, invented metadata, or color as the sole status signal.
