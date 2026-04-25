---
title: "Adding Mermaid Support"
datePublished: 2026-04-26T00:00:00Z
slug: mermaid-support
tags: software-development, web
---

This site supports [Mermaid](https://mermaid.js.org) diagrams in blog posts. Diagrams are written as fenced code blocks with the `mermaid` language tag and rendered to SVG at build time — no JavaScript is shipped to the browser.

## How it works

When the site is built, `lib/mermaid.ts` scans the raw markdown for ` ```mermaid ` blocks. Each block is written to a temporary file and passed to [`@mermaid-js/mermaid-cli`](https://github.com/mermaid-js/mermaid-cli) (`mmdc`), which uses a headless Chromium instance to produce an SVG. The fenced block is then replaced with a `<div class="mermaid-diagram">` containing the inline SVG. The rest of the markdown pipeline (`react-markdown` + `rehype-raw`) renders the SVG as-is.

The end result is a fully static page — diagrams are plain SVG embedded in the HTML, visible without any client-side rendering.

```mermaid
flowchart LR
  MD["```mermaid``` block"] --> mmdc
  mmdc --> SVG["Inline SVG"]
  SVG --> HTML["Static HTML page"]
```

If a diagram fails to render the original fenced block is preserved, so a syntax error won't break the rest of the post.

## Examples


```mermaid
pie title NETFLIX
         "Time spent looking for movie" : 90
         "Time spent watching it" : 10

```

```mermaid
sequenceDiagram
    Alice ->> Bob: Hello Bob, how are you?
    Bob-->>John: How about you John?
    Bob--x Alice: I am good thanks!
    Bob-x John: I am good thanks!
    Note right of John: Bob thinks a long<br/>long time, so long<br/>that the text does<br/>not fit on a row.

    Bob-->Alice: Checking with John...
    Alice->John: Yes... John, how are you?
```

```mermaid
gitGraph:
    commit "Ashish"
    branch newbranch
    checkout newbranch
    commit id:"1111"
    commit tag:"test"
    checkout main
    commit type: HIGHLIGHT
    commit
    merge newbranch
    commit
    branch b2
    commit
```
