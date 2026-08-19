# 0002 — Currently Reading Section

**Date:** 2026-08-20
**Status:** In Progress
**Source:** Manual
**Related proposal:** docs/proposals/0002-currently-reading-section.md

## Summary

Add a "Currently Reading" section to the home page, positioned to the right of the
"Blog" header. It shows the book currently being read: title, author, and a cover image,
in a compact layout matching the height of the Blog title + subtitle (no card/border).

> **Amendment (2026-08-20):** the original design included a short synopsis and a bordered
> card. During implementation the section was slimmed to match the Blog title + subtitle
> height with the border removed, and the synopsis was dropped as it no longer fit.

## Background / Motivation

The home page currently leads with only the "Blog" heading and intro line. Surfacing what
Gareth is currently reading adds a personal, human touch to the landing page and gives
returning visitors a lightweight reason to revisit.

## Scope

**In scope**
- A single "currently reading" book displayed on the home page, to the right of the Blog
  header.
- Book fields: title, short synopsis, cover image.
- A typed build-time data source in `lib/` holding the current book.
- First book: *Leadership is Language* by L. David Marquet.

**Out of scope**
- Multiple simultaneous books or a reading history/list.
- Any admin UI, runtime fetching, or external API integration.
- Ratings, progress tracking, or affiliate links.

## Acceptance Criteria

- Given the home page, when it renders, then a "Currently Reading" section appears to the
  right of the "Blog" header on desktop and stacks sensibly below it on mobile.
- Given the section renders, then it displays the book title, a short synopsis, and a cover
  image.
- Given the first book, then it shows *Leadership is Language* by L. David Marquet.
- Given the cover image, then it has descriptive alt text and does not break the static
  export build (`images.unoptimized: true`).

## Open Questions

None.

## Notes

- Cover image will be committed to `public/reading/` and referenced by path — no runtime
  fetch, consistent with the static-export, build-time-only data convention.
- Section is a discrete, self-contained unit with an image → renders as a card per
  `docs/STYLE_GUIDE.md`.
- Light mode only (dark mode removed per DECISIONS.md).
