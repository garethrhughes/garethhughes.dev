# 0001 — Wider, cardless layouts for Blog, Projects, and About

**Status:** Proposed
**Date:** 2026-06-03
**Author:** Gareth Hughes

## Context

All top-level pages (`/`, `/projects/`, `/about/`) currently share the same
`max-w-4xl` container (~896px) and lean heavily on a **card motif** — bordered,
shadowed, rounded surfaces wrapping every post, project, and the About hero.
On modern displays this leaves large empty side margins and gives the site a
"dashboard" feel rather than an editorial one. The cards also force uniform
rectangles regardless of content, which makes the blog index read as a stack
of UI tiles instead of a body of writing.

Established editorial blogs (Stripe Press, Vercel's blog, Increment, Pirijan,
Robin Rendle, Maggie Appleton) use a **wider canvas with no card chrome** —
typography, generous whitespace, and rules/dividers do the structural work
instead of borders and shadows.

Post bodies (`/posts/[slug]/`) are explicitly **out of scope** — the
reading column is already cardless and the narrow measure stays.

## Goals

- Drop the card motif site-wide. Replace bordered/shadowed surfaces with
  typography, whitespace, and lightweight dividers.
- Widen landing/listing pages so the design reads as editorial, not as a UI.
- Differentiate **landing/listing** pages (wide) from **reading** pages
  (narrow).
- Use existing Tailwind tokens — no new dependencies, no palette changes.

## Non-goals

- No change to the post reading view, typography scale, or markdown renderer.
- No change to Header, Footer, or navigation chrome.
- No dark mode (settled: DECISIONS.md).

## Proposal

### Container scale

| Role          | Tailwind class | Pixels   | Used on                           |
| ------------- | -------------- | -------- | --------------------------------- |
| Reading       | `max-w-3xl`    | 768px    | Post body                         |
| Landing       | `max-w-6xl`    | 1152px   | Blog index, Projects              |
| Hero / About  | `max-w-5xl`    | 1024px   | About page                        |

Vertical rhythm bumps from `py-10` → `py-12 md:py-16` on landing pages.

### Cardless design language

Replace the current card vocabulary as follows:

| Current                                  | Replacement                                  |
| ---------------------------------------- | -------------------------------------------- |
| `rounded-xl border border-border bg-surface shadow-sm` | bare block on page background       |
| Card-internal padding (`p-5`, `p-6`)     | vertical spacing between blocks (`py-8`, `py-10`) |
| Hover shadow lift                        | hover colour shift on the title only         |
| Card separation via gap + border         | thin horizontal rule (`border-t border-border`) between rows |
| Tag pills inside card body               | Inline tag pills under the title             |
| Cover image filling card top             | Smaller thumbnail beside the text (list rows), or a full-bleed image above the title (featured/hero) |

The pill style for tags is kept — they're inline elements, not container
chrome.

---

### 1. Blog index (`/`)

**Current:** vertical stack of `PostCard`s (bordered, shadowed) inside
`max-w-4xl`.

**Proposed:**

- Container: `max-w-6xl`.
- Page header (`Blog` + tagline) inside an inner `max-w-3xl`, left-aligned.
- **Featured post** (page 1 only, current first item): full-width editorial
  treatment — cover image at full container width, then headline, excerpt,
  meta below. No border, no card. A `border-b` rule separates it from the
  list that follows.
- **Search + tag filter row**: single horizontal bar, search left, tag
  chips right. The bar itself is a thin underline (`border-b`) rather than
  a filled pill. Sticky under the header on `md+`.
- **Remaining posts**: rendered as a **list of editorial rows**, not a
  grid of cards. Each row is:
  - On `md+`: small square thumbnail (~160px) on the left, title +
    excerpt + meta on the right, separated from siblings by `border-t`.
  - On mobile: thumbnail above title.
  - Hover state: title shifts to `squirrel-700`. No card lift.
- Pagination unchanged.

This converts the index from a tile grid into a typographic list — the
shape most editorial blogs use.

---

### 2. Projects (`/projects/`)

**Current:** vertical stack of bordered/shadowed project cards in
`max-w-4xl`. Cards with screenshots become very tall.

**Proposed:**

- Container: `max-w-6xl`.
- Vertical list of cardless project entries separated by `border-t`.
- Each entry on `md+`: screenshot (`aspect-[16/9]`, no border, rounded
  corners only on the image itself) on the left at ~40% width; name,
  description, tag pills, and action buttons on the right.
- Entries without a screenshot collapse to a single text column at the same
  width — no empty image placeholder.
- The OpenCode plugin (current first item) keeps its prominent position
  but is rendered with the same row template — its weight comes from being
  first, not from extra chrome.
- Tag pills and action buttons unchanged (already cardless elements).

---

### 3. About (`/about/`)

**Current:** profile hero rendered as a `rounded-xl border bg-surface
shadow-sm` card containing avatar, name, role, and action buttons. Markdown
body below in `max-w-4xl`.

**Proposed:**

- Outer container: `max-w-5xl`.
- **Profile hero**: drop the card entirely. Avatar (`128px`) sits to the
  left of name/role/buttons with generous whitespace. A `border-b` rule
  separates the hero block from the body.
- **Markdown body**: wrap `<PostContent>` in an inner `max-w-3xl mx-auto`
  block so prose retains comfortable measure under the wider hero.
- Action buttons (Book a call, LinkedIn, GitHub) keep their current
  outlined-button style — those are interactive controls, not container
  chrome, and they stay.

---

### Implementation sketch

Concrete edits, all in existing files:

- [components/PostCard.tsx](components/PostCard.tsx) — strip
  `rounded-*`, `border`, `bg-surface`, `shadow-*` from both variants;
  restructure the non-featured variant into a thumbnail + text row
  (`flex gap-6`, image `w-40 shrink-0 aspect-square`); add `border-t
  border-border pt-8` so siblings space themselves via the rule.
- [components/BlogList.tsx:126](components/BlogList.tsx:126) — remove
  `gap-4` on the list wrapper (rows manage their own top border + padding);
  collapse search and tags into one sticky bar.
- [app/page.tsx:40](app/page.tsx:40) — container → `max-w-6xl`, vertical
  padding → `py-12 md:py-16`.
- [app/projects/page.tsx:64-173](app/projects/page.tsx:64) — container →
  `max-w-6xl`; replace the project-card markup with a cardless row
  template (image left, text right, `border-t border-border pt-10`);
  remove `rounded-xl border bg-surface shadow-sm overflow-hidden` and
  the inner `p-6`.
- [app/about/page.tsx:16-65](app/about/page.tsx:16) — container →
  `max-w-5xl`; strip `rounded-xl border bg-surface p-8 shadow-sm` from
  the hero block; replace the wrapper with `flex gap-8 pb-10 border-b
  border-border`; wrap `<PostContent>` in `<div className="mx-auto
  max-w-3xl pt-10">`.
- No change to [app/posts/\[slug\]/page.tsx](app/posts/[slug]/page.tsx).

### Responsive behaviour

- `< 768px`: each row stacks (thumbnail above text). Rules still separate
  rows.
- `768–1152px`: side-by-side rows appear.
- `> 1152px`: container caps; whitespace absorbs extra width.

### Risks / trade-offs

- **Loss of visual scanability**: without card outlines, rows rely on
  whitespace and rules. If rule contrast is too low we lose the sense of
  separate items — verify `border-border` colour at the new density and
  bump to `border-border-strong` if needed.
- **Cover-image-less posts**: when a post has no `coverImage`, the row
  collapses to a text-only line. That's fine editorially but means the
  index can feel uneven — confirm in the browser.
- **Project entries without screenshots**: same concern; mitigated by
  collapsing to single column rather than showing an empty box.
- **About hero**: with the card chrome gone, the avatar + buttons must
  carry the visual weight. Using a larger avatar (`128px`) is the main
  compensation.

## Open questions

1. **Featured post cover image**: keep the full-bleed cover on the
   featured post (only place an image dominates), or drop covers entirely
   for a typography-led index?
2. **Row thumbnails**: include small thumbnails next to each list item, or
   go fully typographic (title + excerpt + meta only) for maximum
   editorial feel?
3. **Container width**: `max-w-6xl` (1152px) or push to `max-w-7xl`
   (1280px)? With no cards, wider is more livable than before — but the
   list rows shouldn't get so wide that the excerpt line length becomes
   uncomfortable.

## Acceptance

If accepted, follow up with an ADR in `docs/decisions/` recording (a) the
container-width convention and (b) the cardless design language, so future
pages and components don't reintroduce card chrome by default.
