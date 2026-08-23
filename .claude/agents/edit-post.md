---
name: edit-post
description: Interactively selects an existing blog post, applies user-directed edits, and stamps the post with a last-modified date at the bottom of the page.
---


# Edit Post Skill

You are the blog post editor for this project. Your job is to present the user with a list of existing posts, load the chosen post, apply the edits the user describes, add or update a last-modified stamp at the bottom of the post body, and write the updated file back to `posts/`.

You work with one post at a time. You do not invent content — every change must be grounded in the user's instructions. Your role is editorial: applying directed changes cleanly while preserving the author's voice for all content you do not touch.

This skill **writes files** but does not commit, push, or open pull requests — that is left to the developer.

---

## Project Context

> Fill in before use: Replace this section with blog-specific conventions, tone of voice, target audience, and any formatting rules specific to this site.
>
> Example: "Tone is conversational but technically precise. The audience is software engineers. Posts should avoid passive voice and keep sentences short. The canonical tag set is defined in DECISIONS.md. The `posts/` directory uses `YYYY-MM-DD-slug.md` filenames."

---

## Responsibilities

- List all posts in `posts/` and present them to the user for selection
- Load the chosen post file and read its current content
- Receive the user's edit instructions (corrections, additions, rewrites, tag changes, etc.)
- Apply the edits faithfully and precisely — do not alter content outside the scope of the instructions
- Preserve grammar, style, and voice in all unedited sections
- Add or update the `<!-- last-modified -->` stamp at the bottom of the post body (see format below)
- Write the updated file back to `posts/` at the same path — do not rename the file
- Do not alter the frontmatter `datePublished` or `slug` fields — these are immutable
- Frontmatter `tags` may be updated if the user explicitly requests it; use only canonical tags from `DECISIONS.md`

---

## Workflow

### Step 1 — Select a Post

**When:** Skill is invoked.

1. Read the `posts/` directory and list all `.md` files sorted by date (newest first).
2. Present a numbered list to the user in this format:

   ```
   #  Date        Title
   1  2026-04-26  Mermaid Support
   2  2026-04-20  Going Open Source with My Photography Workflow
   3  …
   ```

3. Ask: "Which post would you like to edit? Enter the number or start typing the title."
4. Wait for the user's selection. Confirm the chosen title before proceeding.

**Handoff to Step 2 when:** The user confirms the post to edit.

---

### Step 2 — Load the Post

**When:** Post is selected.

1. Read the full file content from `posts/<filename>.md`.
2. Parse the frontmatter to extract: `title`, `datePublished`, `slug`, `tags`, and `coverImage` (if present).
3. Identify whether a `<!-- last-modified -->` stamp already exists at the bottom of the body.
4. Show the user a brief summary:

   ```
   Post:     <title>
   File:     posts/<filename>.md
   Published: <datePublished>
   Tags:     <tags>
   Modified: <existing stamp date, or "none">
   ```

**Handoff to Step 3 when:** File is loaded and summary presented.

---

### Step 3 — Receive Edit Instructions

**When:** Post is loaded.

Ask the user:

> "What changes would you like to make to this post? Describe as specifically as possible — for example:
> - Fix the typo in paragraph 3
> - Update the AWS pricing figures in the second section
> - Add a note at the end about the new SDK version
> - Correct the tag from `aws` to `cloud`"

Wait for the user's full set of instructions before proceeding. Do not apply edits incrementally — gather all instructions first.

If the instructions are ambiguous, ask one clarifying question before proceeding.

**Handoff to Step 4 when:** Edit instructions are clear and complete.

---

### Step 4 — Apply Edits

**When:** Edit instructions are confirmed.

1. Apply all requested changes to the post body and/or frontmatter.
2. Do not alter any content outside the scope of the instructions.
3. Preserve the author's voice, sentence structure, and formatting in all unedited sections.
4. Flag any instruction that could not be applied precisely (e.g. the referenced paragraph does not match the description) — present these as inline comments for the user to resolve: `<!-- EDIT NOTE: could not locate referenced section — please review -->`.
5. If tags are being changed, verify the new tags exist in the canonical tag set in `DECISIONS.md`. Flag any tag not in the set and ask the user to confirm before using it.

Present the full updated post to the user as a markdown block. Highlight (in a separate list, not inline) exactly what was changed.

Ask: "Does this look correct? Confirm to write the file, or provide corrections."

**Handoff to Step 5 when:** User approves the edited content.

---

### Step 5 — Update the Modified Stamp

**When:** Edited content is approved.

Add or replace the last-modified stamp at the very end of the post body (after all other content, outside any frontmatter):

```markdown
---

*Last modified: YYYY-MM-DD*
```

- Use the current UTC date (`YYYY-MM-DD`) — not the `datePublished` date.
- If a stamp already exists (matching the pattern `*Last modified: …*` after a `---` rule), replace it entirely.
- Do not add a second stamp — there must be exactly one.
- The stamp is placed after the final content block with a preceding `---` horizontal rule as a visual separator.

**Handoff to Step 6 when:** Stamp is added or updated in the content.

---

### Step 6 — Write the File

**When:** Content with stamp is ready.

Write the updated content back to the original file path (`posts/<filename>.md`) using the Write tool. Do not rename the file.

Show the user:
```
Written: posts/<filename>.md
Modified stamp: <date>
```

No commits, branches, or PRs are created — handoff to the developer for that.

---

## Modified Stamp Format

The stamp is a standardised footer appended to the post body. It must appear exactly once, at the very end of the file, after all post content:

```markdown
---

*Last modified: YYYY-MM-DD*
```

Rules:
- The date is the current UTC date at the time the edit is written — not `datePublished`
- The `---` horizontal rule visually separates the stamp from post content
- If a stamp already exists from a previous edit, replace the entire `---\n\n*Last modified: …*` block — do not append a second one
- Do not place the stamp inside a frontmatter block

---

## Rules

- Do not rename or move the post file — write back to the same path
- Do not modify `datePublished` or `slug` in the frontmatter — these are immutable
- Do not alter content outside the scope of the user's instructions
- Do not invent corrections, improvements, or additions the user did not request
- `tags` in frontmatter must come from the canonical tag set in `DECISIONS.md` — flag any deviation
- The modified stamp date must be the actual current UTC date — never copy the publish date or use a placeholder
- Do not commit or push — stop after writing the file
- If the user requests edits to multiple posts in one session, complete the full workflow (Steps 1–6) for each post separately
- If a factual claim in the user's requested addition seems uncertain, flag it with an inline comment (`<!-- CHECK: … -->`) rather than silently including it
