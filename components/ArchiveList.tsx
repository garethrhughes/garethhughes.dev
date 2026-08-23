'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Fuse from 'fuse.js';
import { Search, X } from 'lucide-react';
import { formatPostDate, type TimelinePost } from '@/lib/post-meta';
import { chipClass, TagPills } from './TagPill';

interface ArchiveListProps {
  posts: TimelinePost[];
}

export function ArchiveList({ posts }: ArchiveListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * Local state is authoritative and the URL mirrors it. Driving the input straight from
   * `searchParams` drops keystrokes: `router.replace` is async, so each keypress reads a
   * stale value and overwrites the one before it.
   */
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');
  const [activeTag, setActiveTag] = useState<string | null>(
    () => searchParams.get('tag') ?? null
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query);
      if (activeTag) params.set('tag', activeTag);
      const qs = params.toString();
      const next = qs ? `/archive/?${qs}` : '/archive/';
      if (next !== window.location.pathname + window.location.search) {
        router.replace(next, { scroll: false });
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [query, activeTag, router]);

  const allTags = useMemo(
    () => Array.from(new Set(posts.flatMap((p) => p.tags))).sort(),
    [posts]
  );

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: ['title', 'tags', 'excerpt'],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [posts]
  );

  const filtered = useMemo(() => {
    let results = query.trim() ? fuse.search(query.trim()).map((r) => r.item) : posts;
    if (activeTag) results = results.filter((p) => p.tags.includes(activeTag));
    return results;
  }, [query, activeTag, fuse, posts]);

  return (
    <div>
      {/* Search */}
      <div className="mb-5 flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 transition focus-within:border-squirrel-400 focus-within:ring-1 focus-within:ring-squirrel-400">
        <Search size={16} className="shrink-0 text-text-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts…"
          aria-label="Search posts"
          className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-faint"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="cursor-pointer text-text-faint hover:text-text-muted"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const isActive = activeTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setActiveTag(isActive ? null : tag)}
                aria-pressed={isActive}
                className={chipClass(isActive)}
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}

      {/* Results — a plain divided list. A chronological run of long-form entries takes
          rules, not cards (STYLE_GUIDE.md). */}
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-text-muted">No posts found.</p>
      ) : (
        <ul className="divide-y divide-border border-t border-border">
          {filtered.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/posts/${post.slug}/`}
                className="group flex flex-col gap-1 py-4 md:flex-row md:items-baseline md:gap-4"
              >
                <span className="flex-none font-mono text-xs text-text-faint md:w-24 md:text-[13px]">
                  {formatPostDate(post.datePublished)}
                </span>
                <span className="flex-1">
                  <span className="block text-[17px] font-semibold leading-[1.35] text-text-primary transition-colors group-hover:text-squirrel-700">
                    {post.title}
                  </span>
                  {/* The post's opening paragraph, not `excerpt` — `excerpt` keeps a
                      post's H1, so rows read "OpenCode Skills OpenCode Skills Getting...".
                      Clamped for the same reason the timeline clamps: leads run from one
                      sentence to a paragraph and unclamped rows destroy the list's rhythm.
                      No `block` here — it overrides line-clamp's own display. */}
                  {post.lead[0] && (
                    <span className="mt-1.5 line-clamp-2 max-w-[720px] text-sm leading-[1.55] text-text-secondary">
                      {post.lead[0]}
                    </span>
                  )}
                  <TagPills tags={post.tags} inline className="mt-2" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
