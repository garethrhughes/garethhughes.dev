---
title: "Using Claude as a First-Class Interface for Squirrel Notes"
datePublished: 2026-04-08T00:00:00Z
slug: squirrel-notes-claude-mcp-stdio
tags: ai, software-development, productivity
---

# Using Claude as a First-Class Interface for Squirrel Notes

When I built Squirrel Notes, the MCP integration wasn't part of the original plan. It came later, as a practical itch: I was already using Claude daily, I had a notes app I actually liked, and I kept context-switching between the two. The obvious fix was to connect them.

What wasn't obvious was how to do it without undermining the entire point of the app.

---

## The problem with a hosted MCP server

Squirrel Notes is zero-knowledge. The server stores only ciphertext. Your passphrase never leaves your browser — key derivation, encryption, and decryption all happen on your device. I have no viable path to reading your notes, and neither does anyone who compromises the server.

That's a deliberate architectural constraint, not a feature I bolted on. And it creates a real tension with giving an AI agent access to your notes.

The naive approach is a hosted MCP server: the agent calls the server, the server decrypts on behalf of the request, the agent gets readable content. That works. I built it. But it means your passphrase — or credentials derived from it — travels over a network to a server I operate. For a zero-knowledge app, that's a meaningful compromise. You're trusting my infrastructure in a way the rest of the architecture explicitly avoids.

The alternative is stdio.

---

## Why stdio

MCP supports two transports: SSE (server-sent events, hosted) and stdio (local process, spawned by the client). Claude Desktop and Claude Code both support stdio natively.

With stdio, the MCP server is a process running on your machine. The passphrase lives in a local config file. Decryption happens locally. The only thing that crosses a network is the encrypted blob fetched from the Squirrel Notes API — the same ciphertext the server stores — and the decrypted content passed to the Claude process running on your machine.

The trust boundary is your local machine. That's a boundary you already accept when you unlock the app in your browser.

```json
{
  "mcpServers": {
    "squirrel-notes": {
      "command": "npx",
      "args": ["-y", "@squirrelnotes.app/mcp"],
      "env": {
        "SQUIRREL_API_BASE_URL": "https://api.squirrelnotes.app",
        "SQUIRREL_API_KEY": "sqn_<your_api_key>",
        "SQUIRREL_PASSPHRASE": "<your_passphrase>"
      }
    }
  }
}
```

That's the full config. Drop it into your Claude Desktop `claude_desktop_config.json` and you're done.

---

## What the integration actually looks like

From Claude's side, Squirrel Notes exposes a set of tools: list notes, get a note, create a note, search, manage collections and tags, attach files. Standard MCP tool definitions.

From my side, it means I can do things like:

**Capture research outputs directly.** Finish a Claude conversation, ask it to summarise key points into a new note, and it's there — tagged, in the right collection — without me copying anything.

**Search conversationally.** "Find my notes on AWS cost optimisation" returns results across my vault. No switching apps, no manual search.

**Pipe structured content in.** I've used this for meeting notes, decision logs, technical write-ups. Give Claude a rough dump of context, ask it to structure it as a note, done.

**Reference existing notes mid-conversation.** Claude can pull in relevant notes as context without me having to paste anything. Useful when you're working across a topic you've been building up over time.

This is where it clicks. The notes app becomes a persistent memory layer for Claude, and Claude becomes a capable interface into the notes app. Neither one is doing something it wasn't already good at.

---

## The audit trail

Every MCP access — read, write, search — generates an audit event in Squirrel Notes. You can review these in the app.

I added this because it felt necessary for the trust model to be complete. If you're delegating access to your notes to an AI agent, you should be able to see what it touched and when. Not because I expect problems, but because opacity in a privacy-first tool is its own kind of problem.

---

## The honest trade-offs

**stdio requires a local process.** If you want the integration on mobile or in an environment where you can't run a local MCP server, you're back to the hosted option — which exists, but carries the passphrase caveat above.

**Your passphrase is in a config file.** That's a different threat model than keeping it in your head. If your machine is compromised, the passphrase is exposed. The same is true of any local credential store — this isn't unique to this integration — but it's worth being clear about.

**The agent can write to your notes.** By design. That's useful. It's also worth being deliberate about what you ask it to do.

---

## The workflow in practice

I didn't expect to find this as useful as I do. The friction of context-switching between a notes app and an AI assistant is small enough that you don't notice it until it's gone. 

The workflow I've landed on: Claude is where I think through things. Squirrel Notes is where I keep what matters. MCP over stdio is what stops them being separate.

---

*Squirrel Notes is free at [my.squirrelnotes.app](https://my.squirrelnotes.app). MCP setup docs are in the knowledge base.*
