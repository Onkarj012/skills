---
name: planning
description: >
  Explicit-only planning workflow for turning deep software, product,
  migration, investigation, refactor, or rollout work into an
  implementation-ready specification and an approved Waymark HTML plan. Use
  only when the user invokes $planning or /planning, says "use planning" or
  "make a deep plan", or explicitly asks to turn or publish work as a Waymark
  plan. Do not trigger for ordinary small planning questions.
---

# Planning

Turn settled decisions into one executable specification. Keep Markdown as the
canonical source and use Waymark as its polished public view.

Read [references/artifact-contract.md](references/artifact-contract.md) before
creating, publishing, or updating an artifact.

## Route the uncertainty

Inspect the relevant repository and referenced material before asserting the
current state. Separate verified facts, user decisions, and assumptions.

- If the request is already clear, structure it directly.
- If material decisions fit in one session, invoke `batch-grill-me`; fall back
  to `grilling`, then to a bounded direct interview if unavailable.
- If the destination is too foggy or large for one session, invoke `wayfinder`
  when available. Otherwise explain the limitation and continue with the
  smallest honest planning boundary.
- If a plan already exists, validate and compile it without unnecessary
  grilling.

Invoking `planning` permits this routing. It does not permit publication.

## Compile

Create one specification rather than separate documents that can drift. Cover
the destination, evidence, decisions, scope, requirements, design,
implementation phases, acceptance and verification, risks, and open questions.

Do not label the artifact `implementation-ready` while a material decision is
open. Minor non-blocking follow-ups may remain visible.

Persist the canonical Markdown and Waymark metadata using the paths and schemas
in the artifact contract. Do not make Waymark the only copy: the service cannot
return stored HTML, preserve revisions, or roll back an overwrite.

## Approve and publish

Before first publication, show the title, destination, canonical path,
permanent/TTL choice, and remaining open questions. Wait for explicit publish
approval.

Then invoke the `waymark` skill. Use themed body-only HTML, escape inserted
text, and never publish credentials or secrets. Normal project material may be
included after the plan's publication approval. Plans are permanent by default;
honor an explicit TTL.

Record the returned page ID, URL, and remote update time locally, then verify
the public URL. Return the URL plus a concise summary and canonical path.

## Maintain

Update the existing page at its stable URL. Before overwriting, compare the
remote update time with local metadata; stop on an unexpected change because
Waymark is last-writer-wins. A material scope, cost, risk, or commitment change
requires renewed approval.

Never delete automatically. Mark completed or superseded plans in both the
Markdown and HTML. Create immutable milestone snapshots only when explicitly
requested.
