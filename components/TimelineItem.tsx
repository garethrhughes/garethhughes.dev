import Image from 'next/image';
import Link from 'next/link';
import type { TimelinePost } from '@/lib/post-meta';

/**
 * Rows are pairs of grid children — a date gutter and a threaded cell — so the rail runs
 * unbroken down the whole timeline. Each row is wrapped in `display: contents` to keep
 * both halves as direct children of the grid.
 */
function rowClass(hideOnMobile: boolean): string {
  return hideOnMobile ? 'hidden md:contents' : 'contents';
}

const GUTTER = 'font-mono text-[11px] font-medium text-text-faint md:text-xs';

const TAG_PILL =
  'rounded-full bg-squirrel-50 px-[9px] py-0.5 text-xs font-medium text-squirrel-700';

function TagPills({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.slice(0, 3).map((tag) => (
        <span key={tag} className={TAG_PILL}>
          {tag}
        </span>
      ))}
    </div>
  );
}

/**
 * The newest post. Deliberately uncarded — no border, background, or shadow. The rail and
 * the larger dot carry the emphasis, per STYLE_GUIDE.md on chronological lists.
 */
export function TimelineHero({ post }: { post: TimelinePost }) {
  const href = `/posts/${post.slug}/`;

  return (
    <div className="contents">
      <div className={`${GUTTER} pt-[22px] md:pt-[26px]`}>{post.stamp}</div>

      <div className="relative border-l-2 border-squirrel-100 py-[18px] pb-[26px] pl-[18px] md:py-[22px] md:pb-[30px] md:pl-8">
        <span
          className="absolute -left-[6px] top-[26px] h-2.5 w-2.5 rounded-full bg-squirrel-500 shadow-[0_0_0_3px_var(--surface)] md:-left-[7px] md:top-9 md:h-3 md:w-3"
          aria-hidden="true"
        />

        <Link href={href} className="group grid items-center gap-9 md:grid-cols-[1fr_400px]">
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

            <div className="mt-2.5 md:mt-4">
              <TagPills tags={post.tags} />
            </div>
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
      </div>
    </div>
  );
}

interface TimelineRowProps {
  post: TimelinePost;
  /** Rows past the fifth are desktop-only — mobile shows a shorter timeline. */
  hideOnMobile?: boolean;
}

export function TimelineRow({ post, hideOnMobile = false }: TimelineRowProps) {
  const href = `/posts/${post.slug}/`;
  const lead = post.lead[0];

  return (
    <div className={rowClass(hideOnMobile)}>
      <div className={`${GUTTER} pt-5 md:pt-[26px]`}>{post.stamp}</div>

      <div className="relative border-l-2 border-squirrel-100 py-4 pb-[18px] pl-[18px] md:py-5 md:pb-[22px] md:pl-8">
        <span
          className="absolute -left-[4px] top-6 h-1.5 w-1.5 rounded-full bg-squirrel-300 shadow-[0_0_0_3px_var(--surface)] md:-left-[5px] md:top-[30px] md:h-2 md:w-2"
          aria-hidden="true"
        />

        <Link href={href} className="group flex items-center gap-4">
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
            <div className="mt-2.5">
              <TagPills tags={post.tags} />
            </div>
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
      </div>
    </div>
  );
}
