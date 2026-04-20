---
title: "Introducing Squirrel Notes"
datePublished: 2026-03-26T00:00:00Z
slug: introducing-squirrel-notes
tags: ai, software-development, productivity, notes
coverImage: /images/screenshot2.png
---

How I build and released [Squirrel Notes](https://squirrelnotes.app) with Claude Code and Copilot. Use it for free at [Squirrel Notes](https://my.squirrelnotes.app).

![Squirrel Notes](/images/screenshot2.png)

## My first foray into AI-assisted software development

### Background

As a currently hands-off engineering leader, I haven't had much real time during work hours to stay on top of AI software development — something that was starting to make me feel quite uncomfortable.

### The problem — notes

The specific problem I wanted to solve was note-taking. I'm fully aware I'm reinventing the wheel, but that's how I've always learned. Early in my career I constantly rebuilt my personal website in different technologies.

Keeping notes has always been something I'm quite poor at, and I often still resort to just pasting things into Sublime Text.

I have a paid subscription to Standard Notes, but it's quite expensive and there's something about the interface that just doesn't work for me.

### The solution — [Squirrel Notes](https://squirrelnotes.app)

I decided to tackle these issues mostly as a learning exercise, but also to build a notes app exactly to my specification — ideally built in a way that's very cheap to operate.

And if other people want to use it, fantastic.

### Why Squirrel Notes?

I've suspected for a while that I have ADHD. It's not something I've been diagnosed with, but I wanted to build a notes app specifically for those challenges — for people who struggle to focus.

I didn't put much thought into the name; it's inspired by Dug from the movie *Up!*

![Dug shouting "Squirrel!" from Up](/images/dug-squirrel-meme.gif)

### Initial requirements

1. Full end-to-end encryption — I don't want my service to know anything about anything.
2. Sync between devices.
3. Markdown — I want to write directly in Markdown.
4. Very easy to take notes and sort them later.
5. Cheap to operate.

### Enter Claude Code

My starting point was Claude Code, I had a project scaffold with some basic instructions containting some framework and architectural decisions already defined. 

```
feat: implement Squirrel Notes full-stack application

- Scaffold NestJS backend (port 3001) and Next.js frontend (port 3000)
- Build complete UI with CodeMirror 6 editor, markdown preview, sidebar, tags
- Create backend API with entities, services, controllers for users, collections, notes, tags
- Add Auth0 integration (JWT strategy, guards, Auth0Provider)
- Implement E2E encryption (AES-256-GCM + PBKDF2 via Web Crypto API)
- Wire frontend to backend with API service layer, debounced auto-save
- Generate and run initial database migration
- Update docker-compose, docs, and CLAUDE.md for Squirrel Notes context
```

With Claude Code I very quickly got a fully working app up and running and deployed to AWS. This was the first commit, and surprisingly most of the look and feel, as it stands, came out of this first pass. The security implementation was originally somewhat simplistic but that was an issue with the prompt. 

Originally it was going to cost $20–50 per month to run, which isn't exactly expensive, but one advantage of using AWS for a decade-plus is knowing which options to use to bring costs down massively.

$20–50 is fine as the first scaling point if needed, but a few Lambdas later that estimate is more like $2–5 per month.

![Early Development Build](/images/screenshot1.png)

### Enter Copilot

While Claude Code is fantastic, the asking price was more than I wanted to pay. I was burning through my Pro credits very quickly and it started to get frustrating.

I decided to switch to Copilot — the Pro+ offering seemed good value, and I wanted to compare other tools anyway.

One of the first things I did was ask Copilot to examine `CLAUDE.md` and all the docs and create instructions better suited to Copilot.

I initially set up agents for:
- Architect
- Developer
- Reviewer

The flow of work was:
1. I give fairly vague product requirements to the Architect, and the output is an implementation plan with options, recommendations, and an entry in the decision log.
2. If I'm happy with the plan, the Developer agent is given the implementation to build.
3. If the feature is large, I have the Architect agent review what was implemented.
4. If all looks good, the Reviewer does a final pass before the work is committed.

Since then I've added the following agents:

1. **InfoSec** — as this is a zero-knowledge, end-to-end encrypted app, I wanted an agent to keep security front of mind. I use ISO 27001 as a reference point — it gives the agent a structured framework to reason about security controls and risk, without me having to reinvent that language from scratch.
2. **Technical Writer** — as features grew, my single-page Markdown help guide was becoming unfit for purpose. The Technical Writer is tasked with keeping the changelog maintained correctly and the knowledge base accurate.
3. **Product Manager** — to help me build the roadmap and GTM strategy.
4. **UX Designer** — to consider UI, UX, and accessibility improvements, and to help design new features.
5. **Release Manager** — completes the release steps, determines the next version number, updates the changelog, creates a tag, and pushes the release to GitHub.

The flow of work now looks something like this:

1. Product Manager — help define the requirements of a feature.
2. Architect — create a proposed solution and build plan.
3. Developer — implement the solution.
4. Architect — review the technical accuracy of the implementation.
5. Reviewer — code review.
6. Technical Writer — update the knowledge base.
7. Release Manager — bump the version and create a release.

This is absolutely a work in progress, and as you can see the UX Designer agent isn't being utilised in the main flow yet.

Additional features I've successfully implemented since the first iteration:

1. PWA
2. Advanced search
3. IndexedDB local cache
4. Rebuild of passphrase handling to a DEK/KEK approach
5. MCP/stdio integrated into Claude Code
6. Public notes
7. Stripe integration and Pro tier
8. Public API

### Launching

So I've managed to build a fully fleshed-out notes app very quickly, but as always the hardest part of launching any software is getting people to actually use it — and even worse, pay for it.

Luckily this has mostly been a learning experience, so I won't take the inevitable launch challenges too personally. Right now I have a notes app that serves my needs perfectly, and the hosting costs are less than Obsidian, Notion, or Standard Notes would cost me.

In fact, I wrote the first draft of this on my phone in Squirrel Notes.

### What's next

Squirrel Notes is in a good place — it does what I need, costs almost nothing to run, and I actually enjoy using it. Whether it ever gets traction beyond me is an open question, but honestly that's fine.

What I didn't expect was how much I'd get out of the process itself. Building something end-to-end with AI tooling — even a notes app — has given me a much better intuition for where this technology is genuinely useful and where it still needs a human to keep it honest. That alone was worth it.

