# 0002 — Static Export Configuration

**Date:** 2026-03-25
**Status:** Accepted
**Deciders:** Gareth Hughes

## Context

The site needs to be hosted on static hosting targets (GitHub Pages, S3) without a Node.js server runtime. Next.js supports this via `output: "export"`, but requires disabling certain features (image optimisation, server-side redirects).

## Options Considered

### Option A — Static export (`output: "export"`)
- **Summary:** Pre-render all routes to static HTML/CSS/JS at build time
- **Pros:** No server runtime required; compatible with GitHub Pages and S3; zero hosting cost
- **Cons:** No server-side redirects; no image optimisation; no ISR

### Option B — Next.js server deployment
- **Summary:** Deploy to a Node.js-capable host (Vercel, Railway, etc.)
- **Pros:** Full Next.js feature set including image optimisation and server-side redirects
- **Cons:** Hosting cost; more complex infrastructure for a simple blog

## Decision

> Configure Next.js with `output: "export"`, `trailingSlash: true`, and `images.unoptimized: true`.

## Rationale

A personal blog has no need for a server runtime. Static export eliminates hosting cost and complexity, and is fully compatible with GitHub Pages and S3.

## Consequences

- **Positive:** Zero-cost static hosting; simple deployment pipeline
- **Negative / trade-offs:** `redirects()` in `next.config.ts` and server-side `redirect()` are unavailable — all redirects must be client-side (see ADR-0007)
- **Risks:** Any future feature requiring server-side rendering would require a hosting change

## Related Decisions

- [0003](0003-dual-deployment-targets.md) — Dual deployment targets
- [0007](0007-client-side-legacy-redirects.md) — Client-side legacy URL redirects
