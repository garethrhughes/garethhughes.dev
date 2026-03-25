#!/usr/bin/env node
// Downloads all Hashnode CDN images referenced in posts/ into public/images/
// and rewrites the markdown to use local /images/ paths.
// Also fetches cover images from the Hashnode API and adds them to frontmatter.

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.join(__dirname, '..', 'posts');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');
const HOST = 'garethhughes.dev';

// Fetch cover images from Hashnode API
async function fetchCoverImages() {
  const res = await fetch('https://gql.hashnode.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `{ publication(host: "${HOST}") { posts(first: 50) { edges { node { slug coverImage { url } } } } } }`,
    }),
  });
  const json = await res.json();
  const map = {};
  for (const { node } of json.data.publication.posts.edges) {
    if (node.coverImage?.url) map[node.slug] = node.coverImage.url;
  }
  return map;
}

// Download a URL to a local file, return local path or null on error
function download(url, destPath) {
  return new Promise((resolve) => {
    if (fs.existsSync(destPath)) { resolve(destPath); return; }
    const file = fs.createWriteStream(destPath);
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(destPath);
        download(res.headers.location, destPath).then(resolve);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        console.warn(`  WARN  HTTP ${res.statusCode} for ${url}`);
        resolve(null);
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(destPath); });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      console.warn(`  WARN  ${err.message} for ${url}`);
      resolve(null);
    });
  });
}

// Extract a safe local filename from a CDN URL
function localFilename(url) {
  const u = new URL(url);
  // last segment of path, strip query params
  return path.basename(u.pathname.split('/').pop());
}

// Strip Hashnode-specific align attribute: ![alt](url align="center") -> ![alt](url)
function stripAlign(markdown) {
  return markdown.replace(/!\[([^\]]*)\]\(([^ )]+)[^)]*align="[^"]*"[^)]*\)/g, '![$1]($2)');
}

async function processPost(filePath, coverImages) {
  let content = fs.readFileSync(filePath, 'utf8');
  const slug = path.basename(filePath, '.md');

  // Strip align attributes
  content = stripAlign(content);

  // Find all CDN image URLs in markdown
  const imagePattern = /!\[([^\]]*)\]\((https:\/\/cdn\.hashnode\.com\/[^) ]+)\)/g;
  const replacements = [];
  let match;
  while ((match = imagePattern.exec(content)) !== null) {
    replacements.push({ full: match[0], alt: match[1], url: match[2] });
  }

  // Also handle cover image for this post
  const coverUrl = coverImages[slug];

  // Download all images
  for (const item of replacements) {
    const filename = localFilename(item.url);
    const destPath = path.join(IMAGES_DIR, filename);
    const result = await download(item.url, destPath);
    if (result) {
      const localPath = `/images/${filename}`;
      content = content.replace(item.full, `![${item.alt}](${localPath})`);
      console.log(`  IMG   ${filename}`);
    }
  }

  // Handle cover image: add to frontmatter if present
  if (coverUrl) {
    const filename = localFilename(coverUrl);
    const destPath = path.join(IMAGES_DIR, filename);
    const result = await download(coverUrl, destPath);
    if (result) {
      const localPath = `/images/${filename}`;
      // Add or replace coverImage in frontmatter
      if (/^coverImage:.*$/m.test(content)) {
        content = content.replace(/^coverImage:.*$/m, `coverImage: ${localPath}`);
      } else {
        content = content.replace(/^(---\n[\s\S]*?)(---)/, `$1coverImage: ${localPath}\n$2`);
      }
      console.log(`  COVER ${filename}`);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

  console.log('Fetching cover images from Hashnode API...');
  const coverImages = await fetchCoverImages();
  console.log(`Found cover images for ${Object.keys(coverImages).length} posts.\n`);

  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file);
    console.log(`Processing ${file}...`);
    await processPost(filePath, coverImages);
  }

  console.log('\nDone.');
}

main().catch(err => { console.error(err); process.exit(1); });
