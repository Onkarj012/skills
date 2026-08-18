# Planning Artifact Contract

This reference is authoritative for plan paths, content, version-2 metadata,
visual profiles, checksum freshness, and body validation. Read it whenever a
planning run creates, previews, verifies, publishes, hands off, or updates an
artifact.

## Canonical paths

Inside a repository, keep this synchronized set:

```text
docs/plans/<slug>.md
docs/plans/<slug>.waymark.html
docs/plans/<slug>.waymark.json
docs/plans/<slug>.html
```

Outside a repository, keep the equivalent set here:

```text
~/.local/share/waymark/plans/<slug>/plan.md
~/.local/share/waymark/plans/<slug>/plan.waymark.html
~/.local/share/waymark/plans/<slug>/waymark.json
~/.local/share/waymark/plans/<slug>/plan.html
```

Use a short lowercase hyphenated slug that identifies this plan and leaves
unrelated plans untouched. Markdown is canonical. The `.waymark.html` file is
the synchronized themed, body-only Waymark source. The plain `.html` file is a
derived standalone preview, may contain the full document wrapper, and is not
checksummed in metadata.

## Specification structure

Preserve this information, adapting headings to the work:

1. title, status, and last updated date;
2. executive summary;
3. destination;
4. current state and verified evidence;
5. settled decisions;
6. scope and non-goals;
7. requirements;
8. proposed design;
9. ordered implementation phases;
10. acceptance and verification criteria;
11. risks and mitigations;
12. non-blocking open questions.

Label facts, decisions, and assumptions when provenance would otherwise be
unclear.

## Version-2 metadata

The metadata file contains exactly these fields:

```json
{
  "version": 2,
  "status": "draft",
  "title": "Example plan",
  "slug": "example-plan",
  "visual_profile": "systems",
  "source_path": "docs/plans/example-plan.md",
  "source_sha256": "<sha256>",
  "html_path": "docs/plans/example-plan.waymark.html",
  "html_sha256": "<sha256>",
  "page_id": null,
  "url": null,
  "ttl_days": 0,
  "last_known_updated_at": null
}
```

Allowed statuses are `draft`, `approved`, `completed`, and `superseded`.
Allowed visual profiles are:

- `systems` — architecture, data flow, or infrastructure;
- `journey` — user or operational flow;
- `migration` — staged current-to-future transition;
- `decision` — alternatives and trade-offs;
- `delivery` — implementation and rollout sequence.

`ttl_days: 0` means permanent. After an approved creation or update, store the
exact page ID, URL, TTL, and remote update time returned by Waymark. Before an
update, fetch current metadata and compare its update time with
`last_known_updated_at` when both are available. An unexpected remote update
timestamp is a hard publication STOP; reconciliation comes before any
overwrite.

### Freshness helper

Use the standard-library-only helper for the metadata record:

```bash
node skills/planning/scripts/plan-artifact.mjs stamp docs/plans/<slug>.waymark.json
node skills/planning/scripts/plan-artifact.mjs verify docs/plans/<slug>.waymark.json
```

`stamp` derives the title from the Markdown H1 and the profile from the body
root, computes SHA-256 over the Markdown and `.waymark.html` bytes, writes only
the version-2 fields, and preserves `page_id`, `url`, `ttl_days`, and
`last_known_updated_at`. `verify` is read-only. It checks the exact schema,
status, title, slug, profile, confined and canonical paths, hashes, body safety,
plan root, and local fragment targets. It never restamps an artifact, scores
prose, or requires a visual quota.

## Visual body contract

The themed source is semantic, body-only HTML with exactly one outer plan root:

```html
<article class="plan" data-plan-profile="systems">
  <!-- plan content -->
</article>
```

Choose one of the five profiles above for the document's dominant reading task.
The profile is a scanning signal; visible text carries status, severity,
recommendation, direction, and phase meaning.

For a full plan, use section navigation and these sections when present:

- Summary
- Evidence
- Decisions
- Scope
- Requirements and design
- Phases
- Acceptance and verification
- Risks
- Open questions

The first orientation layer explains the destination, change, sequence, primary
risk, and completion proof before executor detail. Visualize meaningful
relationships when that improves understanding, without a numeric visual quota.
Every diagram has a caption or adjacent textual equivalent. Use callouts for a
real destination, decision, or risk, and tables for genuinely comparative
information.

The body source contains no doctype, `html`, `head`, `body`, `style`, or
`script` tags. It uses documented themed components or plain semantic HTML, and
every `href="#..."` target resolves to an ID in the body source. Published
pages contain established facts only; raw mode, plan-supplied scripts and
styles, and secrets stay out of plan pages. Color is paired with visible text
and never carries status alone.
