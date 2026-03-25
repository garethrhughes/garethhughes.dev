'use client';

import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { PostMeta } from '@/lib/posts';
import { PostCard } from './PostCard';
import { Search, X } from 'lucide-react';

interface BlogListProps {
  posts: PostMeta[];
}

export function BlogList({ posts }: BlogListProps) {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

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
      <div className="mb-5 flex items-center gap-2 rounded-lg border border-border bg-surface-alt px-3 py-2">
        <Search size={16} className="shrink-0 text-text-faint" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts…"
          className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-faint"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-text-faint hover:text-text-muted">
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
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeTag === tag
                  ? 'bg-squirrel-500 text-white'
                  : 'bg-squirrel-100 text-squirrel-700 hover:bg-squirrel-200 dark:bg-surface-raised dark:text-squirrel-400 dark:hover:bg-surface-active'
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
        <div className="flex flex-col gap-4">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
