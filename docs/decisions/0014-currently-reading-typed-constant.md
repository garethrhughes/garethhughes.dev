# 0014 — Currently Reading Data as a Typed Constant

**Date:** 2026-08-20
**Status:** Accepted
**Deciders:** Gareth Hughes, Architect Agent
**Proposal:** [docs/proposals/0002-currently-reading-section.md](../proposals/0002-currently-reading-section.md)

## Context

The home page gained a "Currently Reading" section showing a book's title, author,
synopsis, and cover. The site is a static export with no runtime server and no external
integrations, so the data for this section must be available at build time and must not
require a runtime fetch.

## Options Considered

### Option A — Typed constant in `lib/reading.ts`
- **Summary:** A single exported `currentlyReading` object typed by a `CurrentlyReading` interface.
- **Pros:** Type-checked, zero parsing machinery, matches build-time-only convention, trivial to edit.
- **Cons:** Editing requires a code change (acceptable for a single-author blog).

### Option B — Markdown file + gray-matter in a new `reading/` content dir
- **Summary:** Mirror the `posts/` pattern with frontmatter parsing.
- **Pros:** Consistent with post loading; no code change to update.
- **Cons:** Adds a parsing pipeline for one short record — over-engineered (YAGNI).

### Option C — Fetch from Goodreads / external API
- **Summary:** Pull live reading data from an external service.
- **Cons:** Violates the static-export "no runtime fetch, no external integration" rules; Goodreads API is effectively deprecated.

## Decision

> We will store the currently-reading book as a typed constant in `lib/reading.ts` and
> commit the cover image to `public/reading/`.

## Rationale

A single short record does not justify a markdown+gray-matter pipeline, and the static
export model forbids runtime fetches. A typed constant is the smallest solution that is
type-safe and consistent with the existing build-time data convention.

## Consequences

- **Positive:** No new dependency, no parsing code, fully static, type-checked at build.
- **Negative / trade-offs:** Updating the book requires an edit to `lib/reading.ts` and a redeploy.
- **Risks:** If the section grows to a reading history/list, revisit with a markdown-backed approach.

## Related Decisions

- [0012 — Remove dark mode](0012-remove-dark-mode.md) — section is light-mode only.
