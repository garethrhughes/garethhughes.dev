# 0017 — Rolling the Timeline Design Language Across the Site

**Date:** 2026-08-23
**Status:** Accepted
**Deciders:** Gareth Hughes, Architect Agent
**Proposal:** [docs/proposals/0004-design-language-rollout.md](../proposals/0004-design-language-rollout.md)
**Builds on:** [ADR 0016](0016-timeline-home-page-and-archive-split.md)

## Context

ADR 0016 rebuilt `/` as a timeline and, in doing so, introduced a visual vocabulary the
rest of the site did not have: a mono date gutter on a rail, flat bordered tiles, one quiet
tag pill, small-caps section labels, and an uncarded page front. Only `/` and `/archive/`
were touched, so the site shipped speaking two dialects.

The seam was worst on the most-travelled path. `app/posts/[slug]/page.tsx` — where every
timeline click lands — rendered its related-posts aside as the `PostCard` that ADR 0016 had
just deleted, shadow lift and image zoom included. Beyond that: four passive tag-pill
styles, two different appearances for "this filter is active", three page-header treatments
across four pages, and a post body with no measure cap in a `max-w-7xl` grid.

Reading the pages also turned up two things that are not design language. `/about/` exported
`{ title: 'About' }` and `/projects/` had no Open Graph or Twitter tags, both violating
`CLAUDE.md`'s rule that every routable page carries them. And the footer was `max-w-4xl`
against `max-w-7xl` pages, so its content sat visibly narrower than every page above it.

## Options Considered

### Option A — Extract shared primitives, then apply them page by page
- **Summary:** Build `TagPill`, `PageHeader` and `Rail`/`RailRow`, refit the timeline onto
  them, then roll them through the post page, About, Projects, Archive and the footer.
- **Pros:** One definition per pattern, so the pages cannot drift again; the timeline is the
  first consumer, which keeps the primitives honest.
- **Cons:** Touches five pages in one change; risk of over-fitting `Rail` to the timeline.

### Option B — Copy the timeline's classes into each page
- **Summary:** No new components; paste the treatment where it is needed.
- **Cons:** Recreates exactly the divergence being fixed. Four pill styles became four
  because nobody had a single definition to reach for.

### Option C — Restyle only the post detail page
- **Summary:** Fix the resurrected `PostCard` and stop.
- **Pros:** Smallest change, highest value per line.
- **Cons:** Leaves three page-header styles and two active-filter idioms in place, and the
  metadata violations unaddressed. Defers the same decision at a higher cost.

### Option D — Convert `/projects/` to a timeline too
- **Cons:** Projects are not chronological, and `STYLE_GUIDE.md` names project tiles twice
  as the case cards exist for. Consistency here is a matter of treatment, not layout.

## Decision

> We will extract `TagPill`, `PageHeader` and `Rail` as shared primitives, refit the home
> timeline onto them, and apply them across the post detail page, About, Projects, Archive
> and the footer. Cards are kept where the style guide sanctions them and flattened to the
> home page's border-hover treatment.

Supporting decisions:

- **`Rail` is geometry only.** Gutter width, rail border, dot, and the `display: contents`
  row wrapper. Everything else is children. This is what keeps one component serving the
  post timeline, a CV, and a related-posts list without acquiring a mode flag per caller.
- **The related-posts aside becomes rail rows.** No card, no shadow, no `scale-105` zoom. It
  was the deleted `PostCard` surviving on the page most likely to be read.
- **The post page gains older/newer navigation.** A timeline sets up a chronological reading
  model; the article it leads to used to dead-end. `getAdjacentPosts` in `lib/posts.ts`.
- **Post prose is capped at `max-w-[72ch]`.** The article column runs ~900px unaided, past a
  comfortable measure and past the `max-w-[720px]` the timeline sets for its own lead text.
- **One passive pill, one active chip.** `TagPill` is the passive treatment everywhere. The
  loud filled style is reserved for the *active* state of an interactive chip, and the
  archive's active tag now looks identical to the home topic chip — one gesture, one look.
- **Cards stay where the style guide sanctions them** — project tiles, the earlier-roles
  table, About's side-project tiles — but lose `shadow-sm` → `shadow-md` in favour of
  `border` + `hover:border-squirrel-300`. The same five projects were rendering as flat
  tiles on `/` and lifting cards on `/projects/`.
- **About's Experience adopts the rail.** The style guide already called it a chronological
  timeline when it was a `divide-y` list; the rail is that idea with a date gutter.
- **Skills is a label/value list, not the rail.** Category names like
  "Cloud & Infrastructure" do not fit a 96px gutter. It keeps the rail's idea at a width
  that fits the labels, and still drops seven card boxes. See the proposal's amendments.
- **`formatPostDate` is the only date formatter.** The post page hand-rolled
  `toLocaleDateString('en-GB', …)` twice. Node here has full ICU so this was not producing
  wrong output, but it is the same class as settled decision #4 and it gave one page two
  date styles.

## Rationale

Option A is the only one that prevents recurrence. The four pill styles exist because there
was never one definition to import; copying classes a fifth time (Option B) guarantees a
fifth style. Option C is tempting — the post page really is most of the value — but it
leaves the cheap, already-diagnosed inconsistencies in place, and `/` and `/archive/` having
shipped in the same change with different `<h1>` treatments makes `PageHeader` finishing
work rather than speculative refactoring.

The `Rail` over-fitting risk was real and is what "geometry only" is there to answer. The
one place it did not fit — Skills, whose labels are too long for the gutter — was allowed
to diverge rather than have the gutter widened for every caller.

## Consequences

- **Positive:** The deleted `PostCard` is gone from the last page rendering it. One pill, one
  page header, one rail, one date formatter.
- **Positive:** Two pages that unfurled with a generic site-level card now carry their own
  Open Graph and Twitter metadata.
- **Positive:** Articles no longer dead-end, and long posts are read at a sane measure.
- **Negative:** Five pages changed in one commit. Mitigated by verifying each against the
  built static output, desktop and mobile, but the diff is wide.
- **Negative:** `Rail` is a shared component with four callers, so a change to the gutter
  geometry now moves the home page, About and the post aside together. That is the point,
  but it makes the blast radius of a tweak larger than it was.
- **Neutral:** About's `sideProjects` still duplicates identity with `lib/projects.ts`. The
  CV-voiced and product-voiced copy are genuinely different, so a naive merge would lose the
  CV register — see Follow-ups.
- **Neutral:** No content, frontmatter, route or dependency changes.

## Follow-ups

- Share project *identity* (name, url, period) between About and `lib/projects.ts` while
  keeping the two prose registers separate.
- Retune `.note-preview` for long-form reading. It is a note-preview type scale inherited
  from Squirrel Notes; `margin-bottom: 0.75rem` between paragraphs is tight for articles.
- Decide whether the "Blog" nav item should read "Writing" now that it points at a timeline
  of everything with "Archive" as a sibling. Information architecture, not design language.
