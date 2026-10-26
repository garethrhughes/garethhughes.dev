---
title: "Shared Memory"
datePublished: "2026-10-26T09:32:37Z"
slug: "shared-memory"
tags: ai, software-development, productivity, notes, squirrel-notes
---

I use Claude Desktop at home and at work for similar things. At home it helps with my side projects, and in my day job I now spend most of my day in it.

I also use Claude Code and OpenCode. Each of these tools has its own memory, and each has decided for itself what's important.

I connect Squirrel Notes to all of them. I use it to store and draft documentation, and when I want to leave something until later, I'll often get Claude to save it as a note in Squirrel Notes via the [MCP server](/posts/squirrel-notes-claude-mcp-stdio/). This genuinely works really well.

## Memory

What I tried to do was create an AI memory note in Squirrel Notes, shared between all of these environments. It held things like communication preferences, ongoing projects and upcoming deadlines.

This worked really well until it didn't. The obvious gotcha is that this "memory":

1. Is massive
2. Can't be queried
3. Is difficult to update (it's encrypted)

## Squirrel Notes Memory

I picked development of Squirrel Notes back up after my son was born, and I recently released [2.0](/posts/squirrel-notes-2-0/). Next, I decided to take the memory idea and make it part of the MCP offering.

### Introducing Squirrel Notes Memory

**Memory** gives your AI agents a private, long-term memory in Squirrel Notes. Agents like Claude and Cursor can save and recall small facts about you and your work through the Squirrel Notes MCP server, so a session doesn't have to start from scratch. Like your notes, every memory is end-to-end encrypted on your device, so the text of a memory never reaches our servers.

- **Agents remember as they work:** they can save, search, update and retire memories, or pull them out of an existing note.
- **A profile for every session:** pin your most important memories and agents load them at the start of each session.
- **You review what agents write:** agent-written memories are flagged for your review, and only you can delete them.
- **Private by design:** each memory is encrypted on your device and sealed so an older copy can't be swapped back in.
- **Your own Memory page:** add, edit, pin, review and delete memories in the app.

### What's in a memory

Each memory is a short fact about one subject, filed under a category. The Memory page lets you browse them three ways:

- **State:** *Active* memories are in effect. *Superseded* memories have been replaced by a newer version, and *Invalidated* memories have been retired with a reason. Neither is deleted, so you can always see how a memory changed.
- **Category:** what kind of fact it is: a *Preference*, *Project state*, *Mental model*, *Entity fact*, *Decision* or *Reference*.
- **About:** the subject it describes, such as you, a project or your home setup.

Here are a few examples of the kind of thing my agents have saved:

| Memory | About | Category |
|---|---|---|
| Keep chat replies short: answer or result first, then only what's needed to act on it. Technical detail stays in notes unless asked. | user | Preference (pinned) |
| Job applications are tracked in the "Job Applications" note, with interview prep notes alongside. | job search | Entity fact |
| The engineering strategy is still a draft. It proposes five product teams and hasn't been adopted yet. | engineering strategy | Project state |
| Rules in Claude's instruction settings only reach the Claude apps. Other agents see Squirrel Notes memories but not those settings. | Claude surfaces | Mental model |
| The on-call tool was chosen after a proof of concept, and the pilot is live for critical incidents. | on-call | Project state (invalidated) |

Alongside the text, each memory records which agent wrote it and when, any extra keywords it can be found by, and its earlier versions. When a memory is invalidated, the reason is kept with it.

You can read more about Memory and the rest of the Squirrel Notes AI features at [squirrelnotes.app/ai](https://squirrelnotes.app/ai).
