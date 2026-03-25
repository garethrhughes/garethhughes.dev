# garethhughes.dev

Personal blog built with Next.js (static export), deployed to S3.

## Writing a post

1. Create a markdown file in `posts/`:

```yaml
---
title: "Your Post Title"
datePublished: Mon Jan 01 2026 12:00:00 GMT+0000
slug: your-post-slug
tags: tag-one, tag-two
---

Post content here…
```

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
