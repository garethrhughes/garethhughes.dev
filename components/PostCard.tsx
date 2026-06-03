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
          className="rounded-full bg-squirrel-100 px-2 py-0.5 text-squirrel-700"
        >
          {tag}
        </span>
      ))}
    </span>
  );

  if (featured) {
    return (
      <article className="group mb-6 overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md">
        <Link
          href={`/posts/${post.slug}/`}
          className={post.coverImage ? 'flex flex-col md:flex-row' : 'block'}
        >
          {post.coverImage && (
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-alt md:aspect-auto md:w-1/2 md:shrink-0">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                priority
              />
            </div>
          )}
          <div className="flex flex-col justify-center p-6 md:p-8">
            <span className="mb-3 inline-block w-fit rounded-full bg-squirrel-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-squirrel-700">
              Latest post
            </span>
            <h2 className="mb-3 text-2xl font-bold leading-snug text-text-primary transition-colors group-hover:text-squirrel-700 md:text-3xl">
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
    <article className="group overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/posts/${post.slug}/`} className="flex h-full flex-col">
        {post.coverImage && (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-alt">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col p-5">
          <h2 className="mb-2 text-xl font-semibold leading-snug text-text-primary transition-colors group-hover:text-squirrel-700">
            {post.title}
          </h2>
          <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-text-secondary">
            {post.excerpt}
          </p>
          <div className="mt-auto flex flex-wrap items-center gap-3 text-xs text-text-faint">
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
