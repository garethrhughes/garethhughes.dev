# 0003 — Timeline Home Page

**Date:** 2026-08-23
**Status:** Accepted
**Author:** Architect Agent
**Related ADRs:** [0016](../decisions/0016-timeline-home-page-and-archive-split.md)

## Problem Statement

The home page (`app/page.tsx`) leads with a "Blog" heading, a search input, a wall of 26
tag pills, a featured `PostCard`, and a paginated 3-up card grid. Three problems:

1. **The tag wall is noise.** 26 raw frontmatter tags is a taxonomy dump, not navigation.
   Most have one or two posts.
2. **Cards fight the content.** `docs/STYLE_GUIDE.md` (§ "When to use cards and when not
   to") says a chronological list of long-form entries should use dividers or a rail, not
   cards — "Experience → `divide-y` list — chronological timeline, rules give the rhythm".
   The home page does exactly what the guide says not to do.
3. **Search and pagination sit on the landing page** where a visitor has not yet decided
   they want to search. They belong with the full back catalogue.

## Proposed Solution

Replace the home page body with a single chronological timeline, and move the search /
full-tag / full-list machinery to a new `/archive/` route.

**Home page (`app/page.tsx`)** — Server Component, four sections:

- **Intro** — name label, one-line bio, and the currently-reading block, bottom-aligned.
- **Topic filter** — five curated topic chips. Topics are curated groupings over
  frontmatter tags, not raw tags. No search box (see the amendment).
- **Timeline** — a two-column grid (date gutter + threaded rail). A hero row for the
  newest post, then nine standard rows, then an "EARLIER" row linking to the archive.
- **Built** — five project tiles. These stay cards: each is a discrete repeatable unit,
  which is exactly the case the style guide reserves cards for.

**Archive page (`app/archive/page.tsx`)** — the removed machinery, unchanged in behaviour:
Fuse.js search (`keys: ['title','tags','excerpt']`, `threshold: 0.35`), the full
alphabetical tag list, `?q=` / `?tag=` URL params, and all 23 posts as a `divide-y` list.
No pagination — 23 posts is one page.

**New files**
- `components/Timeline.tsx` — Client Component. Owns the active-topic state and renders
  the filter plus the rows.
- `components/TimelineItem.tsx` — presentational hero and standard rows.
- `components/TopicFilter.tsx` — presentational chip row.
- `components/ArchiveList.tsx` — Client Component; the search/tag/list machinery.
- `app/archive/page.tsx` — the new route, with full canonical/OG/Twitter metadata.
- `lib/projects.ts` — the project list lifted out of `app/projects/page.tsx`, plus a new
  `kind` field (a two-or-three-word label used by the home page tiles).

**Modified files**
- `lib/post-meta.ts` (new, split out of `lib/posts.ts` during implementation — see the
  amendment below) — the `PostMeta` / `TimelinePost` types, the shared markdown-stripping
  helper, `leadParagraphs(content, n)`, `formatPostDate`, `formatTimelineStamp`, and the
  `TOPICS` map.
- `lib/posts.ts` — keeps the filesystem reads; adds `getTimelinePosts()` and
  `getEarliestPostYear()`.
- `components/CurrentlyReading.tsx` — restyled to the compact 38×56 layout.
- `app/projects/page.tsx` — imports the lifted `projects` array.
- `components/Header.tsx` — "Archive" added to `navLinks` after "Blog".
- `app/sitemap.ts` — `/archive` added to the static routes.

**Deleted files**
- `components/BlogList.tsx` — superseded by `Timeline.tsx` and `ArchiveList.tsx`.
- `components/PostCard.tsx` — nothing imports it once `BlogList.tsx` is gone.

Data flow is unchanged in kind: `posts/*.md` → `lib/posts.ts` at build time → serializable
props → components. No runtime fetch, no new dependency.

## Design Decisions

### Curated topics rather than raw tags

Five chips — Everything, Leading teams, Building with AI, Cloud & architecture, Side
projects — mapped in `lib/post-meta.ts`:

```ts
export const TOPICS = {
  'Leading teams':        ['leadership', 'interviewing', 'engineering-metrics'],
  'Building with AI':     ['ai'],
  'Cloud & architecture': ['aws', 'architecture', 'serverless', 'cdk', 'terraform', 'cost-optimisation', 'devops'],
  'Side projects':        ['squirrel-notes', 'fragile', 'photography'],
} as const;
```

(Retuned during implementation — see amendment 4.)

Every tag listed exists in the canonical taxonomy (ADR 0011, extended by ADR 0015), and
every topic matches at least five posts — so no chip can render an empty timeline. The full
tag list is still reachable, on `/archive/`.

Filtering is client-side across the **whole catalogue** and stays in local state — no URL
param, no router push. Search, which does need shareable state, lives on the archive.

### Lead paragraphs rather than a single truncated excerpt

`lib/posts.ts` currently produces one 400-character `excerpt` that runs sentences together.
The timeline needs real paragraphs: three under the hero, one per standard row. A
`leadParagraphs(content, n)` helper splits the body on blank lines and applies the same
stripping as `extractExcerpt`, skipping headings, images, fenced code, and block-level HTML
so a post that opens with a diagram still yields prose.

Extraction reads raw markdown directly. It deliberately does **not** route through
`getPostBySlug`, which calls `renderMermaidBlocks` and would spin up Puppeteer once per
post on the home page build.

### Breakpoint behaviour without a media-query hook

A `useMediaQuery` hook would hydrate inconsistently against a statically exported page, so
every desktop/mobile difference is CSS:

- Rows beyond the fifth standard row are wrapped in `hidden md:contents` — `contents` keeps
  the gutter and thread as direct grid children at `md:` and up.
- The hero image is rendered twice: full-width `h-[150px]` above the lead on mobile, 400×250
  in the right-hand column on desktop. It reorders rather than hides, so one element cannot
  serve both.
- Hero paragraphs two and three are `hidden md:block`.
- The "earlier" count is two spans, one per breakpoint.

Counts are derived, never written into the markup: desktop shows 10 posts of 23, so 13
remain; mobile shows 6, so 17 remain. The "back to 2020" year is the oldest post's year.

### Cards

The only cards left on the home page are the five project tiles. The timeline hero has no
border, no background, and no shadow — the rail and the dot carry the structure. The dot's
ring is `var(--surface)` rather than `#fff` so it stays correct if a dark theme returns.

## Alternatives Considered

- **Keep the card grid, drop only the tag wall.** Cheaper, but leaves the style-guide
  violation in place and does not solve the "search on the landing page" problem.
- **Filter by raw frontmatter tags on the home page.** Rejected: the tag wall is the thing
  being removed, and single-post tags make poor top-level navigation.
- **Put search on both pages.** Rejected: searching ten posts is pointless, and two search
  inputs with different corpora is a confusing affordance.
- **Infinite scroll instead of an archive route.** Rejected: needs client-side pagination
  state and gives the back catalogue no linkable, indexable home.

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| A topic chip yields an empty timeline | All four topic tag lists cross-checked against every post's frontmatter; each matches ≥ 5 of 23 |
| `/` loses its search entry point | "Archive" is in the header nav on every page, and the EARLIER row links to it |
| Date stamps shift by a month between local (UTC+10) and CI (UTC) builds | Stamps derived with `getUTCMonth()` / `getUTCFullYear()`, never local-time getters |
| Existing `?q=` / `?tag=` links to `/` stop working | Params were never linked externally; the archive keeps the same param names |

## Impact

- **Bundle:** Fuse.js moves off the home page onto `/archive/`, so the landing page ships
  less client JS than before.
- **SEO:** one new indexable route; `/` keeps its canonical, OG, and Twitter metadata.
- **Content:** no post files change. No frontmatter schema change.
