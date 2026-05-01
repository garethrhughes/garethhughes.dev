# garethhughes.dev

Personal blog built with Next.js (static export), deployed to S3.

## Writing a post

### Using the AI writer skill (recommended)

Keep drafts in the **Blog** collection in Squirrel Notes, then run:

```
Use the writer skill to publish the draft post about <topic>.
```

The skill will load the draft, proofread and improve it, convert it to the correct format with the current UTC publish time, write the file to `posts/`, and mark the draft as published in Squirrel Notes.

### Manually

1. Create a markdown file in `posts/` named `YYYY-MM-DD-slug.md`:

```yaml
---
title: "Your Post Title"
datePublished: "2026-01-01T12:00:00Z"
slug: your-post-slug
tags: [tag-one, tag-two]
---

Post content here…
```

- `datePublished` must be ISO-8601 (`YYYY-MM-DDTHH:MM:SSZ`) — RFC-2822 is not supported
- The filename date and slug must match the frontmatter values
- Tags must come from the canonical set in `DECISIONS.md`

2. Add any images to `public/images/` and reference them in markdown as `/images/my-image.png`.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
# Static output is in out/
```

## Deploy to S3

Set your bucket name (once):

```bash
export BUCKET=your-s3-bucket-name
```

Deploy site:

```bash
make deploy
```

Sync images only (no rebuild):

```bash
make deploy-images
```

With CloudFront invalidation:

```bash
make deploy CLOUDFRONT_ID=EXAMPLEID
```

## S3 bucket setup

Enable **Static website hosting** on your S3 bucket with:
- Index document: `index.html`
- Error document: `index.html`

## Styling

Uses the same design system as squirrel-notes:
Tailwind CSS v4 · Geist font · slate/blue palette · dark mode support.

## Deploy to GitHub Pages

The site deploys automatically to GitHub Pages on every push to `main`.

**One-time setup:**

1. Go to your repo → **Settings → Pages**
2. Under *Source*, select **GitHub Actions**
3. If using a custom domain, add it under *Custom domain* and create a `CNAME` file in `public/`:

```bash
echo "garethhughes.dev" > public/CNAME
```

Then push to `main` — the workflow will build and deploy automatically.

You can also trigger a deploy manually from the **Actions** tab → *Deploy to GitHub Pages* → **Run workflow**.
