---
title: "OpenCode Skills"
datePublished: 2026-04-29T22:00:00Z
slug: opencode-skills
tags: ai, software-development, productivity
---

## OpenCode Skills

Getting hands-on with AI-driven development means figuring out what actually works — and that looks different for every person, team, and codebase. There's no universal playbook here.

Over the past few months I've built [Squirrel Notes](https://squirrelnotes.app/), [Fragile](https://github.com/garethrhughes/fragile), this blog, and replaced my [Adobe portfolio](https://gareth.photography/) — all while evolving my approach to working with AI tools. I progressed from Claude Code to GitHub Copilot, then landed on OpenCode (while still using Copilot for some workflows).

The workflow I developed while building Fragile clicked for me, so I extracted it into a reusable set of skills you can find [here](https://github.com/garethrhughes/skills).

## The Skills

| Name | Description |
|---|---|
| [architect](https://github.com/garethrhughes/skills/blob/main/architect/SKILL.md) | Drives technical design decisions, writes proposals before significant changes, and maintains the proposal index |
| [developer](https://github.com/garethrhughes/skills/blob/main/developer/SKILL.md) | Writes production-quality TypeScript following TDD (red-green-refactor) and project conventions |
| [reviewer](https://github.com/garethrhughes/skills/blob/main/reviewer/SKILL.md) | Reviews staged changes for security, correctness, performance, IaC safety, observability, and convention adherence; returns a PASS / PASS WITH COMMENTS / BLOCK verdict with Acceptance Criteria traceability |
| [infosec](https://github.com/garethrhughes/skills/blob/main/infosec/SKILL.md) | Read-only security and compliance audit (ISO27001-aligned by default). Audits encryption, access control, audit logging, secrets, IAM, network exposure, and supply chain. Returns APPROVED / REQUIRES CHANGES / APPROVED WITH EXCEPTION |
| [decision-log](https://github.com/garethrhughes/skills/blob/main/decision-log/SKILL.md) | Captures and maintains architectural decisions (ADRs) in `docs/decisions/` with a running index |
| [dev-workflow](https://github.com/garethrhughes/skills/blob/main/dev-workflow/SKILL.md) | Full feature development cycle: proposal → implementation → review → infosec sign-off → decision logging → PR |
| [project-bootstrap](https://github.com/garethrhughes/skills/blob/main/project-bootstrap/SKILL.md) | Interactive bootstrap that asks a structured set of questions (app stack, IaC, observability, security/compliance, domain) and produces a complete CLAUDE.md and Project Context block |
| [project-onboard](https://github.com/garethrhughes/skills/blob/main/project-onboard/SKILL.md) | Interactive onboarding for an existing codebase — investigates the repo to fill in CLAUDE.md and the Project Context block, asking the user only what the code can't answer |

## How It Fits Together

The core workflow I use on Fragile follows this chain: **Architect → Developer → Reviewer → Decision Log**. I've since added an infosec skill to close the loop on security sign-off before anything reaches a PR.

The `project-bootstrap` and `project-onboard` skills handle the setup side — configuring the right context for new projects or bringing existing codebases into the workflow. I initially built this blog and my photography site with minimal process, which made them a useful proving ground for the onboarding skill.

For personal projects at least, this approach with OpenCode is working well.

## The Dev Workflow

The `dev-workflow` skill orchestrates the full feature development cycle — from proposal to merged PR — by sequencing the other skills in the right order and defining exactly when to loop back.

```mermaid
flowchart TD
    Start([New work item]) --> trivial{Trivial change?}
    trivial -- Yes --> S2
    trivial -- No --> S1

    S1["Step 1 — Design\narchitect skill\nWrite & get proposal accepted"]
    S2["Step 2 — Implementation\ndeveloper skill\nBranch → code → tests pass"]
    S3["Step 3 — Code Review\nreviewer skill\nPASS / PASS WITH COMMENTS / BLOCK"]
    S4{"Infosec\nrelevant?"}
    S4Y["Step 4 — Infosec Sign-Off\ninfosec skill\nAPPROVED / REQUIRES CHANGES"]
    S5["Step 5 — Decision Log\ndecision-log skill\nWrite ADRs, update proposal status"]
    S6["Step 6 — Pull Request\nPush branch, open PR,\nlink proposal & ADRs"]
    Done([Merged ✓])

    S1 --> S2
    S2 --> S3
    S3 -- BLOCK --> S2
    S3 -- PASS / PASS WITH COMMENTS --> S4
    S4 -- No --> S5
    S4 -- Yes --> S4Y
    S4Y -- REQUIRES CHANGES --> S2
    S4Y -- APPROVED --> S5
    S5 --> S6
    S6 --> Done
```
