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

### Keep project and decision context in-repo
- Decision: Expand `AGENTS.md` with repository-specific conventions and require decision logging in this file.
- Why: Improve consistency for future edits and preserve rationale over time.
- Scope: `AGENTS.md`, `DECISIONS.md`.
- Notes: Add new entries for non-trivial implementation choices going forward.
