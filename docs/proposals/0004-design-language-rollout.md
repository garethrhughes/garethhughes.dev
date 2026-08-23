# 0004 — Rolling the Timeline Design Language Across the Site

**Date:** 2026-08-23
**Status:** Accepted
**Author:** Architect Agent
**Related ADRs:** [0017](../decisions/0017-design-language-rollout.md)
**Builds on:** [0003](0003-timeline-home-page.md) / [ADR 0016](../decisions/0016-timeline-home-page-and-archive-split.md)

## Problem Statement

ADR 0016 rebuilt `/` as a timeline and introduced a distinct visual vocabulary: a mono
date gutter on a rail, flat bordered tiles, a quiet tag pill, small-caps section labels,
and an uncarded page front. The other five pages were not touched, so the site now speaks
two dialects and the seam is visible on the most-travelled path.

Six concrete problems:

1. **The deleted `PostCard` survives in the post page's related-posts aside.**
   `app/posts/[slug]/page.tsx` renders `rounded-xl border shadow-sm hover:shadow-md` cards
   with 16/9 covers and a `group-hover:scale-105` image zoom — the exact component ADR 0016
   removed from the home page, on the page every timeline click lands on.
2. **Four passive tag-pill styles and two active-filter idioms.** Timeline and archive rows
   use `bg-squirrel-50 px-[9px] py-0.5`; `/projects/` uses `bg-squirrel-100 px-2.5 py-0.5`;
   About's `StackChips` uses `bg-squirrel-100 px-3 py-1`. The home topic chip marks "active"
   as `border-squirrel-400 bg-squirrel-100 text-squirrel-700` while the archive tag marks the
   same gesture as `bg-squirrel-500 text-white`.
3. **Three page-header styles across four pages.** `/` opens with an uppercase name label
   and a `text-[22px]` lead; `/archive/`, `/projects/` and `/about/` each hand-roll a
   `text-3xl font-bold` heading. `/` and `/archive/` shipped in the *same* change.
4. **About's Experience section is a `divide-y` list that wants to be the rail.** The style
   guide already describes it as "chronological timeline — rules give the rhythm". The rail
   is the same idea with a date gutter, and it is now built.
5. **Two pages violate the metadata rule.** `CLAUDE.md` requires Open Graph and Twitter card
   metadata on every routable page. `/about/` exports `{ title: 'About' }` only; `/projects/`
   has title, description and canonical but no OG or Twitter. Both fall back to the root
   layout's site-level card.
6. **The post body has no measure cap.** The article sits in `minmax(0,1fr)` of a
   `max-w-7xl` grid, so with the 320px aside the prose runs ~900px — past a comfortable
   65–75ch, and past the `max-w-[720px]` the timeline commits to for its own lead text.

Two smaller defects found while reading: the footer is `max-w-4xl` against `max-w-7xl`
pages, so its content is visibly narrower than every page above it; and the post page
hand-rolls `toLocaleDateString('en-GB', …)` twice while `formatPostDate` already exists in
`lib/post-meta.ts`.

## Proposed Solution

Three shared primitives, then apply them page by page. No new routes, no new dependencies.

### New shared components

- **`components/TagPill.tsx`** — the passive pill lifted out of `TimelineItem.tsx`, plus a
  `TagPills` list wrapper with an optional `max` cap. One definition, five call sites.
- **`components/PageHeader.tsx`** — the quiet page front from `app/page.tsx`: an uppercase
  `label`, a `text-[19px]/[22px]` `lead`, optional children for actions. Replaces the three
  hand-rolled `text-3xl font-bold` headings.
- **`components/Rail.tsx`** — the gutter-and-thread grid extracted from `TimelineItem.tsx`
  as `Rail` + `RailRow`, so About's Experience and Skills sections and the post page's
  related list use the same geometry rather than three near-copies of it.
  `TimelineItem.tsx` keeps its own hero/row markup and consumes `Rail` for the container.

### Post detail page (`app/posts/[slug]/page.tsx`)

- Rebuild the related-posts aside as a `RailRow` list: mono stamp, title, optional 96×60
  thumbnail. No card, no shadow, no image zoom.
- Drop the `Calendar` and `Tag` lucide icons from the header; render the date through
  `formatPostDate` and the tags through `TagPill`.
- Add older/newer post navigation below the article, stamped in the mono gutter style. The
  timeline establishes a chronological model and the post page currently dead-ends.
- Cap the prose measure at `max-w-[72ch]`.

### About (`app/about/page.tsx`)

- Experience → `Rail`, with the period in the date gutter.
- Skills → `Rail` rows, category as the gutter label, pills in the thread. Keeps all
  ~40 pills, drops seven card boxes.
- Profile hero → uncarded, matching the home page's front door.
- `SectionHeading` → the small-caps label over a top rule.
- Earlier-roles table keeps the table-in-card pattern (the style guide's own worked example)
  minus the shadow.
- Add the missing OG / Twitter / canonical metadata.

### Projects (`app/projects/page.tsx`)

Project tiles **stay cards** — the style guide blesses them twice as a discrete repeatable
unit. Only the treatment changes: flat `border` + `hover:border-squirrel-300` instead of
`shadow-sm` → `shadow-md`, so the same five projects do not render as flat tiles on `/` and
lifting cards on `/projects/`. Tags → `TagPill`. Header → `PageHeader`. Add OG / Twitter.

### Archive (`app/archive/page.tsx`)

Header → `PageHeader`. The active tag adopts the home chip's idiom
(`border-squirrel-400 bg-squirrel-100 text-squirrel-700`) so one gesture has one appearance.

### Footer

`max-w-4xl` → `max-w-7xl` to line up with every page above it.

## Alternatives Considered

- **Convert `/projects/` to a timeline too.** Rejected: projects are not chronological and
  the style guide reserves cards for exactly this case. Flattening the shadow gets the
  visual consistency without misusing the pattern.
- **Leave About alone** — it is the style guide's own worked example and already complies.
  Rejected for Experience and Skills specifically: complying with the *old* guide is not the
  same as adopting the rail, and Experience is the one section on the site whose content is
  most obviously a timeline.
- **A single `Timeline` component serving posts, roles and related posts.** Rejected as
  over-abstraction: the three have different content shapes and only the geometry is shared.
  `Rail`/`RailRow` shares the geometry and nothing else.
- **Merge About's `sideProjects` into `lib/projects.ts`.** Deferred — see Out of Scope.

## Out of Scope

- **Merging About's `sideProjects` into `lib/projects.ts`.** It is the drift class
  `lib/projects.ts` was created to fix, but the About copy is CV-voiced ("gaining firsthand
  intuition for where AI accelerates delivery") and the projects copy is product-voiced. A
  naive merge loses the CV register. Sharing identity (name, url) while keeping the prose
  separate is the right shape; it needs its own change.
- **Renaming the "Blog" nav item.** "Blog" now points at a timeline of everything with
  "Archive" as a sibling; "Writing" would scan better. That is an information-architecture
  call for the site owner, not a design-language consequence.
- **`.note-preview` paragraph rhythm.** The post body inherits a *note-preview* type scale
  from Squirrel Notes — `margin-bottom: 0.75rem` between paragraphs is tight for long-form.
  Capping the measure is the high-value half; retuning the scale is a separate pass.
- **`app/calendar/` and the legacy redirect page.** Neither is a reading surface.

## Risks

- **Visual regression across five pages at once.** Mitigated by verifying each page against
  the built static output before the change is considered done.
- **`Rail` over-fitting to the timeline.** If the About and related-post uses need props the
  timeline does not, the abstraction is wrong. Mitigated by keeping `Rail` to geometry only
  — gutter width, rail border, dot — with all content passed as children.
- **Metadata churn.** Adding OG tags changes how existing URLs unfurl. This is a fix, not a
  regression: both pages currently fall back to a generic site-level card.

## Acceptance Criteria

1. No `shadow-sm` / `hover:shadow-md` card remains on `/`, `/posts/[slug]/`, `/projects/`
   or `/about/`.
2. One passive tag-pill definition (`TagPill`) is used by the timeline, archive rows,
   projects and About.
3. The active-filter appearance is identical on `/` and `/archive/`.
4. `/`, `/archive/`, `/projects/` and `/about/` share one page-header treatment.
5. Every routable page exports Open Graph and Twitter card metadata.
6. The post page renders no date through `toLocaleDateString`.
7. The post page offers navigation to the chronologically adjacent posts.
8. `npm run build`, `npx tsc --noEmit` and `npx eslint app components lib` are clean.

---

## Implementation Amendments

Recorded during implementation. Each deviates from the proposal above.

1. **Skills is a label/value `divide-y` list, not `Rail` rows.** The proposal said Skills
   would use the rail with the category in the gutter. The category names —
   "Architecture & Design", "Cloud & Infrastructure" — do not fit the rail's 96px desktop
   gutter, let alone the 52px mobile one. The section keeps the rail's *idea* (a quiet
   small-caps label on the left, content threaded on the right) at a `md:w-52` label
   column that fits them. Seven card boxes still go.

2. **`PageHeader` gained a `leading` slot.** `/about/` needs an avatar before the label and
   lead. Rather than hand-roll a second header on the one page that most needs to match the
   home page, the component takes an optional node rendered ahead of the text block.

3. **A role's period is stacked in the gutter.** `2024–Present` has no break opportunity
   and does not fit 52px on one line, so `Period` splits on the en-dash and renders the
   start year over the end. Verified on a 390px viewport.

4. **Adjacent-post navigation is a two-column grid, not a flex row.** The newest and oldest
   posts have only one neighbour, and with `flex-1` a lone link stretched across the whole
   measure. The older link is pinned to `md:col-start-2` so it stays in its own half.

5. **The post `<h1>` keeps `text-3xl font-bold`.** `PageHeader` replaced the bold heading on
   the four *index* pages. An article title is the page's content, not its chrome, and it
   matches the timeline hero's own `text-3xl font-bold`.

6. **The active chip classes were extracted too.** The proposal only called for `/archive/`
   to *adopt* the home chip's appearance, which the first pass did by copying the class
   string — recreating the exact failure mode this change exists to fix. `chipClass` now
   lives beside `TagPill` and both callers import it, so "one gesture, one look" is
   structural rather than a claim in a document.

7. **Capping the measure forced `overflow-x` onto wide post content.** `.mermaid-diagram`
   was `overflow: hidden`, so a diagram wider than the new 72ch measure would have been
   cropped without a scrollbar. Verified that today's four diagrams scale rather than clip,
   but the rule was luck; `overflow-x: auto` (plus `display: block` on tables) makes it
   correct for the next one.

### Post-review adjustments

8. **The archive shows each post's opening paragraph.** Rows were title + tags only. They
   now carry the same `lead[0]` the timeline uses, clamped to two lines — *not* `excerpt`,
   which retains a post's H1 and made rows read "OpenCode Skills OpenCode Skills Getting
   hands-on with…". `app/archive/page.tsx` switched from `getAllPostMeta()` to
   `getTimelinePosts()`; Fuse still searches `excerpt`.

9. **`line-clamp-2` needs no sibling `display` utility.** The first attempt paired it with
   `block`, which overrides line-clamp's own `display: -webkit-box` and silently disabled
   the clamp — four-line rows shipped to the screenshot before it was caught.

10. **Five related posts, not three.** Rail rows take far less vertical space than the cards
    they replaced, so the aside was mostly empty beside a long article.

11. **The post container is `max-w-[1140px]`, so the grid column *is* the measure.** Capping
    the article at 72ch inside a `1fr` column of a `max-w-7xl` grid left ~140px of dead
    space, which read as a ~190px gutter between the post and the aside. The cap stays for
    the single-column layout below `lg`, where it is still doing work.

12. **`PageHeader` gained `compact` instead of the `stacked` variant first tried.** On
    `/about/` the actions were being pushed to the far edge by `justify-between` and stranded
    ~500px from the lead they belong to. Stacking them underneath fixed the marooning but
    left the whole top-right empty; sitting them next to the lead fixes both.

13. **The `/about/` intro is two columns.** `compact` fixed the marooned CTAs but not the
    real problem: the intro prose held a 72ch measure across a 1232px page, leaving ~500px
    of dead air down the right until Skills. A `1.6fr / 1fr` split keeps the prose near 72ch
    and fills the page.

14. **The right column is recent writing, not a boxed callout.** The first attempt moved
    "Core competencies" into a flat card there; a box on a prose page read as too heavy.
    `/about/` sits on a blog, so the natural thing beside a CV is the writing itself — three
    recent posts as compact rows over dividers, matching the Skills list below, then a link
    to the archive. Core competencies went back to being the third paragraph. Thumbnails are
    off in this column: they compete with the prose beside them.

15. **`components/PostRow.tsx` was extracted for it.** The post page's related list already
    had exactly this markup. Copying it into `/about/` is how four tag-pill styles happened,
    so both callers now share one component and `PostRowList`.

16. **Archive rows carry thumbnails, and `PostThumbnail` was extracted for it.** The 96×60
    cover treatment existed in `TimelineItem` and `PostRow` already; the archive would have
    been the third copy. All three now share one component, callers passing their own
    visibility classes. Hidden below `md:` and omitted when a post has no cover, matching
    the timeline. The archive row is baseline-aligned so its date sits on the title's
    baseline, so the image takes `self-center` — baselined, it would hang below the row.

17. **`/about/` is two columns from the top, and `PageHeader` takes one `layout` enum.**
    Three attempts at the header actions failed for the same underlying reason. `compact`
    sat them after the lead, where they ended mid-page aligned to nothing. `columns` put
    them on the page grid, which aligned the edges but left the header row reading as a
    heavy left block against a thin strip pinned to the bottom of an empty cell. The actual
    problem was the *structure*: the header spanned the page while only the content below it
    was columnar.

    The grid now opens above the header, so both columns start at the same y — name, lead,
    actions and intro on the left, the recent-writing rail on the right. `PageHeader` no
    longer needs to know about page columns; it takes `layout: 'split' | 'stacked'`,
    replacing the `stacked` → `compact` → `columns` boolean churn with the discriminated
    union the TypeScript overlay asks for. `PAGE_COLUMNS` stays exported for the page grid.

18. **The recent-writing rail carries seven posts.** Three left it ending ~280px short of
    the intro beside it. Seven brings the two columns level: measured 550px against 545px
    at 1280 and above. The two still diverge as the viewport narrows and the prose wraps
    more (38px apart at 1024), which is the nature of two columns of unequal content — the
    count is tuned for the width the page is usually read at, not pinned by script.
