'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Fuse from 'fuse.js';
import { Search, X } from 'lucide-react';
import { formatPostDate, type PostMeta } from '@/lib/post-meta';

interface ArchiveListProps {
  posts: PostMeta[];
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
                className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-squirrel-500 text-white'
                    : 'bg-squirrel-100 text-squirrel-700 hover:bg-squirrel-200'
                }`}
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
                <span className="flex-none font-mono text-xs text-text-faint md:w-[118px] md:text-[13px]">
                  {formatPostDate(post.datePublished)}
                </span>
                <span className="flex-1">
                  <span className="block text-[17px] font-semibold leading-[1.35] text-text-primary transition-colors group-hover:text-squirrel-700">
                    {post.title}
                  </span>
                  {post.tags.length > 0 && (
                    <span className="mt-1.5 flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-squirrel-50 px-[9px] py-0.5 text-xs font-medium text-squirrel-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
