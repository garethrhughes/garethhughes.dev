---
name: decision-log
description: Captures and maintains architectural and technical decisions in docs/decisions/ using the ADR format. Keeps the decision index up to date. Triggered whenever a technology is chosen, a pattern is adopted, a trade-off is made, or a proposal is accepted.
compatibility: opencode
---

# Decision Log Skill

You capture, format, and maintain architectural and technical decisions made during
development. You write in the ADR (Architecture Decision Record) format and keep a running
log in `docs/decisions/` so the team has a traceable history of why the system is built the
way it is.

## Project Context

**Project:** garethhughes.dev — Personal blog site for Gareth Hughes, built with Next.js 16 static export. Covers technical writing, photography, and software projects. Deployed to GitHub Pages (automated) and optionally AWS S3 + CloudFront (manual).

**Frontend:** Next.js 16.2.1 App Router (static export) / TypeScript 5 strict / Tailwind CSS v4 + Geist font
**Auth:** None — fully public site
**Content:** gray-matter + react-markdown + remark-gfm + rehype-highlight + rehype-raw; mermaid diagrams rendered at build time via @mermaid-js/mermaid-cli
**Search:** Fuse.js client-side fuzzy search
**Testing:** None — intentionally test-free for a static blog
**Data fetching:** Build-time filesystem reads only (lib/posts.ts); no runtime server, no API routes

**Infra:** No IaC; primary deployment GitHub Pages (GitHub Actions); secondary deployment AWS S3 + CloudFront (manual Makefile)
**Local dev:** npm run dev — no Docker required
**CI/CD:** GitHub Actions (.github/workflows/deploy.yml) — build + deploy-pages jobs

**Compliance:** None
**Data classes:** Not applicable — no user data collected
**Encryption:** Managed by hosting infrastructure

**Repo structure:** app/ (routes), components/ (UI), lib/ (data/build utilities), posts/ (markdown), public/ (static assets), docs/proposals/, docs/decisions/
**Module structure:** All content loading through lib/posts.ts; lib/mermaid.ts for build-time diagram rendering; Server Components by default; 'use client' only for search/filter UI (BlogList.tsx), markdown renderer (PostContent.tsx), and legacy URL redirects.

**Key rules:**
- Static export — no server runtime; never add API routes or server-side redirects
- All data loading at build time via lib/posts.ts — no fetch() in components
- Post files: YYYY-MM-DD-slug.md with ISO-8601 datePublished and matching slug frontmatter
- Canonical tag taxonomy defined in DECISIONS.md 2026-04-19
- /avatar.jpeg is the stable social image fallback — do not change this path
- Legacy URL redirects use thin 'use client' pages (useRouter().replace()); next.config.ts redirects() unavailable in static export
- TypeScript strict: true — no as any or : any
- No barrel index.ts files
- Write a proposal in docs/proposals/ before significant changes; record decisions in docs/decisions/ and DECISIONS.md

**External integrations:** None
**Key entities:** Post (public markdown content), PostMeta (parsed frontmatter + excerpt)
**Known gotchas:** Mermaid requires Chromium system libs in CI; image optimisation disabled (required for static export); trailingSlash: true on all routes; rehype-raw required for inlined mermaid SVGs
**Open onboarding gaps:** 5 items — see CLAUDE.md ## Onboarding Notes

---

## When to Log a Decision

Log a decision whenever any of the following occur:
- A technology, library, or framework is chosen or rejected
- An architectural pattern is adopted or explicitly avoided
- A domain-specific calculation approach is finalised
- A trade-off is made between simplicity and flexibility
- An external API limitation forces a workaround
- A configuration approach is chosen (per-entity rules vs global defaults)
- An edge case resolution is agreed
- A security or auth approach is confirmed
- A proposal in `docs/proposals/` is accepted

## ADR File Naming Convention

```
docs/decisions/NNNN-short-kebab-case-title.md
```

Example: `docs/decisions/0001-cache-external-data-in-postgres.md`

Increment NNNN sequentially from the highest existing number. Start at 0001.

## ADR Format

```markdown
# NNNN — Decision Title

**Date:** YYYY-MM-DD
**Status:** Proposed | Accepted | Deprecated | Superseded by [NNNN]
**Deciders:** [list of people or agents involved]
**Proposal:** link to docs/proposals/ file if this decision originated from a proposal

## Context

What is the problem or situation that requires a decision? Include any relevant
constraints — technical, operational, or business. Keep this to 3–5 sentences.

## Options Considered

### Option A — [Name]
- **Summary:** One sentence description
- **Pros:** bullet list
- **Cons:** bullet list

### Option B — [Name]
- **Summary:** One sentence description
- **Pros:** bullet list
- **Cons:** bullet list

*(Add further options as needed)*

## Decision

State the chosen option in one sentence. Example:
> We will cache external API data in Postgres rather than querying live per request.

## Rationale

2–4 sentences explaining why this option was chosen over the alternatives.
Reference specific constraints from the Context section.

## Consequences

- **Positive:** what this decision enables or simplifies
- **Negative / trade-offs:** what this decision costs or constrains
- **Risks:** anything that could cause this decision to be revisited

## Related Decisions

- Links to other ADRs that are affected by or influenced this decision
```

## Your Workflow

When asked to log a decision:
1. List `docs/decisions/` to identify the next available NNNN
2. Create the file at `docs/decisions/NNNN-title.md` using the format above
3. Set Status to `Accepted` unless explicitly told otherwise
4. Add a one-line entry to `docs/decisions/README.md` in the decision index table

## Decision Index Format (docs/decisions/README.md)

```markdown
# Decision Log

| # | Title | Status | Date |
|---|---|---|---|
| [0001](0001-cache-external-data-in-postgres.md) | Cache external data in Postgres | Accepted | YYYY-MM-DD |
```

## When Reviewing Code

Flag any implementation that contradicts an existing ADR. Reference the ADR number in your
comment. Example:

> "This hardcodes the database host as `localhost` — ADR-0002 specifies all external
> connection details must come from `ConfigService`. Please load from config."
