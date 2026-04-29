# 0004 — Calendar Route as Redirect Endpoint

**Date:** 2026-03-25
**Status:** Accepted
**Deciders:** Gareth Hughes

## Context

A stable `/calendar` URL is needed to redirect visitors to an external calendar or booking link. The site uses static export, so server-side redirects are unavailable.

## Decision

> Introduce a dedicated `app/calendar/page.tsx` client component that performs a client-side redirect to an external calendar URL.

## Rationale

Provides a stable, memorable URL (`garethhughes.dev/calendar`) that can be shared and updated independently of wherever the external calendar lives. Consistent with the client-side redirect pattern required by static export (see ADR-0007).

## Consequences

- **Positive:** Stable shareable URL; external destination can change without updating shared links
- **Negative / trade-offs:** Brief redirect flash visible to users; page is excluded from search indexing (`robots: { index: false }`)
- **Risks:** None significant

## Related Decisions

- [0007](0007-client-side-legacy-redirects.md) — Client-side redirect pattern
