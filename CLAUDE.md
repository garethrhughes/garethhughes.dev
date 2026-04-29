# CLAUDE.md — garethhughes.dev

## Project Overview

Personal blog site for Gareth Hughes, built with Next.js 16 static export. Covers technical writing, photography, and software projects. Deployed to GitHub Pages (automated) and optionally AWS S3 + CloudFront (manual).

---

## Tech Stack

### Frontend
| Concern | Choice |
|---|---|
| Framework | Next.js 16.2.1 — App Router, `output: "export"` (fully static) |
| Language | TypeScript 5, `strict: true` |
| Styling | Tailwind CSS v4, Geist font, CSS custom properties |
| State management | None — component-local state and URL search params only |
| Testing | None — intentionally test-free for a static blog |
| HTTP | None — no runtime data fetching; all data loaded at build time |
| Data fetching | Build-time filesystem reads via Server Components + `generateStaticParams` |
| Content parsing | gray-matter (frontmatter), react-markdown, remark-gfm, rehype-highlight, rehype-raw |
| Diagrams | Build-time mermaid rendering via `@mermaid-js/mermaid-cli` + Puppeteer |
| Search | Fuse.js client-side fuzzy search (`components/BlogList.tsx`) |
| Auth | None — fully public site |

### Infrastructure
| Concern | Choice |
|---|---|
| Primary deployment | GitHub Pages — automated on push to `main` |
| Secondary deployment | AWS S3 + optional CloudFront — manual via `make deploy` / `make invalidate` |
| CI/CD | GitHub Actions (`.github/workflows/deploy.yml`) — build then deploy-pages |
| IaC | None |
| Local dev | `npm run dev` — no Docker required |
| Task runner | Makefile (`deploy`, `deploy-images`, `invalidate`) |
| Config / env | Minimal — only `process.env.CI` at build time (`lib/mermaid.ts:12`) |

### Security & Compliance
| Concern | Choice |
|---|---|
| Compliance frameworks | None |
| Data classification | Not applicable — no user data collected or stored |
| Encryption at rest / transit | Managed by GitHub Pages and AWS infrastructure; not configured in this repo |
| Vulnerability scanning | Not configured (gap — see Onboarding Notes) |

---

## Repository Structure

```
/
├── .github/workflows/deploy.yml     ← GitHub Actions CI/CD
├── .opencode/skills/                ← Local AI agent skills
├── about.md                         ← About page markdown content
├── AGENTS.md                        ← Agent/AI working rules
├── CLAUDE.md                        ← This file
├── DECISIONS.md                     ← Living architectural decision log
├── Makefile                         ← S3/CloudFront deployment commands
├── app/
│   ├── about/page.tsx
│   ├── calendar/page.tsx            ← Calendar redirect (client component)
│   ├── cutting-cloud-costs-.../page.tsx  ← Legacy URL redirect
│   ├── globals.css
│   ├── layout.tsx                   ← Root layout + site metadata
│   ├── page.tsx                     ← Blog index
│   ├── posts/[slug]/page.tsx        ← Individual post + generateMetadata
│   ├── projects/page.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── BlogList.tsx                 ← Client: search + filter + pagination
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── MobileMenu.tsx
│   ├── PostCard.tsx
│   └── PostContent.tsx              ← Client: react-markdown renderer
├── docs/
│   ├── decisions/                   ← ADRs (architect / decision-log skills)
│   └── proposals/                  ← Design proposals (architect skill)
├── lib/
│   ├── mermaid.ts                   ← Build-time mermaid rendering
│   ├── posts.ts                     ← Markdown loading, parsing, sorting
│   └── puppeteer-config.json
├── posts/                           ← Blog post markdown files (20 posts)
├── public/                          ← Static assets, CNAME, images
├── scripts/
│   ├── import-hashnode.mjs
│   └── import-images.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

## Architecture Rules

### Frontend
- All data loading is build-time only via `lib/posts.ts` — no runtime API calls, no `fetch()` in components
- Default to Server Components; use `'use client'` only when browser APIs or interactivity are required (search UI, markdown renderer, redirects)
- All post data passes through `lib/posts.ts` — do not read `posts/` files from components or pages directly
- Keep `components/` presentational where possible; complex logic lives in `lib/`

### Content (Posts)
- Post files live in `posts/` and **must** be named `YYYY-MM-DD-slug.md`
- The date in the filename must match the `datePublished` frontmatter value
- The slug portion of the filename must match the `slug` frontmatter field
- `datePublished` must be ISO-8601 (e.g. `2026-04-20T00:00:00Z`) — RFC-2822 is not reliable across Node versions
- Required frontmatter fields: `title`, `datePublished`, `slug`, `tags`
- Optional: `coverImage` — falls back to `/avatar.jpeg` if absent
- Tags must use the canonical tag set (see DECISIONS.md 2026-04-19); use lowercase hyphenated format

### Metadata & Sharing
- Every routable page must have Open Graph and Twitter card metadata
- Individual posts use `generateMetadata` in `app/posts/[slug]/page.tsx`
- Keep canonical URLs, OG, and Twitter metadata aligned
- Use `/avatar.jpeg` as the stable social image fallback — do not change this path without updating all metadata references

### Legacy Redirects
- For each legacy URL, create a thin `'use client'` page under `app/` using `useRouter().replace()` — `next.config.ts` `redirects()` and server-side `redirect()` are unavailable in `output: "export"` mode

### TypeScript
- `strict: true` — all strict checks enforced; no `as any` or `: any` in production code
- No barrel `index.ts` files — import directly from the source file
- Path alias `@/*` maps to the repo root

### Observability
- None required — fully static site with no server runtime

---

## Security Rules (hard blocks)

- No credentials, tokens, or secrets committed in any file
- No hardcoded external service URLs or resource IDs in source code
- No `dangerouslySetInnerHTML` for user-supplied content
- Lockfile changes must correspond to an intentional dependency change
- `process.env` access is only permitted in build-time utilities (`lib/`) — never in components or pages

---

## Domain Model

| Entity | Description | Data Class |
|---|---|---|
| Post | Markdown blog post with YAML frontmatter | Public |
| PostMeta | Parsed frontmatter + excerpt; used for listing and routing | Public |

---

## Design & Proposal Workflow

Write a proposal in `docs/proposals/NNNN-short-kebab-case-title.md` before implementing any:
- New route, significant component, or lib module
- Change to the content parsing pipeline (`lib/posts.ts`, `lib/mermaid.ts`)
- New deployment target or CI/CD change
- New external dependency (especially devDeps with large install footprints like Puppeteer)
- Schema change to post frontmatter that affects existing posts

When a proposal is accepted, create the corresponding ADR in `docs/decisions/NNNN-title.md`
and update `DECISIONS.md` with a summary entry.

See the `architect` and `decision-log` skills for the exact proposal and ADR formats.

---

## Settled Decisions (do not revisit without a superseding ADR)

| # | Decision |
|---|---|
| 1 | Static export (`output: "export"`) — no server runtime; all data is build-time |
| 2 | Dual deployment: GitHub Pages (primary/automated) + S3/CloudFront (secondary/manual) |
| 3 | Build-time mermaid rendering via `@mermaid-js/mermaid-cli` — no client-side mermaid bundle |
| 4 | `datePublished` must be ISO-8601 — RFC-2822 is not reliably parsed across Node versions |
| 5 | Legacy URL redirects use thin client components — `next.config.ts` redirects unavailable in static export |
| 6 | `/avatar.jpeg` is the stable fallback social image — path must not change without updating all metadata |
| 7 | Dark mode removed — site is light-mode only |
| 8 | Canonical tag taxonomy defined (see DECISIONS.md 2026-04-19) |

---

## Edge Cases & Gotchas

- **Mermaid in CI**: `@mermaid-js/mermaid-cli` requires Chromium system libraries. The workflow installs them explicitly. If adding a new CI environment, replicate those `apt-get` steps.
- **Static export and redirects**: `redirects()` in `next.config.ts` and server-side `redirect()` do not work with `output: "export"`. All redirects must be client-side via `useRouter().replace()`.
- **Image optimisation disabled**: `images.unoptimized: true` in `next.config.ts` — required for static export. Do not remove this.
- **Trailing slashes**: `trailingSlash: true` in `next.config.ts` — all routes end with `/`. Keep canonical URLs consistent with this.
- **`rehype-raw` required**: Mermaid diagrams are inlined as raw HTML `<div>` tags. Without `rehype-raw` in `PostContent.tsx`, the SVG is stripped by react-markdown.
- **Tag filtering and pagination state**: `BlogList.tsx` persists search query, selected tag, and page index in URL search params — linking to a filtered view preserves state across page loads.

---

## Onboarding Notes

*Gaps between the current code and the standard rules these skills assume. Each item is a candidate for a proposal or backlog ticket.*

- **No automated dependency scanning**: Dependabot is not configured. Recommend adding `.github/dependabot.yml` for npm ecosystem updates.
- **No `npm audit` in CI**: The GitHub Actions workflow does not run `npm audit`. Consider adding it as a non-blocking step.
- **`docs/proposals/` and `docs/decisions/` did not exist**: Scaffolded as part of onboarding. These directories back the `architect` and `decision-log` skills.
- **DECISIONS.md is the current decision record**: Existing decisions live in `DECISIONS.md` as a flat log. The `decision-log` skill expects individual ADR files in `docs/decisions/`. Consider running `use the decision-log skill to import the existing entries into the index` to migrate them.
- **No analytics**: The site has no visitor analytics. This is intentional but worth a deliberate decision if that changes.
- **Mermaid build dependency is heavyweight**: `@mermaid-js/mermaid-cli` + Puppeteer adds significant install time and requires Chromium system libs in CI. If build times grow, consider pre-rendering diagrams to static files committed to the repo.
