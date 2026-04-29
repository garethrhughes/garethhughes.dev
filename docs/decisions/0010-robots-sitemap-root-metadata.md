# 0010 — Add robots.txt, sitemap.xml, and Enhanced Root Metadata

**Date:** 2026-04-20
**Status:** Accepted
**Deciders:** Gareth Hughes

## Context

The site had no `robots.txt` or `sitemap.xml`, making it poorly discoverable by search crawlers. The root layout metadata also lacked OG/Twitter fields, meaning social shares of the homepage fell back to defaults.

## Decision

> Add `app/robots.ts` and `app/sitemap.ts` using Next.js Metadata Route handlers with `export const dynamic = "force-static"`. Enhance `app/layout.tsx` root metadata with Open Graph, Twitter card, `keywords`, `authors`, and `creator` fields. Include all static routes and dynamic post routes in the sitemap using `getAllPostMeta()`.

## Rationale

`robots.txt` and `sitemap.xml` are essential for crawler discoverability. The `force-static` export flag is required because Next.js Metadata Route handlers are dynamic by default and incompatible with `output: "export"` without it.

## Consequences

- **Positive:** Improved search indexing; social shares of the homepage render correctly
- **Negative / trade-offs:** Sitemap must be kept in sync with route structure
- **Risks:** If new routes are added without updating the sitemap logic, they will be missing from crawl discovery

## Related Decisions

- [0005](0005-social-sharing-metadata.md) — Per-post OG/Twitter metadata
