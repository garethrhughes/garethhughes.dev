# 0007 — Client-Side Redirects for Legacy URLs

**Date:** 2026-03-29
**Status:** Accepted
**Deciders:** Gareth Hughes

## Context

A post was originally published at a legacy URL path (not under `/posts/`). With `output: "export"`, `next.config.ts` `redirects()` and server-side `redirect()` are both unavailable. A mechanism is needed to redirect old URLs to their canonical `/posts/[slug]/` equivalents.

## Options Considered

### Option A — `next.config.ts` redirects()
- **Summary:** Declare redirects in Next.js config
- **Pros:** Clean, no page component required
- **Cons:** Not supported in `output: "export"` mode

### Option B — Thin `'use client'` page component
- **Summary:** Create a page at the legacy path that uses `useRouter().replace()` to redirect
- **Pros:** Works with static export; produces a static HTML file at the legacy URL
- **Cons:** Brief flash of redirect page visible to user; one file per legacy URL

## Decision

> For each legacy URL, create a thin `'use client'` page under `app/` that uses `useRouter().replace()` to redirect to the canonical URL. First instance: `app/cutting-cloud-costs-.../page.tsx`.

## Rationale

This is the only approach compatible with `output: "export"`. The redirect page can be styled (see calendar page) to avoid a jarring blank flash during the redirect window.

## Consequences

- **Positive:** Legacy URLs continue to work; users land on the correct canonical post
- **Negative / trade-offs:** One file per legacy redirect; client-side redirect is slower than a server 301
- **Risks:** If JavaScript is disabled, the redirect will not fire

## Related Decisions

- [0002](0002-static-export-config.md) — Static export constraint
- [0004](0004-calendar-redirect-route.md) — Same pattern used for calendar route
