# 0013 — Build-Time Mermaid Rendering via @mermaid-js/mermaid-cli

**Date:** 2026-04-26
**Status:** Accepted
**Deciders:** Gareth Hughes

## Context

Blog posts need to render Mermaid diagram fenced code blocks (` ```mermaid `). The site uses `output: "export"` (fully static). Client-side mermaid rendering would require shipping a ~7–8 MB JavaScript bundle to every reader.

## Options Considered

### Option A — Client-side mermaid bundle
- **Summary:** Load mermaid JS in the browser and render diagrams at runtime
- **Pros:** No build complexity
- **Cons:** ~7–8 MB bundle; DOM-manipulation runtime; incompatible with the static content philosophy

### Option B — `rehype-mermaid` / `remark-mermaidjs`
- **Summary:** Remark/rehype plugins for build-time rendering
- **Pros:** Plugin-based; integrates with markdown pipeline
- **Cons:** Both require Playwright (>200 MB); heavier devDependency than needed

### Option C — `@mermaid-js/mermaid-cli` (selected)
- **Summary:** Official mermaid CLI (`mmdc`); renders SVG from a fenced block via `execSync` in `lib/mermaid.ts`; inlines result as a `<div class="mermaid-diagram">` before content reaches the client
- **Pros:** Official tool; small reliable API (file in → SVG file out); uses Puppeteer/Chromium (already acceptable); zero client-side JS overhead; failures fall back gracefully to the original fenced block
- **Cons:** Requires Chromium system libraries in CI; adds install time

## Decision

> Pre-process mermaid fenced blocks in `lib/mermaid.ts` at build time using `@mermaid-js/mermaid-cli`, replacing each fence with an inline SVG `<div>`. Add `rehype-raw` to `PostContent.tsx` to allow the inlined HTML to pass through react-markdown.

## Rationale

Build-time rendering produces zero client-side JS overhead and works with the existing static hosting pipeline. `@mermaid-js/mermaid-cli` is the official tool with a minimal, stable API. It is lighter than the Playwright-based alternatives while sharing the Puppeteer/Chromium dependency already present.

## Consequences

- **Positive:** Diagrams render as static SVG; no client bundle overhead; works offline
- **Negative / trade-offs:** CI requires Chromium system libraries (explicitly installed in `.github/workflows/deploy.yml`); `rehype-raw` must remain in `PostContent.tsx`
- **Risks:** If build times grow significantly, consider pre-rendering diagrams to static files committed to the repo

## Related Decisions

- [0002](0002-static-export-config.md) — Static export constraint motivated build-time approach
