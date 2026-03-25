#!/usr/bin/env node
// Imports all posts from garethhughes.dev (Hashnode) into posts/

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.join(__dirname, '..', 'posts');
const HOST = 'garethhughes.dev';

const QUERY = `
  query GetAllPosts($after: String) {
    publication(host: "${HOST}") {
      posts(first: 50, after: $after) {
        pageInfo { hasNextPage endCursor }
        edges {
          node {
            title
            slug
            publishedAt
            tags { name slug }
            content { markdown }
          }
        }
      }
    }
  }
`;

async function fetchPosts() {
  const posts = [];
  let after = null;

  while (true) {
    const res = await fetch('https://gql.hashnode.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY, variables: { after } }),
    });
    const json = await res.json();
    if (json.errors) {
      console.error('API error:', JSON.stringify(json.errors, null, 2));
      process.exit(1);
    }
    const { edges, pageInfo } = json.data.publication.posts;
    posts.push(...edges.map(e => e.node));
    if (!pageInfo.hasNextPage) break;
    after = pageInfo.endCursor;
  }
  return posts;
}

function toFrontmatter(post) {
  const tags = post.tags.map(t => t.slug).join(', ');
  const date = new Date(post.publishedAt).toUTCString();
  return [
    '---',
    `title: "${post.title.replace(/"/g, '\\"')}"`,
    `datePublished: ${date}`,
    `slug: ${post.slug}`,
    tags ? `tags: ${tags}` : null,
    '---',
  ].filter(Boolean).join('\n');
}

async function main() {
  console.log(`Fetching posts from ${HOST}...`);
  const posts = await fetchPosts();
  console.log(`Found ${posts.length} posts.`);

  if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });

  let created = 0;
  let skipped = 0;

  for (const post of posts) {
    const filename = path.join(POSTS_DIR, `${post.slug}.md`);
    if (fs.existsSync(filename)) {
      console.log(`  SKIP  ${post.slug}.md (already exists)`);
      skipped++;
      continue;
    }
    const content = `${toFrontmatter(post)}\n\n${post.content.markdown}\n`;
    fs.writeFileSync(filename, content, 'utf8');
    console.log(`  WRITE ${post.slug}.md`);
    created++;
  }

  console.log(`\nDone. ${created} imported, ${skipped} skipped.`);
}

main().catch(err => { console.error(err); process.exit(1); });
