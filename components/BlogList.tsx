'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Fuse from 'fuse.js';
import { PostMeta } from '@/lib/posts';
import { PostCard } from './PostCard';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 9;

interface BlogListProps {
  posts: PostMeta[];
}

export function BlogList({ posts }: BlogListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get('q') ?? '';
  const activeTag = searchParams.get('tag') ?? null;
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : '/');
  }

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

  // When not filtering, page 1 includes the featured hero post (filtered[0])
  // followed by a grid of PAGE_SIZE posts. Subsequent pages show PAGE_SIZE posts.
  const isFiltering = query.trim() !== '' || activeTag !== null;
  const heroOffset = isFiltering ? 0 : 1;
  const totalPages = Math.max(
    1,
    Math.ceil(Math.max(0, filtered.length - heroOffset) / PAGE_SIZE)
  );
  const currentPage = isFiltering ? 1 : Math.min(page, totalPages);

  const featuredPost = !isFiltering && currentPage === 1 && filtered.length > 0 ? filtered[0] : null;
  const gridStart = (currentPage - 1) * PAGE_SIZE + heroOffset;
  const pagePosts = filtered.slice(gridStart, gridStart + PAGE_SIZE);

  function handleTagClick(tag: string) {
    updateParams({ tag: activeTag === tag ? null : tag, page: null });
  }

  function handleQueryChange(val: string) {
    updateParams({ q: val, page: null });
  }

  return (
    <div>
      {/* Search */}
      <div className="mb-5 flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 transition focus-within:border-squirrel-400 focus-within:ring-1 focus-within:ring-squirrel-400">
        <Search size={16} className="shrink-0 text-text-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search posts…"
          className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-faint"
        />
        {query && (
          <button
            onClick={() => handleQueryChange('')}
            className="cursor-pointer text-text-faint hover:text-text-muted"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeTag === tag
                  ? 'bg-squirrel-500 text-white'
                  : 'bg-squirrel-100 text-squirrel-700 hover:bg-squirrel-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-text-muted">No posts found.</p>
      ) : (
        <>
          <div>
            {featuredPost && <PostCard post={featuredPost} featured />}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pagePosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>

          {/* Pagination */}
          {!isFiltering && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between gap-2">
              <button
                onClick={() => updateParams({ page: String(currentPage - 1) })}
                disabled={currentPage === 1}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium text-text-tertiary transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span className="text-sm text-text-muted">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => updateParams({ page: String(currentPage + 1) })}
                disabled={currentPage === totalPages}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium text-text-tertiary transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
