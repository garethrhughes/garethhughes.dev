# 0008 — Responsive Header: Hide Name and Photography Link on Mobile

**Date:** 2026-03-29
**Status:** Accepted
**Deciders:** Gareth Hughes

## Context

At mobile viewport widths (< 640px / `sm` breakpoint), the combined header content (~446px) overflows a typical mobile viewport (~375px), causing the site name to wrap to two lines.

## Decision

> On `< sm` breakpoints, hide the "Gareth Hughes" text and the Photography nav link using `hidden sm:inline` / `hidden sm:block`. The avatar alone acts as the home link on mobile.

## Rationale

Hiding lower-priority content is the standard responsive pattern and requires no structural changes to the layout. Photography is an external link and the lowest-priority nav item. The avatar is sufficient identity at small sizes.

## Consequences

- **Positive:** No overflow at mobile widths; no layout shift
- **Negative / trade-offs:** Photography link not visible on mobile without expanding a menu
- **Risks:** None significant

## Related Decisions

None.
