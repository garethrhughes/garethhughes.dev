# DECISIONS

Living log of implementation and architecture decisions for this repository.

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
