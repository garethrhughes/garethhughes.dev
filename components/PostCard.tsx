import Link from 'next/link';
import Image from 'next/image';
import { PostMeta } from '@/lib/posts';
import { Calendar, Tag } from 'lucide-react';

interface PostCardProps {
  post: PostMeta;
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const date = new Date(post.datePublished).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const tags = post.tags.length > 0 && (
    <span className="flex flex-wrap items-center gap-1.5">
      <Tag size={12} />
      {post.tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-squirrel-100 px-2 py-0.5 text-squirrel-700 dark:bg-surface-raised dark:text-squirrel-400"
        >
          {tag}
        </span>
      ))}
    </span>
  );

  if (featured) {
    return (
      <article className="group rounded-xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md overflow-hidden">
        <Link href={`/posts/${post.slug}/`} className="block">
          {post.coverImage && (
            <div className="w-full overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                width={0}
                height={0}
                sizes="100vw"
                className="h-auto w-full transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
          )}
          <div className="p-6">
            <span className="mb-3 inline-block rounded-full bg-squirrel-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-squirrel-700 dark:bg-surface-raised dark:text-squirrel-400">
              Latest post
            </span>
            <h2 className="mb-3 text-2xl font-bold text-text-primary group-hover:text-squirrel-700 transition-colors leading-snug">
              {post.title}
            </h2>
            <p className="mb-5 text-base leading-relaxed text-text-secondary">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-text-faint">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {date}
              </span>
              {tags}
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group rounded-lg border border-border bg-surface shadow-sm transition-shadow hover:shadow-md overflow-hidden">
      <Link href={`/posts/${post.slug}/`} className="block">
        {post.coverImage && (
          <div className="w-full overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={0}
              height={0}
              sizes="100vw"
              className="h-auto w-full transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-5">
          <h2 className="mb-2 text-xl font-semibold text-text-primary group-hover:text-squirrel-700 transition-colors">
            {post.title}
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-text-secondary line-clamp-3">
            {post.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-text-faint">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {date}
            </span>
            {tags}
          </div>
        </div>
      </Link>
    </article>
  );
}
