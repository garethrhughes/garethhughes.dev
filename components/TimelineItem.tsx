import Image from 'next/image';
import Link from 'next/link';
import type { TimelinePost } from '@/lib/post-meta';
import { RailRow } from './Rail';
import { TagPills } from './TagPill';

/**
 * The newest post. Deliberately uncarded — no border, background, or shadow. The rail and
 * the larger dot carry the emphasis, per STYLE_GUIDE.md on chronological lists.
 */
export function TimelineHero({ post }: { post: TimelinePost }) {
  return (
    <RailRow gutter={post.stamp} emphasis>
      <Link
        href={`/posts/${post.slug}/`}
        className="group grid items-center gap-9 md:grid-cols-[1fr_400px]"
      >
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-squirrel-700 md:mb-2.5 md:text-xs">
            Latest post
          </div>

          <h2 className="mb-2.5 text-2xl font-bold leading-tight text-text-primary transition-colors group-hover:text-squirrel-700 md:mb-3 md:text-3xl [text-wrap:pretty]">
            {post.title}
          </h2>

          {/* Mobile places the image between title and lead; desktop puts it in its own
              column. Rendering it twice is the only way to reorder without JS. */}
          {post.coverImage && (
            <Image
              src={post.coverImage}
              alt=""
              width={400}
              height={150}
              className="mb-3 h-[150px] w-full rounded-[10px] border border-border object-cover object-top md:hidden"
            />
          )}

          {post.lead.slice(0, 3).map((paragraph, i) => (
            <p
              key={i}
              className={`mb-3 text-[15px] leading-relaxed text-text-secondary md:text-base ${
                i > 0 ? 'hidden md:block' : ''
              }`}
            >
              {paragraph}
            </p>
          ))}

          <TagPills tags={post.tags} max={3} className="mt-2.5 md:mt-4" />
        </div>

        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt=""
            width={400}
            height={250}
            className="hidden h-[250px] w-[400px] rounded-xl border border-border object-cover object-top md:block"
          />
        )}
      </Link>
    </RailRow>
  );
}

interface TimelineRowProps {
  post: TimelinePost;
  /** Rows past the fifth are desktop-only — mobile shows a shorter timeline. */
  hideOnMobile?: boolean;
}

export function TimelineRow({ post, hideOnMobile = false }: TimelineRowProps) {
  const lead = post.lead[0];

  return (
    <RailRow gutter={post.stamp} hideOnMobile={hideOnMobile}>
      <Link href={`/posts/${post.slug}/`} className="group flex items-center gap-4">
        <div className="flex-1">
          <div className="text-[17px] font-semibold leading-[1.35] text-text-primary transition-colors group-hover:text-squirrel-700 md:text-[19px]">
            {post.title}
          </div>
          {/* Clamped to two lines: lead paragraphs vary from one sentence to a full
              screen, and an unclamped row destroys the timeline's rhythm. */}
          {lead && (
            <div className="mt-1.5 line-clamp-2 max-w-[720px] text-sm leading-[1.55] text-text-secondary md:text-[15px]">
              {lead}
            </div>
          )}
          <TagPills tags={post.tags} max={3} className="mt-2.5" />
        </div>

        {/* Desktop-only, and omitted entirely when the post has no cover — an empty
            bordered box reads as a failed image rather than as spacing. */}
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt=""
            width={96}
            height={60}
            className="hidden h-[60px] w-24 flex-none rounded-lg border border-border bg-surface-alt object-cover object-top md:block"
          />
        )}
      </Link>
    </RailRow>
  );
}
