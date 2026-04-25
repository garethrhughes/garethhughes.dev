<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Context

## What This Repo Is

- Personal blog site for garethhughes.dev.
- Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4.
- Content source: markdown files in `posts/` parsed via `gray-matter`.
- Deployment targets are static hosting (S3/GitHub Pages workflows).

## Important Paths

- `app/`: route segments and page/layout metadata.
- `components/`: shared UI components.
- `lib/posts.ts`: markdown post parsing, slug lookup, excerpt generation.
- `posts/`: blog post markdown files with frontmatter.
- `public/`: static assets (including social images).
- `DECISIONS.md`: living architectural and implementation decision log.

## Post Frontmatter Contract

Post files live in `posts/` and must be named `YYYY-MM-DD-slug.md` where the date matches the `datePublished` frontmatter value and the slug portion matches the `slug` frontmatter field. Example: `2026-04-26-mermaid-support.md`.

Expected frontmatter fields in `posts/*.md`:

- `title`
- `datePublished` — ISO-8601 format (e.g. `2026-04-20T00:00:00Z`); parsed and sorted by `new Date()` in `lib/posts.ts`
- `slug`
- `tags` (comma-separated string or string array)
- Optional: `coverImage`

`lib/posts.ts` uses frontmatter `slug` first, then filename fallback.

## Development Commands

- Install deps: `npm ci`
- Dev server: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`

## Metadata + Sharing

- Site metadata base URL is configured in `app/layout.tsx`.
- Keep canonical URLs, Open Graph, and Twitter metadata aligned for shareable routes.
- For per-post metadata, prefer `generateMetadata` in route pages.
- If `coverImage` is absent, use a stable fallback image from `public/`.

## Working Rules For Agents

- Prefer small, targeted edits; avoid broad refactors unless asked.
- Validate with lint/build when feasible after code changes.
- Preserve existing style, naming, and project conventions.
- Before using unfamiliar Next.js APIs, verify against installed Next.js docs/types.

## Decision Logging (Required)

Record non-trivial decisions in `DECISIONS.md` as part of the same task that introduced them.

Log entries should include:

1. Date
2. Decision summary
3. Why it was chosen
4. Scope/files affected
5. Follow-up notes (if any)
