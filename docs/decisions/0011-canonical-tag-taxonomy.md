# 0011 — Normalise Post Tag Taxonomy

**Date:** 2026-04-19
**Status:** Accepted
**Deciders:** Gareth Hughes

## Context

Tags across the 20 blog posts were inconsistent — some posts had none, others had overly specific tool names mixed with broad categories. Several noise tags were in use (`programming-blogs`, `jira`, `dora`, etc.) alongside inconsistent variations of the same concept (`engineering` vs `software-engineering`).

## Decision

> Audit and retag all posts with a consistent, lowercase hyphenated taxonomy. Remove noise tags. Consolidate variants (e.g. `engineering`/`software-engineering` → `software-development`). Enforce this canonical tag set going forward.

**Canonical tag set:** `software-development`, `aws`, `ai`, `productivity`, `security`, `interviewing`, `architecture`, `linux`, `dotnet`, `typescript`, `cdk`, `terraform`, `serverless`, `devops`, `developer-setup`, `blogging`, `photography`, `engineering-metrics`, `javascript`, `web`, `notes`

## Rationale

A clean taxonomy makes tag-based filtering and content discovery predictable. Related series posts sharing identical tags improves navigation. Restricting to a canonical set prevents unbounded tag proliferation.

## Consequences

- **Positive:** Consistent tag filtering in `BlogList.tsx`; related posts share discoverable tags
- **Negative / trade-offs:** New topics may require extending the canonical set via a decision entry
- **Risks:** Tags added to new posts without consulting this list will create UI filter inconsistencies

## Related Decisions

None.
