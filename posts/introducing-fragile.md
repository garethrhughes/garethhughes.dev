---
title: "Introducing Fragile"
datePublished: 2026-04-15T00:00:00Z
slug: introducing-fragile
tags: software-development, engineering-metrics, devops
coverImage: /images/screencapture-localhost-3000-dora-2026-04-15-12_10_43.png
---

Engineering metrics aren't something developers like to talk about. But there's growing pressure for businesses to have better insight into how engineering teams are performing, and it's a complicated subject — engineering performance can't be looked at in isolation. A [Software.com Code Time Report](https://www.software.com/reports/code-time-report) based on data from over 250,000 developers found that the median developer spends just 52 minutes per day actively writing code. A [Tidelift survey](https://blog.tidelift.com/how-much-time-do-developers-spend-actually-writing-code) of nearly 400 professional developers painted a similar picture, with respondents spending less than a third of their time writing new code or improving existing code. The rest goes to maintenance, testing, meetings, and operational work.

## Why

I've used LinearB and always found the maintenance overhead unacceptable. I never reached a point where I could actually trust the results. I also think tools like it are routinely misused — a lot of the data is genuinely useful for a team looking to optimise their processes, but the moment it becomes something that's measured and reported on externally, it becomes effectively worthless. Conversations shift from "How do we optimise?" to "How do we game the system?"

What I wanted was simpler: a way to generate reports out of Jira (and maybe source control eventually). We care about DORA metrics, we care about planning accuracy, and we care about roadmap accuracy.

This is also where AI changes the equation. You don't need to pay for an expensive SaaS product that's a nightmare to configure and never quite fits your workflow. With the right prompts and a weekend, you can build something purpose-built for your team's actual needs. That's exactly what Fragile is.

## Fragile

The name is silly and deliberately tongue-in-cheek. The original working title was Wagile-2000, so it's at least an improvement over that. It does reflect reality though — these processes need constant TLC if you want to measure them meaningfully. It's easy to start a sprint with zero tickets and pull them in later. It's easy to progress a ticket that isn't in the sprint. The list goes on.

### What Fragile Does

Fragile syncs board and roadmap data from Jira using a configured API key, then splits work by sprint and quarter (or week for Kanban). It uses this data to calculate DORA metrics, planning accuracy, cycle time, and roadmap accuracy.

Without source control or release pipeline integration, deployment frequency is necessarily naive — but that was always an issue with LinearB too. Getting accurate deployment frequency required API integration or tags applied consistently across repos.

Fragile's current approach:

1. If a fix version is set, that release counts as the deployment event for those tickets
2. Otherwise, we fall back to the ticket moving to done as the deployment event

Roadmap and planning accuracy are significantly more reliable, since all of that data lives in Jira anyway. Fragile just surfaces a better reporting view of it.

The lack of source control and build pipeline integration is a limiting factor for some metrics, but with the right caveats that's fine. The goal isn't to replace a full observability stack — it's to give teams an easy snapshot of their sprints and planning.

[DORA Metrics Calculation Reference](https://my.squirrelnotes.app/public/3e263e16-8e36-4d3e-b39e-840a90160c84#fragile_)

## Example views

### DORA Metrics

![DORA Metrics](/images/screencapture-localhost-3000-dora-2026-04-15-12_10_43.png)

### Cycle Time

![Cycle Time](/images/screencapture-localhost-3000-cycle-time-2026-04-15-12_10_31.png)

### Planning Accuracy

![Planning Accuracy](/images/screencapture-localhost-3000-planning-2026-04-15-12_10_52.png)

### Roadmap Accuracy
![Roadmap Accuracy](/images/screencapture-localhost-3000-roadmap-2026-04-15-12_11_02.png)

### Gaps Report
![Gaps](/images/screencapture-localhost-3000-gaps-2026-04-15-12_11_49.png)

Fragile is still early, but it's already proving the point I cared about most: useful engineering reporting doesn't need to be bloated, expensive, or disconnected from how a team actually works.

Fragile is open source — check it out on [GitHub](https://github.com/garethrhughes/fragile).
