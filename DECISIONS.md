# DECISIONS

Living log of implementation and architecture decisions for this repository.

## How To Maintain This File

- Add an entry in the same task/commit where a non-trivial decision is made.
- Prefer concrete, implementation-level rationale over broad commentary.
- Reference affected files and, when useful, the commit hash.

### Entry Template

```md
## YYYY-MM-DD

### Short decision title
- Decision: What was decided.
- Why: Why this was chosen.
- Scope: Affected files/routes/components.
- Notes: Follow-ups, caveats, or migration details.
```

## 2026-08-20

### Extend tag taxonomy with product tags
- Decision: Added `fragile` and `squirrel-notes` to the canonical tag set (ADR-0011). Tagged the two Fragile posts with `fragile` and the three Squirrel Notes posts with `squirrel-notes`. Excluded the opencode-skills post (passing mentions only).
- Why: Enable product-based discovery — readers can filter to all posts about a given product, which topic tags alone cannot express.
- Scope: `posts/2026-04-15-introducing-fragile.md`, `posts/2026-08-13-how-fragile-survived-first-deployment.md`, `posts/2026-03-26-introducing-squirrel-notes.md`, `posts/2026-03-29-how-squirrel-notes-keeps-your-data-private.md`, `posts/2026-04-08-using-claude-as-a-first-class-interface-for-squirrel-notes.md`, `docs/decisions/0011`, `docs/decisions/0015`.
- Notes: ADR `docs/decisions/0015-extend-tag-taxonomy-product-tags.md`. Apply product tags only to posts genuinely about the product, not passing mentions.

### Currently Reading section on the home page
- Decision: Added a "Currently Reading" card to the right of the Blog header on the home page, backed by a typed constant in `lib/reading.ts` (title, author, synopsis, coverImage, coverAlt). Rejected a markdown+gray-matter pipeline (YAGNI for one record) and any Goodreads/external fetch (violates static-export rules). Cover committed to `public/reading/`.
- Why: Adds a personal signal to the landing page without a runtime data source; a typed constant is the smallest type-safe solution consistent with the build-time-only data convention.
- Scope: `lib/reading.ts`, `components/CurrentlyReading.tsx`, `app/page.tsx`, `public/reading/leadership-is-language.jpg`.
- Notes: Proposal `docs/proposals/0002-currently-reading-section.md`; ADR `docs/decisions/0014-currently-reading-typed-constant.md`. First book: *Leadership is Language* by L. David Marquet. Revisit with a markdown-backed approach if this grows into a reading list/history.

## 2026-06-03

### Widen landing pages to `max-w-7xl`
- Decision: Bumped the container width on Blog index, Projects, About, and Post pages from `max-w-4xl` (896px) to `max-w-7xl` (1280px). Post body content remains constrained internally for readable line length.
- Why: The previous width felt cramped on modern displays and read as a single reading column on pages that are really discovery/landing pages. Wider landing pages allow multi-column grids of posts/projects/skills without crowding.
- Scope: `app/page.tsx`, `app/projects/page.tsx`, `app/about/page.tsx`, `app/posts/[slug]/page.tsx`.
- Notes: Driving proposal: `docs/proposals/0001-wider-blog-layouts.md`. The style guide's `max-w-4xl` content default is preserved as the reading column for prose.

### Card-motif guidelines: selective use, not universal
- Decision: Cards (`rounded-xl border border-border bg-surface shadow-sm`) remain the standard component for repeatable units (post cards, project tiles, skill clusters, table wrappers, hero blocks) but should NOT be used for narrative prose, chronological timelines (experience), or single short facts (education footnote). Added a "When to use cards (and when not to)" section to the local copy of the style guide that codifies this with worked examples.
- Why: An earlier sweep that wrapped every section of the About page in a card made it read as an admin dashboard. The over-correction (dropping cards entirely) produced flat, hard-to-scan grids. The middle ground — cards for repeatable/interactive units only — matches the existing PostCard / project tile pattern and keeps prose unwrapped.
- Scope: `docs/STYLE_GUIDE.md`, `app/about/page.tsx`, `components/PostCard.tsx`, `app/projects/page.tsx`, `CLAUDE.md` (reference added).
- Notes: Style guide is also mirrored in the shared Gist (`ee15745a3c966d9573a9f84735a215f3`) for cross-project reuse.

### About page: rewrite from markdown to typed JSX
- Decision: Replaced the markdown-backed About page (`about.md` + `getAboutContent()` + `react-markdown`) with a structured `app/about/page.tsx` containing typed `roles`, `sideProjects`, `skills`, and `earlierRoles` arrays. Skills render as grouped chip clusters in cards; role/project stacks render via a shared `StackChips` helper that splits the `·` separator into pills (matching the Skills section).
- Why: The markdown approach forced uniform prose styling on what is structurally CV/portfolio data. Typed data lets each section choose the right component (cards for skills/projects, divide-y timeline for experience, table-in-card for earlier roles, plain prose for intro/education) and keeps presentation consistent with the rest of the site.
- Scope: `app/about/page.tsx` (rewritten), `lib/posts.ts` (removed `getAboutContent`), `about.md` (deleted).
- Notes: All previous content preserved verbatim in the new structure.

### Blog index: 9-per-page grid + hero on page 1
- Decision: `PAGE_SIZE` lowered from 10 to 9 so post cards fit cleanly in a 3-column grid on `lg+`. On page 1 (unfiltered) the first post renders as a full-width hero card *in addition to* 9 grid items, for 10 cards total. Subsequent pages show 9. Also fixed a pre-existing off-by-one where the old logic double-subtracted for the hero and made post-9 appear on both page 1 and page 2.
- Why: 9 divides cleanly into the responsive grid (`md:grid-cols-2 lg:grid-cols-3`); the hero treatment makes the latest post the visual anchor of the index.
- Scope: `components/BlogList.tsx`.

### Featured post card: side-by-side when cover image present
- Decision: The `featured` variant of `PostCard` now splits 50/50 image-left / content-right on `md+` when `coverImage` is set (stacks on mobile). When the post has no cover image, the text block stretches the full card width.
- Why: The previous full-bleed cover-above-text treatment made the hero too tall on wide displays and felt wasteful for posts without images. Side-by-side balances the card and keeps it scannable.
- Scope: `components/PostCard.tsx`.

### Post view: related-posts sidebar on the right
- Decision: Post page is now a two-column layout on `lg+` — article on the left (`min-w-0` to contain code blocks), a `320px` sidebar on the right showing up to 3 related posts. The sidebar is `sticky top-20` so it stays visible while scrolling long posts and is hidden when no related posts match. Related-post cards include the cover image at 16:9 when present, otherwise a text-only treatment.
- Why: Brings the post view into width-parity with the home page and creates an in-flow discovery surface without bolting on a footer module.
- Scope: `app/posts/[slug]/page.tsx`, `lib/posts.ts` (added `getRelatedPosts`).
- Notes: Related-post scoring counts shared tags; ties are broken by `datePublished` descending. The recently-completed tag audit (entry below) directly improves the quality of these recommendations.

### Backfill `coverImage` for posts with inline images
- Decision: For any post lacking a `coverImage` frontmatter field, set it to the first markdown image referenced in the body (only when the path is a real local image — Handlebars-template `<img>` snippets are excluded).
- Why: PostCard and the related-posts sidebar both render `coverImage` when present; without one, those cards fall back to text-only, which leaves visually rich posts looking flatter than necessary on the index.
- Scope: `posts/2024-11-18-cutting-cloud-costs-...md` (set to `/images/e8d22d85-2f37-487a-87ec-9e92c0e30978.png`), `posts/2024-12-03-why-rebuilding-software-is-usually-a-bad-idea.md` (set to `/images/975184ce-fe4d-4195-8dfe-2f2863302043.png`).
- Notes: All other untagged-cover posts have no inline images at all, so no further action was needed. Posts using mermaid SVG diagrams cannot currently feed a cover image (SVGs are inlined into the post HTML at build time, not written to disk as files) — flagged as a follow-up if/when needed.

### Local copy of style guide under `docs/`
- Decision: Copied the shared design/style-guide Gist into `docs/STYLE_GUIDE.md` so the project has a versioned, in-repo source of truth for visual conventions. Added a new "When to use cards (and when not to)" subsection covering: use-when / do-not-use-when rules, a worked example mapping every About-page section to its correct container, and failure-mode checklists. Updated `CLAUDE.md` to point at the new doc so future sessions consult it before restyling.
- Why: A drift between this project's actual conventions and the style guide caused a multi-step over-correction during today's design work. Having the guide in-repo (and updating it with the lessons learned) makes the rules immediately visible to anyone — human or agent — working on UI.
- Scope: `docs/STYLE_GUIDE.md` (new, copied from Gist), `CLAUDE.md` (reference added), Gist `ee15745a3c966d9573a9f84735a215f3` (synced with the new cards section).

### Tag taxonomy audit and expansion
- Decision: Re-audited every post's tags for relevance. Added three new canonical tags (`cost-optimisation`, `open-source`, `leadership`) to capture recurring themes that were under-tagged. Dropped one non-canonical noise tag (`github-pages`). Normalised the YAML-array tag format on the OpenCode/Bedrock post to comma-separated for consistency with the rest of the corpus. Per-post additions: `software-development` to the PDF generator post; `architecture` to both shared-API-Gateway posts (series consistency); `web` to the Jekyll→Hashnode post; `serverless` to the cutting-cloud-costs post; `leadership` to the rebuilding-software, interview-series, and Fragile posts; `security` to the Squirrel Notes intro; `notes` to the Squirrel data-privacy and Claude-interface posts. Removed `ai` from the Squirrel data-privacy post (the post is overwhelmingly about E2EE/security, not AI). Added `open-source` and `developer-setup` to the OpenCode Skills post; added `open-source` to the OpenCode/Bedrock post.
- Why: The previous taxonomy (set 2026-04-19) was solid but a handful of posts were under-tagged, one used a non-canonical tag, and three recurring themes (cost-optimisation, open-source, leadership) lacked dedicated tags despite being clearly applicable to multiple posts. Related-post suggestions on the post view rely on tag overlap, so better tag coverage directly improves discovery.
- Scope: All files in `posts/`.
- Notes: Current canonical tag set: `software-development`, `aws`, `ai`, `productivity`, `security`, `interviewing`, `architecture`, `linux`, `dotnet`, `typescript`, `cdk`, `terraform`, `serverless`, `devops`, `developer-setup`, `blogging`, `photography`, `engineering-metrics`, `javascript`, `web`, `notes`, `cost-optimisation`, `open-source`, `leadership`.

## 2026-04-26

### Build-time mermaid diagram rendering via @mermaid-js/mermaid-cli
- Decision: Added support for ` ```mermaid ` fenced code blocks in markdown posts, rendered to inline SVG at static build time using `@mermaid-js/mermaid-cli` (`mmdc`). Mermaid blocks are pre-processed in `lib/mermaid.ts` via `execSync`, replacing the fence with a `<div class="mermaid-diagram">…SVG…</div>` before content reaches the client. `rehype-raw` was added to `PostContent.tsx` to allow the inlined SVG HTML to pass through `react-markdown` without being stripped.
- Why: The site uses `output: "export"` (fully static). Client-side mermaid rendering (as used in squirrel-notes) would require shipping the ~7–8 MB mermaid bundle and a DOM-manipulation runtime to every reader. Build-time rendering produces zero client-side JS overhead and works with the existing static hosting pipeline. `rehype-mermaid` and `remark-mermaidjs` were considered but both require Playwright (>200 MB). `@mermaid-js/mermaid-cli` uses Puppeteer/Chromium but is the official tool with a small, reliable API (file in → SVG file out). Failures fall back gracefully to the original fenced block rather than crashing the build.
- Scope: `lib/mermaid.ts` (new), `lib/posts.ts`, `components/PostContent.tsx`, `package.json`.
- Notes: `@mermaid-js/mermaid-cli` is a dev dependency (only needed at build time). If running in CI, ensure a compatible Chromium/Chrome is available (the package bundles Puppeteer which downloads its own). Diagram styling inherits the default mermaid theme; a custom config file can be passed via `mmdc -c` if theming is needed later.

## 2026-04-20

### Style calendar redirect page within site layout
- Decision: Rewrote `app/calendar/page.tsx` to render inside the root Next.js layout (removing its own `<html>`/`<head>`/`<body>` tags) so it inherits global CSS, fonts, and the site `Header`. Added a centered card with a calendar icon and fallback link matching the site's design system. Replaced the inline `<script>` with Next.js `<Script strategy="afterInteractive">` for the JS redirect; removed the `httpEquiv` meta refresh (JS redirect is sufficient).
- Why: The previous page was an unstyled raw HTML document that bypassed the layout, appearing completely broken visually during the brief redirect window.
- Scope: `app/calendar/page.tsx`.
- Notes: `robots: { index: false }` is preserved so the page is not indexed.

## 2026-04-19

### Normalise post tag taxonomy
- Decision: Audited and retagged all 18 blog posts with a consistent, lowercase hyphenated tag taxonomy. Added tags to 7 previously untagged posts. Removed noise tags (`programming-blogs`, `jira`, `dora`, `reporting`, `wordpress`, `hashnode`, `process-improvement`, `software-engineering`). Consolidated `engineering`/`software-engineering` → `software-development`. Ensured related series posts share identical tags.
- Why: Tags were inconsistent — some posts had none, others had overly specific tool names mixed with broad categories. A clean taxonomy makes filtering and discovery predictable.
- Scope: All files in `posts/`.
- Notes: Canonical tag set in use: `software-development`, `aws`, `ai`, `productivity`, `security`, `interviewing`, `architecture`, `linux`, `dotnet`, `typescript`, `cdk`, `terraform`, `serverless`, `devops`, `developer-setup`, `blogging`, `photography`, `engineering-metrics`, `javascript`, `web`, `notes`.

## 2026-03-29

### Responsive header: hide name and Photography link on mobile
- Decision: On `< sm` breakpoints, hide the "Gareth Hughes" text and the Photography nav link using `hidden sm:inline` / `hidden sm:block`. The avatar alone acts as the home link on mobile.
- Why: Combined header content (~446px) overflows a typical mobile viewport (~375px), causing the name to wrap to two lines. Hiding lower-priority content is the standard responsive pattern and requires no structural changes.
- Scope: `components/Header.tsx`
- Notes: Photography is an external link and the lowest-priority nav item, making it the natural candidate to hide first. Name text hides cleanly at `sm` (640px); below that the avatar is sufficient identity.

## Historical Decisions (Inferred From Git History)

## 2026-03-25

### Convert starter app to markdown-driven personal blog
- Decision: Replace default Next.js starter UI with a blog homepage that reads markdown posts and renders post cards/content.
- Why: Establish the site as a content-first personal blog rather than a template app.
- Scope: `app/page.tsx`, `app/posts/[slug]/page.tsx`, `components/BlogList.tsx`, `components/PostCard.tsx`, `components/PostContent.tsx`, `lib/posts.ts`.
- Notes: Evidence from commits `1d8a9b4` and `cdc80f4`.

### Standardize static-export compatible hosting
- Decision: Configure Next.js for static export with trailing slashes and unoptimized images.
- Why: Support static hosting targets and avoid runtime image optimization requirements.
- Scope: `next.config.ts`.
- Notes: Evidence from commits `1d8a9b4` and `cdc80f4` (`output: "export"`, `trailingSlash: true`, `images.unoptimized: true`).

### Support dual deployment targets (GitHub Pages and S3)
- Decision: Keep both a GitHub Pages CI workflow and Makefile-based S3/CloudFront deployment path.
- Why: Preserve flexible deployment options across personal infra and GitHub-hosted pages.
- Scope: `.github/workflows/deploy.yml`, `Makefile`.
- Notes: Evidence from commit `cdc80f4`.

### Import legacy post content and assets via scripts
- Decision: Add import scripts and bulk-import posts/images into repo-managed markdown + public assets.
- Why: Migrate existing writing into a local, versioned content pipeline.
- Scope: `scripts/import-hashnode.mjs`, `scripts/import-images.mjs`, `posts/*.md`, `public/images/*`.
- Notes: Evidence from commit `cdc80f4`.

### Add calendar route as an explicit redirect endpoint
- Decision: Introduce a dedicated calendar page route for redirect behavior.
- Why: Provide a stable path for calendar-related navigation/integration.
- Scope: `app/calendar/page.tsx`.
- Notes: Evidence from commit `ef0685b`.

## 2026-03-26

### Add social sharing metadata for blog and posts
- Decision: Add canonical, Open Graph, and Twitter metadata for the blog index and individual blog post pages.
- Why: Improve social sharing previews and URL consistency for SEO/distribution.
- Scope: `app/page.tsx`, `app/posts/[slug]/page.tsx`.
- Notes: Use Open Graph `article` type for posts and include post tags/published date.

### Use a stable fallback social image
- Decision: Use `/avatar.jpeg` as the default social image when a post does not provide `coverImage`.
- Why: Ensure all shared links always render with an image instead of missing preview media.
- Scope: `app/page.tsx`, `app/posts/[slug]/page.tsx`, `public/avatar.jpeg`.
- Notes: Keep fallback image path stable unless explicitly migrated.

## 2026-03-29

### Client-side redirect for legacy post URL
- Decision: Create a thin client component page at `/cutting-cloud-costs-transforming-legacy-systems-with-event-driven-architecture/` that uses `useRouter().replace()` to redirect to the canonical `/posts/…/` URL.
- Why: The site uses `output: "export"` targeting GitHub Pages, so `next.config.ts` `redirects()` and server-side `redirect()` are unavailable. A static client component page is the correct approach.
- Scope: `app/cutting-cloud-costs-transforming-legacy-systems-with-event-driven-architecture/page.tsx`.
- Notes: If more legacy redirects are needed, follow the same pattern.

### Keep project and decision context in-repo
- Decision: Expand `AGENTS.md` with repository-specific conventions and require decision logging in this file.
- Why: Improve consistency for future edits and preserve rationale over time.
- Scope: `AGENTS.md`, `DECISIONS.md`.
- Notes: Add new entries for non-trivial implementation choices going forward.

## 2026-04-21

### Remove dark mode
- Decision: Removed the dark mode toggle and all dark-mode styles from the site.
- Why: Simplifies the UI and reduces maintenance overhead; the site will only render in light mode.
- Scope: `components/ThemeToggle.tsx` (deleted), `components/Header.tsx`, `components/BlogList.tsx`, `components/PostCard.tsx`, `app/about/page.tsx`, `app/projects/page.tsx`, `app/posts/[slug]/page.tsx`, `app/globals.css`, `app/layout.tsx`.
- Notes: Removed the `@variant dark` declaration, `.dark` CSS block, dark syntax-highlighting rules, the theme-init inline `<script>` in `layout.tsx`, and all `dark:` Tailwind utility classes.

## 2026-04-20

## 2026-04-20

### Normalise datePublished to ISO-8601 across all posts
- Decision: Convert all `datePublished` frontmatter values from RFC-2822 strings (e.g. `Mon, 14 Nov 2022 01:00:00 GMT`) to ISO-8601 (e.g. `2022-11-14T01:00:00Z`).
- Why: `lib/posts.ts` sorts posts via `new Date(datePublished)`. RFC-2822 parsing is implementation-dependent and produces inconsistent results across Node.js versions; ISO-8601 is the only format guaranteed by the ECMAScript spec.
- Scope: All files in `posts/`, `AGENTS.md` (updated frontmatter contract to document ISO-8601 requirement).
- Notes: `introducing-fragile.md` was already ISO-8601 and was left unchanged.

### Add robots.txt, sitemap.xml, and enhanced root metadata
- Decision: Add `app/robots.ts` and `app/sitemap.ts` using Next.js Metadata Route handlers. Enhance `app/layout.tsx` root metadata with Open Graph, Twitter card, `keywords`, `authors`, and `creator` fields.
- Why: Site had no robots.txt or sitemap — both are essential for crawler discoverability and search indexing. Root metadata lacked OG/Twitter fields, meaning social shares fell back to defaults.
- Scope: `app/robots.ts` (new), `app/sitemap.ts` (new), `app/layout.tsx`.
- Notes: Static export (`output: "export"`) requires `export const dynamic = "force-static"` on both route files. Sitemap includes static routes (`/`, `/about`, `/projects`, `/calendar`) and all dynamic post routes sourced via `getAllPostMeta()` with `datePublished` as `lastModified`.

## 2026-04-15

### Normalize draft post metadata for blog ingestion
- Decision: Convert the Fragile draft into a fully frontmatter-backed markdown post with a canonical slug and cover image.
- Why: The site parser expects consistent metadata so the post can be listed, sorted, routed, and shared correctly.
- Scope: `posts/introducing-fragile.md`.
- Notes: Use the DORA screenshot as the cover image until a dedicated social image exists.

### Make blog post images open full-size
- Decision: Wrap rendered markdown images in blog post content with direct image links that open in a new tab.
- Why: Readers can inspect screenshots at full resolution without changing the post layout.
- Scope: `components/PostContent.tsx`, `app/posts/[slug]/page.tsx`, `app/globals.css`.
- Notes: This behavior is opt-in for blog posts only; non-post content and card thumbnails keep their existing navigation behavior.
