# 0009 — Normalise datePublished to ISO-8601

**Date:** 2026-04-20
**Status:** Accepted
**Deciders:** Gareth Hughes

## Context

Post frontmatter `datePublished` values were in RFC-2822 format (e.g. `Mon, 14 Nov 2022 01:00:00 GMT`). `lib/posts.ts` sorts posts via `new Date(datePublished)`. RFC-2822 parsing is implementation-dependent and produces inconsistent results across Node.js versions.

## Options Considered

### Option A — ISO-8601 (selected)
- **Summary:** `YYYY-MM-DDTHH:MM:SSZ` format
- **Pros:** Guaranteed reliable parsing by ECMAScript spec; unambiguous
- **Cons:** Requires one-time migration of all existing posts

### Option B — RFC-2822
- **Summary:** Keep existing format
- **Pros:** No migration required
- **Cons:** Parsing is implementation-dependent; may break across Node versions

## Decision

> Convert all `datePublished` frontmatter values to ISO-8601 (e.g. `2022-11-14T01:00:00Z`). Enforce ISO-8601 as the required format going forward.

## Rationale

ISO-8601 is the only date format whose parsing is guaranteed by the ECMAScript specification. RFC-2822 parsing inconsistencies across Node.js versions can silently break post ordering.

## Consequences

- **Positive:** Reliable post sorting across all Node versions; unambiguous date representation
- **Negative / trade-offs:** All existing posts required a one-time migration
- **Risks:** New posts authored with RFC-2822 dates will sort incorrectly — must be caught at authoring time

## Related Decisions

None.
