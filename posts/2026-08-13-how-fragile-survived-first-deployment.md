---
title: "How Fragile Survived First Deployment"
datePublished: "2026-08-13T22:11:57Z"
slug: "how-fragile-survived-first-deployment"
tags: ai, engineering-metrics, leadership, software-development, fragile
coverImage: "/images/fragile-healthcheck.png"
---

When I set out to build Fragile, it was more of a fun side project. I connected it to our work Jira as the data source, but I wasn't sure it would ever be more than something to write about here.

It turned out to be a genuinely useful tool for managing my teams. With six direct reports, I'm not that involved in their day-to-day operations — I also prefer to let teams run themselves for the most part.

Fragile gave me a clear overview of where each team stood: what was driving perceived planning inaccuracy, and what was a real issue versus a team pivoting onto client work and needing time to re-establish rhythm.

The upside of actually deploying it into MyPass was that I could use MyPass AI tokens for the refinements, feature requests, and bugs that came up as a result.

## What was good

- The planning accuracy report gave great insight into how each team was being run.
- The MCP server let me use Claude to analyse each board and produce reports and recommendations for each team.
- Transparency — everyone could see what was being reported on, how it was calculated, and tips for improvement.

## What was less good

- Jira. It turns out Jira is wildly inconsistent, and accurately determining "sprint membership" can be quite clunky. This took several iterations to get right, and I had to add a debug page that dumps a ticket's raw data so I could see what was actually going on.
- Reality. The ask was weekly reporting on engineering — not something I was particularly thrilled about, but the goal was a weekly snapshot of engineering health.
  - I first built a fairly complicated pulse-check, but the maths was hard to explain.
  - What I landed on instead: (100 / all scrum tickets started in the period) * (number that were in the sprint at its start), and (100 / all scrum tickets started in the period) * (number that are on the roadmap).

## What had to change

- Snapshotting. Early on I moved away from "All" views because the queries took too long to execute. I had to bring that back and introduce time periods — 90/30/7 days — by creating snapshots on sync, so the UI stays snappy and nothing has to be recalculated on the fly.
- Login. Originally this was fully open with no admin restrictions. I first deployed it with a requirement to be on the VPN, but as adoption grew it made sense to introduce admin permissions and proper login.
- API keys. The MCP server is such a game changer that I had to keep it working after introducing login. Now you can generate API keys that give read access to the APIs via the MCP, so Claude can still access data and create reports.

## Conclusion

It's always great to actually use the software you build. I'm writing this post in Squirrel Notes right now, and I'll have Claude polish it via the MCP before I publish it to my website. Deploying Fragile into MyPass, and having it become part of our operations, is fantastic — even if it's maybe a little self-indulgent on my part.
