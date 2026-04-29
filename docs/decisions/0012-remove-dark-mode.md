# 0012 — Remove Dark Mode

**Date:** 2026-04-21
**Status:** Accepted
**Deciders:** Gareth Hughes

## Context

The site originally included a dark mode toggle (`ThemeToggle.tsx`) with a full set of `dark:` Tailwind utility classes and CSS variable overrides. This added maintenance overhead to every styling change.

## Decision

> Remove the dark mode toggle component, all `dark:` Tailwind utility classes, the `@variant dark` CSS declaration, the `.dark` CSS block, dark syntax-highlighting rules, and the theme-init inline `<script>` from `layout.tsx`. The site renders in light mode only.

## Rationale

Simplifies the UI and eliminates ongoing maintenance burden. A personal blog does not require dark mode parity for every new design element.

## Consequences

- **Positive:** Simpler CSS; no dual-theme maintenance for future styling changes
- **Negative / trade-offs:** Users who prefer dark mode will see the light theme only
- **Risks:** Reintroducing dark mode in future would require re-adding all `dark:` variants

## Related Decisions

None.
