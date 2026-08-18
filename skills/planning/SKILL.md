---
name: planning
description: >
  Explicit-only planning workflow for turning deep software, product,
  migration, investigation, refactor, or rollout work into an
  implementation-ready specification and an approval-gated visual plan. Use
  only when the user invokes $planning or /planning, says "use planning" or
  "make a deep plan", or explicitly asks to turn or publish work as a Waymark
  plan. Ordinary small planning questions remain outside this workflow.
---

# Planning

Convert settled decisions into one draft specification and an approval-gated
visual plan. Markdown is canonical; the themed body and standalone preview are
synchronized derivatives; Waymark is an approved public view.

Before any artifact work, read
[the artifact contract](references/artifact-contract.md). It is authoritative
for paths, required content, version-2 metadata, profiles, checksums, body
validation, and remote freshness.

## Run the planning sequence

### 1. Establish the planning boundary

Inspect the relevant repository and referenced material. Separate verified facts,
user decisions, and assumptions. Route uncertainty as follows:

- A clear request goes directly to structure.
- Material decisions that fit one session go through `batch-grill-me`, then
  `grilling`, then a bounded direct interview when those skills are unavailable.
- A destination too large or foggy for one session goes through `wayfinder` when
  available; otherwise use the smallest honest planning boundary and state the
  limitation.
- An existing plan is validated and compiled without unnecessary grilling.

Planning permits this routing and local artifact creation. It keeps publication,
handoff, implementation, and repository workflow actions behind the approval
boundary.

Completion criterion: the current state, evidence provenance, settled
decisions, assumptions, and selected route or explicit planning boundary are
recorded.

### 2. Compile one canonical plan

Create one specification so its sources cannot drift. Cover destination,
evidence, decisions, scope, requirements, design, ordered implementation
phases, acceptance and verification, risks, and open questions. Keep material
open decisions visible and reserve `implementation-ready` for plans with no
material decision open; minor non-blocking follow-ups may remain.

Create the canonical Markdown, body-only `.waymark.html`, version-2 metadata,
and derived standalone preview at the paths in the artifact contract. Select
the documented profile that matches the plan's dominant shape. Begin the body
with one documented plan root. Make the first orientation layer explain the
destination, change, sequence, primary risk, and completion proof before
executor detail. Use a documented component when it clarifies a meaningful
relationship, and give every diagram a caption or adjacent textual equivalent.

The artifact contains established facts only. Published plan pages use themed
body-only HTML; secrets, raw mode, and plan-supplied scripts or styles stay
outside the page.

Completion criterion: one synchronized four-file artifact exists, Markdown is
the canonical source, the root and profile satisfy the artifact contract, every
required plan area is represented, the orientation layer is complete, and each
visual has a textual equivalent.

### 3. Run the bounded quality loop

Use exactly one compose, one check, and at most one repair:

1. Compose Markdown and body-only HTML once.
2. Run one check pass: stamp metadata, run read-only structural verification,
   render the standalone preview, and inspect desktop, mobile, and print in one
   browser session.
3. If the check exposes a concrete defect, repair once and rerun only the
   failed check. If an ambitious visual is costly or unreliable, use the
   documented simpler component fallback within this same repair ceiling.

Subjective preference, decorative novelty, and a possible elaboration are not
defects. A repair that still fails ends the run with the limitation reported.

Completion criterion: the single check passes, or one failed repair has left a
specific limitation recorded; no second composition, check pass, or repair is
started.

### 4. Hold the draft at explicit approval

The state machine is:

```text
draft -> explicit approval -> publication and/or handoff named in that approval
```

Plan creation ends in `draft`; creation never implies approval. Before asking,
verify the artifact read-only and show:

- title and destination;
- canonical Markdown, body HTML, metadata, and local preview paths;
- visual profile and permanent/TTL choice;
- remaining open questions;
- one rendered preview;
- the exact actions the response would authorize.

The approval prompt enumerates each applicable action as its own authorization:

- publish the draft to a new Waymark page;
- update the existing Waymark page at its stable URL;
- hand the approved plan to an executor;
- begin implementation;
- create a branch;
- create commits;
- create an issue;
- create a pull request.

Approval authorizes only the listed actions. Until the user explicitly approves,
keep publication, handoff, implementation, repository workflow, and external
system state unchanged.

Completion criterion: the user receives a read-only verification summary and a
prompt whose separately listed actions are exactly the actions awaiting
authorization; the artifact remains `draft`.

### 5. Execute only approved actions

For an approved publication or update, invoke `waymark` with the verified
themed body-only source, escape inserted text, honor the approved permanent or
TTL choice, and keep credentials and secrets out of the page. For an approved
handoff, provide the approved plan with a short orientation summary and its
preview or public URL; include more than a naked Markdown path.

Use JSON create/update output as authoritative: after creation or update, record
the exact page ID, URL, TTL, and returned `updated_at` locally, then verify the
public URL. Approval for one action never expands to a later action.

Completion criterion: every approved action has its corresponding verified
result recorded, and every unapproved action remains untouched.

### 6. Maintain the plan and its publication record

Update an existing page only at its stable URL and only after that exact update
action is approved. Fetch `waymark get --json <id>` and use its authoritative
`updated_at` as `last_known_updated_at`. The final update must be server
enforced:

```bash
waymark update --if-updated-at "<last-known-updated-at>" --json <id> <approved-body-file>
```

For direct JSON requests, send `"if_updated_at":"<last-known-updated-at>"`.
A prior read followed by an unconditional update is not concurrency protection.
Stop on HTTP 409 or any conflict; reconcile with a fresh JSON get and renewed
approval before retrying. Record the authoritative new `updated_at` from JSON
update output. Any material scope, cost, risk, or commitment change returns the
artifact to `draft` and requires renewed approval.

Mark completed or superseded status in Markdown, body HTML, and metadata. Keep
execution progress out of the plan's role as a specification. Delete nothing
automatically; create immutable milestone snapshots only when explicitly
requested.

Completion criterion: the stable URL, server-enforced remote freshness result,
status, and local publication record are synchronized, or the run is stopped
with the HTTP 409/conflict or renewed-approval requirement documented.
