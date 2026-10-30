---
title: "An AI Security Reviewer for Squirrel Notes"
datePublished: "2026-10-30T00:00:00Z"
slug: "an-ai-security-reviewer-for-squirrel-notes"
tags: ai, security, software-development, squirrel-notes
---

<!-- CHECK: no coverImage yet — the other recent posts have one. -->

When I wrote [How Squirrel Notes Keeps Your Data Private](/posts/how-squirrel-notes-keeps-your-data-private/), the promise was simple: *I don't want my service to know anything about anything.* Your notes are encrypted in the browser, and the server only ever sees ciphertext.

That promise is easy to make once and hard to keep across hundreds of pull requests, most of them written by an AI. So every change that touches encryption, auth, user data or infrastructure goes past one more agent before it merges: `infosec`.

This post covers why I do it, what it's caught, what it costs, and how it's changed since March.

## What it is

`infosec` is one of the [skills](/posts/opencode-skills/) in my development workflow. It runs after the code reviewer has passed a change and before the decisions are logged and the PR is opened:

**architect → developer → reviewer → infosec → decision log → PR**

A few things make it different from the other agents:

- **It's read-only.** It can read, search and fetch, but it can't edit files or run commands. It produces a verdict and never "fixes it while it's there".
- **It returns one of three verdicts.** `APPROVED`, `REQUIRES CHANGES`, or `APPROVED WITH EXCEPTION`.
- **Every finding is mapped to an ISO 27001 Annex A control**, with a severity, a file and line, and a suggested fix.
- **Exceptions have to be written down.** An exception needs a justification, a mitigation and a row in the project's risk register. "We'll deal with it later" isn't a verdict.

`REQUIRES CHANGES` sends the work back to the developer agent, and infosec reviews it again.

## Why I do it

**I'm the only reviewer.** Squirrel Notes is a side project. There's no security team, no second engineer and no pen tester. If I don't check it, nobody does.

**Most of the code is written by AI.** The developer agent is quick and usually right. "Usually right" is fine for a button colour. It's not fine for a key-derivation parameter or an S3 bucket policy.

**The product's core promise is security.** A notes app that leaks a note title has broken its only real feature. If plaintext reaches the server or a log, the zero-knowledge claim is false, however good the editor is.

**Tests don't check what matters most here.** CI runs lint, unit tests, the build and the editor parity suite on every pull request. None of that tells you whether a new code path writes a secret to a log, or whether a control the proposal describes was ever built. That takes someone reading the change with security as their only job.

## What value it adds

Some numbers: of roughly 446 merged pull requests, 116 mention an infosec review. 32 of them record a `REQUIRES CHANGES`, and 21 ended in an approved exception. Almost half of the risk register (89 of 191 rows) came out of infosec reviews.

The numbers matter less than what it actually found:

- **A brute-force bypass on the PIN lock.** Switching between "Use passphrase instead" and "Use PIN instead" reset the failed-attempt counter, so the cooldowns and the wipe after ten wrong guesses never fired. A follow-up review then found the lock shortcut reset the same counter in one keystroke.
- **Hidden telemetry in a dependency.** The opt-in local-embeddings package for the MCP server pulls in a native ML runtime, and that runtime had a Microsoft telemetry client built in. No test looked at traffic to other hosts. Infosec found it by reading strings in the binary. For a privacy-first product, that's not an optional catch.
- **A control that existed only on paper.** The proposal, a test name and a code comment all said cached data was cleared on sign-out. In reality it only ran from Settings › Clear cache. Three documents agreed with each other and the code did something else.
- **Sign-out that didn't fully sign out.** Reviewing the device wipe, it found a fourth on-device store nobody had listed, errors that were swallowed so a failed wipe reported success, and a path that could delete a *different* account's unsynced edits.
- **An infrastructure bug the code review missed.** An API Gateway route change would have quietly excluded the default route, so every unmatched path would have returned a 500.
- **Shares that weren't tied to their owner.** Publishing a share didn't check that the note belonged to the caller. Logged as a risk the same day and fixed in the next PR.

It also keeps the paperwork honest. Because every exception becomes a risk-register row, I can see what I've chosen to live with and when I said I'd look at it again. That turned out to be as useful as the bug-finding.

## What problems it's solving

Boiled down, it addresses three problems:

1. **The developer marking its own homework.** The agent that wrote the code is the worst one to judge whether it's safe. A separate, read-only agent with a different brief comes at the change from a different angle.
2. **Drift between what I say and what the code does.** A large share of the findings aren't classic vulnerabilities. They're places where the docs, tests and code disagree about a security control.
3. **Decisions without a record.** The exception verdict forces "we'll live with this" into the risk register instead of a forgotten PR comment.

## The downsides

It's not free, and it's not a security team.

**It misses things.** Turning on rate limiting for public share links meant every rate-limited request wrote the share URL, which works as a password, into the audit log. Infosec said nothing logged it. That was true of the code it read, but it didn't follow the 429 path. The code reviewer caught it.

**Its checklist has blind spots.** It checked confidentiality, access, retention and logging. It never asked what a change meant for the person whose data it was. Four features, including an admin screen with account emails, passed every review without a data inventory or a necessity check. That gap is why I added privacy impact assessments, covered below.

**Its fixes need reviewing too.** One suggested fix for a licence check still exited successfully on failure. A fix taken from a review is still a change.

**The process around it is the weak point.** The worst failures weren't infosec's. They were the orchestrating agent:

- briefing the reviewer with a list of what had been fixed, so the reviewer confirmed the list;
- writing "conditions met" under a verdict without re-running the review;
- marking a High finding "FIXED" in five places before the re-review had run;
- recording a risk as "accepted by the product owner" when I hadn't been asked.

Every one of these is now a rule in the project, and I still check for them.

**It can't run anything.** Being read-only is a feature, but it also means no Semgrep, `npm audit` or tests of its own. The caller now has to run Semgrep and hand over the results, and infosec checks that the scan covered every changed file.

**It's expensive.** One PR went through eight infosec re-reviews. Recently two PRs went through eight and three fix rounds, mostly over Low findings and wording, and burnt through my usage. The rule now is that only a Medium or higher finding earns another round. Lows get recorded and handed over.

**It's still AI reviewing AI.** A few of the PRs say it plainly: no human or independent tool has reviewed this code yet. An agent that maps findings to ISO 27001 doesn't make the project ISO 27001 compliant.

## Adding privacy impact assessments

Security and privacy overlap, but they aren't the same question. Security asks whether the data is protected. Privacy asks whether you should have it at all, who gets to see it, and how long you keep it. Infosec was only ever asking the first one.

I noticed when I asked whether the agent knew how to do a privacy impact assessment (PIA). It didn't, and four features had already gone through without one. So the process changed:

- **Every feature doc and proposal gets a privacy screening.** Five yes/no questions: does it collect or log new data about a person, change who can see existing data, change how long data is kept or how it's deleted, add a third party or a network call that carries user data, or derive new information about people? The rule is to be literal: a new log line with an account id is a yes.
- **Any yes means a PIA before anything is built.** It records what data the change touches and why, who can see it, how long it's kept, how it's deleted, and what could go wrong for the person it's about.
- **The developer builds only what the PIA lists.** If the build drifts, the PIA is updated in the same PR.
- **The reviewer blocks a diff that logs or stores anything the PIA doesn't list**, and infosec reads the PIA against the diff. A missing PIA, or one that doesn't match the code, is `REQUIRES CHANGES`.
- **The decision is mine.** Each PIA ends with a decision I make, and the field for which privacy laws apply and on what legal basis stays marked "legal review needed" until I fill it in. The agents are explicitly not giving legal advice.

Behind it sits a data inventory, seeded from the code, that lists every piece of personal data the product holds. The privacy policy is now written against that inventory, so a change to the data changes the policy in the same PR. A small test checks the paperwork itself: every new feature doc has its five answers, and every yes links to a PIA that exists.

It's only a week old, so there are three PIAs so far. One covers a planned feature that embeds note sections for search. One covers turning on the nightly trash purge. The third covers the fix for shares not being tied to their owner. All three ended in "proceed with conditions". For the search feature, one condition is that the background indexer drops the decrypted notes from memory when the job ends, when you ask it to forget, and on exit. Each PIA also carries a review date, so the decision comes back to me instead of disappearing into a PR.

## How it's evolved

- **March 2026:** a GitHub Copilot agent and a `SECURITY.md`, added in a repository tidy-up. Its first full codebase audit found 3 Critical and 4 High issues, including a timing-unsafe comparison in an auth guard, a PBKDF2 iteration count that accepted `1`, and soft-deletes that left empty strings instead of nulls.
- **Late March:** ported to a portable skill format and made read-only.
- **May:** replaced by the generic `infosec` skill from my [skills repo](https://github.com/garethrhughes/skills), with a hand-written block of project context pasted in.
- **September and October:** the 2.0 to 2.4 releases. Twelve reviewed PRs in September, and 101 in October.
- **Late October, privacy:** the screening and PIA process above, plus a data inventory and a privacy policy written against it.
- **Late October, trimming:** the pasted project context had gone stale. It still described crypto on the main thread and a voice-dictation worker, both long gone. The agent was cut from about 22 KB to 9 KB and pointed at the project's own rules instead. That trim quietly dropped Semgrep from every review, so I put it back.
- **Now:** the agent is the generic upstream skill again. The Squirrel-specific checks sit in a "Project Gates" section shared by the developer, reviewer and infosec agents.

The direction is clear in hindsight: a generic reviewer, with the project's rules kept in one place every agent reads, rather than a project-specific copy that drifts.

## Conclusion

Would I do it again? Yes, without a doubt. It has caught real issues that the developer agent, the code reviewer and I all missed, and the risk register it produced is the best record I have of the security decisions in the product.

But I treat it as a second pair of eyes, not a sign-off I can hide behind. The most valuable thing it's done might be how often it's shown me the gap between what the docs claimed and what the code did.
