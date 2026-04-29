# 0003 — Dual Deployment Targets (GitHub Pages + S3/CloudFront)

**Date:** 2026-03-25
**Status:** Accepted
**Deciders:** Gareth Hughes

## Context

The site needs a reliable public hosting target. GitHub Pages provides free, automated hosting tied to the repository. AWS S3 + CloudFront is a separate option with more control over CDN configuration.

## Options Considered

### Option A — GitHub Pages only
- **Summary:** Automated deployment via GitHub Actions on push to `main`
- **Pros:** Zero cost, zero config, tightly integrated with the repo
- **Cons:** Less control over CDN, caching, and custom headers

### Option B — S3/CloudFront only
- **Summary:** Manual deployment via `make deploy`
- **Pros:** Full CDN control, CloudFront invalidation support
- **Cons:** Manual trigger, AWS account required, small cost

### Option C — Both (selected)
- **Summary:** GitHub Pages as primary/automated, S3/CloudFront as secondary/manual
- **Pros:** Automated primary path; manual secondary for flexibility
- **Cons:** Two deployment targets to keep in sync

## Decision

> Maintain both a GitHub Actions workflow for GitHub Pages (automated) and a Makefile for S3/CloudFront (manual).

## Rationale

GitHub Pages provides a zero-maintenance automated path. The Makefile S3 path is preserved for situations requiring CDN-level control without adding complexity to the primary pipeline.

## Consequences

- **Positive:** Automated primary deployment; flexible secondary option
- **Negative / trade-offs:** Two targets to be aware of; `make deploy` must be run manually
- **Risks:** Drift between the two targets if not kept in sync

## Related Decisions

- [0002](0002-static-export-config.md) — Static export required for both targets
