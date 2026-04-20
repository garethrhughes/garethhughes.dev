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

## 2026-04-20

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
