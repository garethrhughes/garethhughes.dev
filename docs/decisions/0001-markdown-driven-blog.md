# 0001 — Convert Starter App to Markdown-Driven Personal Blog

**Date:** 2026-03-25
**Status:** Accepted
**Deciders:** Gareth Hughes

## Context

The project started as a default Next.js starter template. The goal was to establish a content-first personal blog that reads markdown files and renders post cards and individual post pages.

## Options Considered

### Option A — Markdown files in repo
- **Summary:** Store posts as `.md` files in a `posts/` directory; load at build time via Node.js `fs`
- **Pros:** Simple, no CMS dependency, version-controlled content, works with static export
- **Cons:** No GUI editor; content changes require a commit

### Option B — Headless CMS
- **Summary:** Fetch content at build time from an external CMS (Contentful, Sanity, etc.)
- **Pros:** GUI editing, media management
- **Cons:** External dependency, additional cost, complicates static build pipeline

## Decision

> Store blog posts as markdown files in `posts/`, loaded at build time via `lib/posts.ts`.

## Rationale

The site is a personal blog where content is authored by a developer comfortable with git. Markdown in the repo is simpler, fully version-controlled, and works natively with `output: "export"`. No CMS dependency is needed.

## Consequences

- **Positive:** Zero external dependencies for content; posts are versioned alongside code
- **Negative / trade-offs:** No GUI editor; adding a post requires a commit and redeploy
- **Risks:** None significant for a personal blog

## Related Decisions

- [0002](0002-static-export-config.md) — Static export configuration
