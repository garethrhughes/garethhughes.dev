---
title: "Going Open Source with My Photography Workflow"
datePublished: 2026-04-20T00:00:00Z
slug: going-open-source-with-my-photography-workflow
tags: photography, open-source, aws, github-pages
coverImage: /images/gareth-photography-preview.jpg
---

Following on the theme of building your own tools, this post covers my photography workflow.

I'm a very amateur photographer (my gear is much better than I am). I have a subscription to Lightroom and Adobe Cloud, which is fine when I'm doing a lot of photography — however the subscriptions all add up, and it's not something I use enough to justify.

I did, however, use Adobe Portfolio as somewhere easy to put my photos and make them web accessible.

I recently moved this blog from Hashnode back to GitHub Pages, something Copilot made very simple. Looking at my photography workflow through that same lens, I decided to go open source. There are some challenges with this — primarily that my camera outputs RAW files by default, which aren't compatible with most open source editors, and open source software can sometimes be on the clunky side.

These are separate problems. The first to solve was the portfolio website. Using Copilot, I pointed it at my blog to use as the base for look and feel, then at my previous Adobe Portfolio site to understand the image layout logic.

In less than an hour I had the new version live — images hosted out of S3 with a CloudFront distribution, and the website itself hosted on GitHub Pages.

I also created a couple of scripts to help with my workflow:
- Uploading images to S3
- Storing dimension information in JSON so layout calculations can run

It's now live at [https://gareth.photography](https://gareth.photography) and the source is at [https://github.com/garethrhughes/gareth.photography](https://github.com/garethrhughes/gareth.photography).
