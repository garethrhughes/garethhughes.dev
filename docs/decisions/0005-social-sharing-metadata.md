# 0005 — Social Sharing Metadata (Open Graph + Twitter Card)

**Date:** 2026-03-26
**Status:** Accepted
**Deciders:** Gareth Hughes

## Context

Blog posts and the site index lacked Open Graph and Twitter card metadata, causing social shares to render with no image or meaningful preview. Canonical URLs were also absent.

## Decision

> Add canonical, Open Graph (`og:type article`), and Twitter card metadata to the blog index (`app/page.tsx`) and individual post pages (`app/posts/[slug]/page.tsx` via `generateMetadata`). Include post tags and `datePublished` in article metadata.

## Rationale

OG/Twitter metadata is table-stakes for any public blog. `generateMetadata` in the App Router provides per-post metadata at build time with no runtime cost, consistent with the static export approach.

## Consequences

- **Positive:** Social shares render with title, description, image, and article metadata
- **Negative / trade-offs:** Metadata must be kept aligned with post frontmatter
- **Risks:** None

## Related Decisions

- [0006](0006-stable-fallback-social-image.md) — Stable fallback social image
