/**
 * The post shape and everything derivable from it without touching the filesystem.
 * Kept apart from `posts.ts` so client components can import formatters and the topic
 * map without pulling `fs` into the browser bundle.
 */

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

/** A post prepared for the home-page timeline: lead paragraphs plus the gutter stamp. */
export interface TimelinePost extends PostMeta {
  /** Up to three stripped prose paragraphs from the top of the body. */
  lead: string[];
  /** `AUG 26` — the date-gutter stamp. */
  stamp: string;
}

export function parseDate(raw: string): string {
  try {
    return new Date(raw).toISOString();
  } catch {
    return raw;
  }
}

function stripFrontmatter(content: string): string {
  return content.replace(/^---[\s\S]*?---/, "");
}

/** Strip markdown syntax down to readable prose. Shared by excerpts and lead paragraphs. */
function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*|__|\*|_|`{1,3}/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\n+/g, " ")
    .trim();
}

export function extractExcerpt(content: string, maxLength = 400): string {
  const text = stripMarkdown(stripFrontmatter(content));
  return text.length > maxLength ? text.slice(0, maxLength).replace(/\s\S*$/, "") + "…" : text;
}

/**
 * The first `n` prose paragraphs of a post body, stripped the same way excerpts are.
 * Headings, images, fenced code, block HTML, lists, and blockquotes are skipped so a post
 * that opens with a diagram or a callout still yields readable lead text.
 */
export function leadParagraphs(content: string, n: number): string[] {
  const body = stripFrontmatter(content).replace(/```[\s\S]*?```/g, "");
  const paragraphs: string[] = [];

  for (const block of body.split(/\n\s*\n/)) {
    const trimmed = block.trim();
    if (!trimmed) continue;
    if (/^(#{1,6}\s|>|[-*+]\s|\d+\.\s|!\[|<|\||-{3,}$)/.test(trimmed)) continue;

    const prose = stripMarkdown(trimmed);
    if (!prose) continue;

    paragraphs.push(prose);
    if (paragraphs.length === n) break;
  }

  return paragraphs;
}

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

/**
 * `20 Dec 2025`. Fixed UTC formatting rather than `toLocaleDateString` so a statically
 * exported page renders identically on the server and after hydration.
 */
export function formatPostDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getUTCDate()} ${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/**
 * `DEC 25` — the timeline gutter stamp. UTC-based: CI builds in UTC and local builds in
 * Sydney (UTC+10), and a post published at 23:00Z would otherwise straddle the month.
 */
export function formatTimelineStamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const month = MONTHS_SHORT[d.getUTCMonth()].toUpperCase();
  return `${month} ${String(d.getUTCFullYear()).slice(-2)}`;
}

/**
 * Curated home-page groupings over the canonical tag taxonomy (ADR 0011, ADR 0015).
 * A post matches a topic if any of its tags appears in that topic's list.
 */
export const TOPICS = {
  "Leading teams": ["leadership", "interviewing", "engineering-metrics"],
  "Building with AI": ["ai"],
  "Cloud & architecture": ["aws", "architecture", "serverless", "cdk", "terraform", "cost-optimisation", "devops"],
  // Product tags only — `open-source` and `notes` also appear on posts that are really
  // about AI tooling, and including them made this topic match 80% of the timeline.
  "Side projects": ["squirrel-notes", "fragile", "photography"],
} as const;

export type Topic = keyof typeof TOPICS;

export const TOPIC_NAMES = Object.keys(TOPICS) as Topic[];

export function postMatchesTopic(post: PostMeta, topic: Topic): boolean {
  const tags: readonly string[] = TOPICS[topic];
  return post.tags.some((t) => tags.includes(t));
}
