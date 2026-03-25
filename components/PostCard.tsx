import Link from 'next/link';
import Image from 'next/image';
import { PostMeta } from '@/lib/posts';
import { Calendar, Tag } from 'lucide-react';

interface PostCardProps {
  post: PostMeta;
}

export function PostCard({ post }: PostCardProps) {
  const date = new Date(post.datePublished).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <article className="group rounded-lg border border-border bg-surface shadow-sm transition-shadow hover:shadow-md overflow-hidden">
      <Link href={`/posts/${post.slug}/`} className="block">
        {post.coverImage && (
          <div className="relative h-44 w-full overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
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
            {post.tags.length > 0 && (
              <span className="flex flex-wrap items-center gap-1">
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
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
