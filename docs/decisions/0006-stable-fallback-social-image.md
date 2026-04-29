# 0006 — Stable Fallback Social Image

**Date:** 2026-03-26
**Status:** Accepted
**Deciders:** Gareth Hughes

## Context

Not every post has a `coverImage` frontmatter field. Social sharing metadata requires an image URL; without a fallback, shares render without any image.

## Decision

> Use `/avatar.jpeg` as the default social image for any post that does not provide a `coverImage`. This path must remain stable — do not move or rename the file without updating all metadata references.

## Rationale

A single stable fallback ensures all shared links render with an image. `/avatar.jpeg` is the author's avatar already present in `public/`, making it a natural and semantically appropriate default.

## Consequences

- **Positive:** All social shares have an image; no broken previews
- **Negative / trade-offs:** The fallback path is a hard constraint — renaming or moving the file breaks all post OG images that rely on it
- **Risks:** If the avatar is replaced, all existing cached social previews will update to show the new image

## Related Decisions

- [0005](0005-social-sharing-metadata.md) — Social sharing metadata
