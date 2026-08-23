# 0016 — Timeline Home Page and Archive Split

**Date:** 2026-08-23
**Status:** Accepted
**Deciders:** Gareth Hughes, Architect Agent
**Proposal:** [docs/proposals/0003-timeline-home-page.md](../proposals/0003-timeline-home-page.md)

## Context

The home page carried the whole blog: a search input, all 26 frontmatter tags as filter
pills, a featured `PostCard`, a paginated 3-up card grid. Three problems compounded.

`docs/STYLE_GUIDE.md` states that a chronological list of long-form entries should use
dividers or a rail rather than cards, and lists "Experience → `divide-y` list —
chronological timeline" as the worked example. The card grid contradicted the site's own
guide. The 26-pill tag wall was a taxonomy dump rather than navigation — most tags carry
one or two posts. And search and pagination sat on the landing page, where a first-time
visitor has not yet decided they want to search 23 posts.

The site is a static export with no server runtime, so any solution has to work with
build-time data and client-side state only.

## Options Considered

### Option A — Timeline home page, archive route for the back catalogue
- **Summary:** `/` becomes a single chronological thread of the ten most recent posts with
  five curated topic chips; `/archive/` takes the search, the full tag list, and all 23 posts.
- **Pros:** Follows the style guide; gives the back catalogue a linkable, indexable home;
  moves Fuse.js off the landing page bundle; topic chips are real navigation.
- **Cons:** One more route to maintain; topic groupings need updating as the taxonomy grows.

### Option B — Keep the card grid, drop only the tag wall
- **Summary:** Minimal edit — remove the tag pills, leave everything else.
- **Pros:** Smallest change.
- **Cons:** Leaves the style-guide violation in place and does not address search on the
  landing page. Treats the symptom.

### Option C — Timeline with raw frontmatter tag filters
- **Summary:** Timeline layout, but chips are the real tags.
- **Cons:** The tag wall is the thing being removed. Single-post tags make poor top-level
  navigation, and 26 chips would dominate the page above the fold.

### Option D — Infinite scroll on `/`, no archive route
- **Summary:** Load the timeline progressively instead of linking out.
- **Cons:** Needs client-side pagination state on a static export, and leaves the back
  catalogue with no indexable URL. Search still has nowhere sensible to live.

## Decision

> We will replace the home page body with a chronological timeline over the ten most recent
> posts, filtered by five curated topic groupings held in `lib/post-meta.ts`, and move search,
> the full tag list, and the complete post list to a new `/archive/` route.

Supporting decisions:

- **Curated topics, not raw tags.** `TOPICS` in `lib/post-meta.ts` maps four labels onto the
  canonical taxonomy (ADR 0011, ADR 0015) — Leading teams, Building with AI,
  Cloud & architecture, Side projects, plus an Everything default. A post matches a topic if
  any of its tags is in that topic's list.
- **Topics filter the whole catalogue, not the recent slice.** The unfiltered home page shows
  ten posts, but a chip searches all 23 and the timeline runs longer. Filtering only the
  recent ten meant "Cloud & architecture" surfaced 3 posts while hiding the 6 older AWS posts
  that are the best of that topic — the chip contradicted its own label. Topic tag lists are
  chosen so each matches 5–9 of 23; a chip matching most of the catalogue does no work.
- **No search box on the home page.** An input that only navigates elsewhere reads as
  broken, and searching ten posts is pointless. `/archive/` is reached from the header nav
  and from the EARLIER row.
- **No placeholder thumbnail.** Posts without a `coverImage` render no thumbnail at all.
  An empty bordered box reads as a failed image rather than as deliberate spacing.
- **Topic state is local, not URL.** Filtering ten loaded posts is ephemeral. Search, which
  is worth sharing, keeps its `?q=` / `?tag=` params on the archive.
- **`lib/post-meta.ts` splits from `lib/posts.ts`.** The post shape, formatters, lead
  extraction, and the topic map are filesystem-free so client components can import them
  without pulling `fs` into the browser bundle. `lib/posts.ts` keeps the filesystem reads.
- **Breakpoint differences are CSS, not a media-query hook.** A hook would hydrate
  inconsistently against a prerendered page.
- **Archive search state is local, mirrored to the URL.** Driving a controlled input
  directly from `useSearchParams` drops keystrokes — `router.replace` is async, so each
  keypress reads a stale value. This bug existed in `BlogList.tsx` and is fixed here.

## Rationale

Option A is the only one that resolves all three problems, and it does so by moving
machinery rather than deleting it — nothing a reader could previously do is lost, it just
lives at a URL that suits it. The style guide already prescribed the shape; this brings the
home page into line with it.

Curated topics are a deliberate editorial judgement: five groupings a reader can reason
about beat 26 they cannot. The cost is that `TOPICS` needs a line when a genuinely new area
of writing appears — cheap, and visible in review because it lives next to the taxonomy.

## Consequences

- **Positive:** Home page ships less client JS (Fuse.js moved to `/archive/`); the landing
  page reads as writing rather than chrome; one new indexable route; the dropped-keystroke
  search bug is fixed.
- **Positive:** `lib/projects.ts` removes the duplicated project list, so the home tiles and
  the projects page cannot drift.
- **Negative:** `TOPICS` is a hand-maintained mapping that will need occasional updates, and
  each label's usefulness has to be re-checked against real tag counts as posts accumulate.
- **Negative:** the home page now serialises all 23 posts to the client rather than ten. Only
  the hero carries three lead paragraphs; the rest carry one, so the payload stays small.
- **Neutral:** six of the oldest posts match no topic (Mermaid, musictutorsofsydney, Goodbye
  Jekyll, the two dotnet-on-Xubuntu posts, Base64 helper). They are reachable via Everything
  and the archive. A "misc tooling" chip to house them would recreate the grab-bag problem.
- **Negative:** One more route in the static export and the sitemap.
- **Neutral:** `components/BlogList.tsx` and `components/PostCard.tsx` are deleted. No post
  content or frontmatter changes.

## Follow-ups

- Revisit the topic groupings if a new subject area accumulates more than a couple of posts,
  or if any chip drifts past roughly half the catalogue.
- If the archive passes roughly 50 posts, reconsider year grouping or pagination there.
