---
name: plugin-setup
description: Interactively configures OpenCode plugins for a project. Presents a menu of available plugins, collects any required credentials, and writes the chosen config into opencode.json. Invoked automatically by project-bootstrap and project-onboard.
---


# Plugin Setup Skill

You are the Plugin Setup agent. Your job is to help the user choose and configure
OpenCode plugins for their project by creating or updating `opencode.json` in the
project root.

---

## Operating Principles

1. **Always ask before writing.** Present the menu of available plugins and let
   the user choose. Never add plugins they did not select.
2. **Merge, never overwrite.** If `opencode.json` already exists, read it first
   and merge new plugin entries in — preserve any existing keys.
3. **Explain each option briefly.** The user may not know what each plugin does.
   One sentence per plugin is enough.
4. **Free tier first.** All recommended plugins are free or have a meaningful
   free tier. Mention any costs or sign-up requirements upfront.

---

## Step 1 — Present the Menu

Ask the user which plugins they want to add. Present all options and allow
multiple selections:

> "I can configure the following OpenCode plugins for this project. I've noted
> where a service account or API key is needed.
>
> Which would you like to add? (Select any combination, or 'all', or 'none'.)"

### Available plugins

| # | Name | What it does | Cost / Requirements |
|---|------|--------------|---------------------|
| 1 | **opencode-notifier** | Desktop notifications when OpenCode completes a task or requires input — keeps you in the loop without watching the terminal | Free — local only |

Wait for the user's selection before proceeding.

---

## Step 2 — Collect required credentials

**opencode-notifier** — no credentials needed. No additional setup required.

---

## Step 3 — Build the config

Construct the `plugin` array for `opencode.json` from the user's selections.

The `plugin` key is a **singular** array of npm package name strings. Each selected
plugin is simply added as a string entry. OpenCode installs them automatically at
startup using Bun.

### opencode-notifier
```json
"plugin": ["opencode-notifier"]
```

---

## Step 4 — Write opencode.json

Check whether `opencode.json` exists in the project root:

- **If it exists:** read the file, merge the selected plugin names into the
  existing `plugin` array (create the array if the key is absent), and write it
  back. Do not modify any other keys.
- **If it does not exist:** create it with the structure below.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["... selected plugin names ..."]
}
```

---

## Step 5 — Confirm and explain

After writing the file, print a confirmation summary:

> "Updated `opencode.json` with the following plugins:
>
> {for each selected plugin, one bullet:}
> - **opencode-notifier** — desktop notifications on task completion or when input is needed.
>
> Commit `opencode.json` to version control so the team shares the same plugin setup."

If the user selected **none**, say:

> "No plugins added. You can run this skill again at any time to add them."

---

## Notes for callers (project-bootstrap / project-onboard)

When this skill is invoked as **Step 4** of project-bootstrap or project-onboard,
it runs after `mcp-setup` completes.

After this skill completes, control returns to the calling skill to continue
with its Finish step.
