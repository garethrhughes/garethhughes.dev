import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { renderMermaidBlocks } from "./mermaid";
import {
  extractExcerpt,
  formatTimelineStamp,
  leadParagraphs,
  parseDate,
  type Post,
  type PostMeta,
  type TimelinePost,
} from "./post-meta";

const POSTS_DIR = path.join(process.cwd(), "posts");

function parseTags(raw: unknown): string[] {
  if (typeof raw === "string") {
    return raw.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return Array.isArray(raw) ? raw : [];
}

/** Every post as `{ meta, content }`, newest first. Content is raw markdown — unrendered. */
function readAllPosts(): { meta: PostMeta; content: string }[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
      const { data, content } = matter(raw);
      const slug = data.slug || filename.replace(/\.md$/, "");
      return {
        meta: {
          slug,
          title: data.title || slug,
          datePublished: parseDate(data.datePublished || ""),
          tags: parseTags(data.tags),
          excerpt: extractExcerpt(content),
          coverImage: data.coverImage || undefined,
        },
        content,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.meta.datePublished).getTime() -
        new Date(a.meta.datePublished).getTime()
    );
}

export function getAllPostMeta(): PostMeta[] {
  return readAllPosts().map((p) => p.meta);
}

/** The year of the oldest published post — the timeline's "back to 2020" marker. */
export function getEarliestPostYear(): number | null {
  const posts = readAllPosts();
  const oldest = posts[posts.length - 1];
  if (!oldest) return null;
  const d = new Date(oldest.meta.datePublished);
  return Number.isNaN(d.getTime()) ? null : d.getUTCFullYear();
}

/**
 * Every post with its lead paragraphs and gutter stamp attached, newest first. The home
 * page shows a slice of these unfiltered but filters across all of them, so a topic chip
 * surfaces older posts too.
 *
 * Only the newest post carries three lead paragraphs — it is the only one rendered as the
 * hero. Reads raw markdown directly, deliberately not via `getPostBySlug`, which renders
 * mermaid blocks through Puppeteer.
 */
export function getTimelinePosts(): TimelinePost[] {
  return readAllPosts().map(({ meta, content }, i) => ({
    ...meta,
    lead: leadParagraphs(content, i === 0 ? 3 : 1),
    stamp: formatTimelineStamp(meta.datePublished),
  }));
}

export function getPostBySlug(slug: string): Post | null {
  if (!fs.existsSync(POSTS_DIR)) return null;

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  for (const filename of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
    const { data, content } = matter(raw);
    const fileSlug = data.slug || filename.replace(/\.md$/, "");
    if (fileSlug !== slug) continue;

    return {
      slug,
      title: data.title || slug,
      datePublished: parseDate(data.datePublished || ""),
      tags: parseTags(data.tags),
      excerpt: extractExcerpt(content),
      coverImage: data.coverImage || undefined,
      content: renderMermaidBlocks(content),
    };
  }
  return null;
}

export function getAllSlugs(): string[] {
  return getAllPostMeta().map((p) => p.slug);
}

export function getRelatedPosts(
  slug: string,
  tags: string[],
  limit = 3
): PostMeta[] {
  if (tags.length === 0) return [];
  const tagSet = new Set(tags);
  return getAllPostMeta()
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      score: p.tags.reduce((n, t) => (tagSet.has(t) ? n + 1 : n), 0),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.post.datePublished).getTime() - new Date(a.post.datePublished).getTime();
    })
    .slice(0, limit)
    .map((entry) => entry.post);
}


/**
 * The chronologically adjacent posts. The timeline sets up a chronological reading model
 * and the post page used to dead-end, so an article offers a way to keep moving along it.
 *
 * `readAllPosts` is newest-first, so the *newer* post is the preceding index.
 */
export function getAdjacentPosts(slug: string): {
  newer: PostMeta | null;
  older: PostMeta | null;
} {
  const all = getAllPostMeta();
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1) return { newer: null, older: null };
  return {
    newer: all[i - 1] ?? null,
    older: all[i + 1] ?? null,
  };
}
