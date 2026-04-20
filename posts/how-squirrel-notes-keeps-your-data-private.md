---
title: "How Squirrel Notes Keeps Your Data Private"
datePublished: 2026-03-29T00:00:00Z
slug: how-squirrel-notes-keeps-your-data-private
tags: ai, software-development, productivity, security
---

# How Squirrel Notes Keeps Your Data Private

When I set out to build [Squirrel Notes](https://squirrelnotes.app), the first requirement on my list wasn't sync, or markdown support, or even cost. It was this: *I don't want my service to know anything about anything.*

That's a pretty blunt way to describe end-to-end encryption, but it captures the intent exactly. I'm building a notes app. I have no business reading your notes. More importantly, if I can't read them, neither can anyone who compromises the server.

This post explains how that guarantee actually works — and where the honest limits of it are.

---

## The core idea: zero-knowledge architecture

Zero-knowledge is one of those terms that gets thrown around loosely, so it's worth being precise. In Squirrel Notes it means: **the server stores only ciphertext and has no access to the means to decrypt it.**

Everything that could be called a secret — your passphrase, your encryption keys, your note content — never leaves your browser in readable form. The server sees encrypted blobs. Even with full access to the database, there's no viable path to reading your notes.

This is enforced by design, not policy. Policy can change. Design is harder to accidentally walk back.

---

## How the keys work

The encryption model uses a two-level key hierarchy, which sounds more complicated than it is.

Your **passphrase** is the root of everything. It never gets sent to the server — key derivation runs entirely in your browser using the Web Crypto API. From the passphrase, the browser derives a **Key Encryption Key (KEK)** using PBKDF2 with 600,000 iterations. That iteration count is high by design: each guess at your passphrase is computationally expensive.

The KEK isn't used to encrypt your notes directly. Instead, it encrypts a separate randomly generated **Data Encryption Key (DEK)** — a random 256-bit AES-GCM key that does the actual work. The encrypted ("wrapped") DEK is the only key material stored server-side, and it's useless without the KEK to unwrap it.

```
Passphrase (stays in your browser — never transmitted)
    │
    │  PBKDF2-SHA-256, 600,000 iterations
    ▼
KEK — Key Encryption Key (lives in memory only)
    │
    │  AES-256-GCM
    ▼
wrappedDek (stored server-side — useless without KEK)
    │
    │  Unwrap with KEK
    ▼
DEK — encrypts your actual content
```

Why the two-level design? It means you can **change your passphrase without re-encrypting all your notes**. The DEK stays the same; only the wrapper changes. One database row is updated instead of every piece of content you've ever written.

---

## What the server actually stores

Here's a concrete breakdown of what lands in the database:

| What it is | How it's stored |
|---|---|
| Note content, note title | AES-256-GCM ciphertext |
| Collection names, tag names | AES-256-GCM ciphertext |
| Attachment filenames | AES-256-GCM ciphertext |
| Your wrapped DEK | AES-256-GCM ciphertext (encrypted with your KEK) |
| PBKDF2 salt | Plaintext (non-secret; needed to derive your KEK on the next login) |
| Structural data (IDs, sort order, icon colour) | Plaintext |

The PBKDF2 salt being in plaintext is intentional and not a security problem — it's needed to derive the KEK from your passphrase, and it's computationally worthless without the passphrase itself.

File attachments follow the same model. They're encrypted in the browser before upload; the server never receives the plaintext file. The upload goes via a presigned S3 URL that bypasses the backend entirely.

---

## Logging in and unlocking

When you unlock the app, the browser fetches your salt, a key verification value, and your wrapped DEK. It derives the KEK from your passphrase and the salt, then uses the key verification check to confirm you've typed the right passphrase before attempting any decryption. If the passphrase is wrong, nothing happens — no server round-trip, no error from the API.

If the passphrase is correct, the DEK is unwrapped and stored in IndexedDB as a **non-extractable** `CryptoKey`. Non-extractable means the browser's `exportKey()` will throw — the raw key bytes can't be pulled out of memory by JavaScript code, including injected scripts. An attacker who manages to run code in your browser tab while it's unlocked can use the key as a decryption oracle, but they can't steal the key itself and take it elsewhere.

When you close the tab, the session sentinel is cleared and the IndexedDB entry is deleted. The next open starts fresh.

---

## PIN unlock

The PIN is an optional convenience layer for quick re-entry. It encrypts your raw DEK bytes and stores them locally — no server involved. It never encrypts your passphrase.

Brute-force is limited by progressive delays that kick in after five failed attempts, and the PIN is hard-cleared after ten. The fail count survives page reloads via `sessionStorage`, so refreshing the page doesn't reset it.

---

## Public sharing

You can share individual notes publicly, and the zero-knowledge model holds even there.

When you share a note, you supply a share passphrase in the browser. A separate share key is derived from it (via PBKDF2, same parameters), and the note content is re-encrypted with that share key before being sent to the server. The server stores share ciphertext — not your DEK-encrypted content, a fresh re-encryption with the share key.

Recipients get the ciphertext, the IV, and the PBKDF2 salt. They decrypt in their browser using the share passphrase you give them out-of-band. The server never sees the share passphrase and cannot decrypt the share.

---

## The AI agent question

This one deserves honesty, because it's where the model gets more complicated.

The MCP server gives AI agents — like Claude — programmatic access to your notes. Because the notes are end-to-end encrypted, the MCP server has to perform decryption on your behalf to give the agent readable content.

This is a deliberate and informed trust delegation. You choose to give your passphrase to the MCP client. The credentials are per-request and never persisted by the server; the keys live only in Lambda memory for the duration of the invocation. But the fundamental fact is: if you use the MCP integration, you are trusting the MCP runtime with your passphrase.

For desktop use, the stdio transport is the better path — the passphrase sits in a local config file and never travels over a network. Every MCP access generates an audit event you can review in the app.

If you're not using the MCP server, none of this applies. Your passphrase stays in your browser.

---

## Where the honest limits are

No security architecture is perfect, and I'd rather be upfront about the trade-offs than pretend they don't exist.

**Client-side search only.** Because the server can't read your content, it can't index it either. All search runs in your browser after decryption. It works fine, but it means heavy search on large vaults can be slow on underpowered devices.

**Lost passphrase means lost data.** There's no server-side recovery. If you forget your passphrase and have no recovery code, your data is gone. This is a direct consequence of the zero-knowledge model. The recovery code feature exists for exactly this reason — please generate one.

**`unsafe-inline` in the Content Security Policy.** Next.js uses inline scripts for theme detection on page load, which requires `unsafe-inline` in the CSP's `script-src`. This weakens XSS protection at the CSP layer. The non-extractable IDB key limits the worst-case outcome, but it's a known gap. A nonce-based CSP is on the roadmap.

---

## The short version

If Squirrel Notes' servers were compromised tomorrow, the attacker would get a database full of AES-256-GCM ciphertext, some PBKDF2 salts, and wrapped DEKs that are useless without the passphrases that never left your browser.

That's the guarantee. It's not marketing language — it's how the code is written.

If you want to dig into the specifics, the full security architecture document is available [here](https://my.squirrelnotes.app/public/cef7da65-5f56-4e76-9746-c61a130cac5f#squirrelnotes).

---

*Squirrel Notes is free to use at [my.squirrelnotes.app](https://my.squirrelnotes.app).*
