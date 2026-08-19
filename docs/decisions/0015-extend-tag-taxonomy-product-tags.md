# 0015 — Extend Tag Taxonomy with Product Tags

**Date:** 2026-08-20
**Status:** Accepted
**Deciders:** Gareth Hughes
**Proposal:** N/A — direct taxonomy extension under ADR-0011's amendment process

## Context

ADR-0011 defined a canonical tag set and requires new topics to be added via a decision
entry. Several posts are specifically about two of Gareth's own products — **Fragile** and
**Squirrel Notes** — but the taxonomy had no way to group posts by product, so a reader
could not filter to "all posts about Fragile" or "all posts about Squirrel Notes".

## Options Considered

### Option A — Add product tags `fragile` and `squirrel-notes`
- **Summary:** Extend the canonical set with two lowercase-hyphenated product tags.
- **Pros:** Enables product-based discovery; consistent with the existing tag format; minimal.
- **Cons:** Grows the taxonomy; product tags differ in kind from topic tags.

### Option B — Reuse existing topic tags only
- **Summary:** Leave the taxonomy unchanged; rely on `notes`, `engineering-metrics`, etc.
- **Cons:** No way to group posts by the specific product they discuss.

## Decision

> Extend the canonical tag set with `fragile` and `squirrel-notes`. Apply `fragile` to
> posts that are about the Fragile product, and `squirrel-notes` to posts about the
> Squirrel Notes product. Passing mentions do not qualify.

**Updated canonical tag set:** `software-development`, `aws`, `ai`, `productivity`,
`security`, `interviewing`, `architecture`, `linux`, `dotnet`, `typescript`, `cdk`,
`terraform`, `serverless`, `devops`, `developer-setup`, `blogging`, `photography`,
`engineering-metrics`, `javascript`, `web`, `notes`, `fragile`, `squirrel-notes`

Tagged posts:
- `fragile`: `2026-04-15-introducing-fragile.md`, `2026-08-13-how-fragile-survived-first-deployment.md`
- `squirrel-notes`: `2026-03-26-introducing-squirrel-notes.md`, `2026-03-29-how-squirrel-notes-keeps-your-data-private.md`, `2026-04-08-using-claude-as-a-first-class-interface-for-squirrel-notes.md`

The `2026-04-29-opencode-skills.md` post mentions both products only in passing and was
deliberately excluded.

## Rationale

Product tags let readers discover the full arc of posts about a given product, which topic
tags alone cannot express. Two tags is a small, bounded extension consistent with ADR-0011's
lowercase-hyphenated convention and its stated amendment path.

## Consequences

- **Positive:** Product-based filtering in `BlogList.tsx`; discoverable product post series.
- **Negative / trade-offs:** Introduces product-name tags alongside topic tags; future products may add more.
- **Risks:** Over-tagging on passing mentions would dilute the signal — apply only to posts genuinely about the product.

## Related Decisions

- [0011 — Normalise Post Tag Taxonomy](0011-canonical-tag-taxonomy.md) — this ADR extends the canonical set defined there.
