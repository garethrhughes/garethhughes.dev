import Image from 'next/image';
import Link from 'next/link';
import { formatTimelineStamp, type PostMeta } from '@/lib/post-meta';
import { GUTTER } from './Rail';

interface PostRowProps {
  post: PostMeta;
  /**
   * Thumbnails suit the post page's aside, where the column is all links. Beside the
   * `/about/` intro they compete with the prose, so that caller turns them off.
   */
  thumbnail?: boolean;
}

/**
 * A post reduced to a stamp and a title — the compact form used in narrow columns.
 * Shared so the post page's related list and `/about/`'s recent-writing rail cannot drift;
 * copying it into the second caller is how four tag-pill styles happened (ADR 0017).
 */
export function PostRow({ post, thumbnail = true }: PostRowProps) {
  return (
    <li>
      <Link href={`/posts/${post.slug}/`} className="group flex gap-3 py-3.5">
        <div className="min-w-0 flex-1">
          <div className={`${GUTTER} mb-1`}>{formatTimelineStamp(post.datePublished)}</div>
          <div className="text-sm font-semibold leading-snug text-text-primary transition-colors group-hover:text-squirrel-700">
            {post.title}
          </div>
        </div>
        {thumbnail && post.coverImage && (
          <Image
            src={post.coverImage}
            alt=""
            width={96}
            height={60}
            className="h-[60px] w-24 flex-none rounded-lg border border-border bg-surface-alt object-cover object-top"
          />
        )}
      </Link>
    </li>
  );
}

/** The divided list the rows sit in. */
export function PostRowList({ children }: { children: React.ReactNode }) {
  return <ul className="divide-y divide-border border-t border-border">{children}</ul>;
}
