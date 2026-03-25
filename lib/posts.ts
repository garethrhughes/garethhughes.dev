import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "posts");

export interface PostMeta {
  slug: string;
  title: string;
  datePublished: string;
  tags: string[];
  excerpt: string;
  coverImage?: string;
}

export interface Post extends PostMeta {
  content: string;
}

function parseDate(raw: string): string {
  try {
    return new Date(raw).toISOString();
  } catch {
    return raw;
  }
}

function extractExcerpt(content: string, maxLength = 160): string {
  const text = content
    .replace(/^---[\s\S]*?---/, "")
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*|__|\*|_|`{1,3}/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\n+/g, " ")
    .trim();
  return text.length > maxLength ? text.slice(0, maxLength).replace(/\s\S*$/, "") + "…" : text;
}

export function getAllPostMeta(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
      const { data, content } = matter(raw);
      const slug = data.slug || filename.replace(/\.md$/, "");
      const tags =
        typeof data.tags === "string"
          ? data.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
          : Array.isArray(data.tags)
          ? data.tags
          : [];
      return {
        slug,
        title: data.title || slug,
        datePublished: parseDate(data.datePublished || ""),
        tags,
        excerpt: extractExcerpt(content),
        coverImage: data.coverImage || undefined,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
    );
}

export function getPostBySlug(slug: string): Post | null {
  if (!fs.existsSync(POSTS_DIR)) return null;

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  for (const filename of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
    const { data, content } = matter(raw);
    const fileSlug = data.slug || filename.replace(/\.md$/, "");
    if (fileSlug !== slug) continue;

    const tags =
      typeof data.tags === "string"
        ? data.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : Array.isArray(data.tags)
        ? data.tags
        : [];

    return {
      slug,
      title: data.title || slug,
      datePublished: parseDate(data.datePublished || ""),
      tags,
      excerpt: extractExcerpt(content),
      coverImage: data.coverImage || undefined,
      content,
    };
  }
  return null;
}

export function getAllSlugs(): string[] {
  return getAllPostMeta().map((p) => p.slug);
}

export function getAboutContent(): string {
  const aboutPath = path.join(process.cwd(), "about.md");
  if (!fs.existsSync(aboutPath)) return "";
  const { content } = matter(fs.readFileSync(aboutPath, "utf8"));
  return content;
}
