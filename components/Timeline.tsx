'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { postMatchesTopic, type TimelinePost } from '@/lib/post-meta';
import { EVERYTHING, TopicFilter, type TopicSelection } from './TopicFilter';
import { TimelineHero, TimelineRow } from './TimelineItem';
import { GUTTER, Rail } from './Rail';

/** Posts visible on mobile, hero included. Desktop shows every post it is handed. */
const MOBILE_VISIBLE = 6;

interface TimelineProps {
  /** Every published post, newest first. */
  posts: TimelinePost[];
  /** How many to show when no topic is selected. */
  recentCount: number;
  earliestYear: number | null;
}

export function Timeline({ posts, recentCount, earliestYear }: TimelineProps) {
  const [topic, setTopic] = useState<TopicSelection>(EVERYTHING);

  const isFiltering = topic !== EVERYTHING;

  /**
   * Topics filter the whole catalogue, not just the recent slice — "Cloud & architecture"
   * would otherwise hide the older AWS posts that are the best of that topic.
   */
  const visible = useMemo(
    () =>
      isFiltering
        ? posts.filter((p) => postMatchesTopic(p, topic))
        : posts.slice(0, recentCount),
    [posts, topic, isFiltering, recentCount]
  );

  const desktopRemaining = posts.length - recentCount;
  const mobileRemaining = posts.length - Math.min(recentCount, MOBILE_VISIBLE);
  const backTo = earliestYear ? `, back to ${earliestYear}` : '';

  return (
    <>
      <TopicFilter active={topic} onChange={setTopic} />

      <Rail>
        {isFiltering ? (
          visible.map((post) => <TimelineRow key={post.slug} post={post} />)
        ) : (
          <>
            {visible[0] && <TimelineHero post={visible[0]} />}
            {visible.slice(1).map((post, i) => (
              <TimelineRow
                key={post.slug}
                post={post}
                hideOnMobile={i + 1 >= MOBILE_VISIBLE}
              />
            ))}

            {desktopRemaining > 0 && (
              <>
                <div className={`${GUTTER} pt-[18px] md:pt-5`}>EARLIER</div>
                <div className="border-l-2 border-border-light pl-[18px] pt-3.5 md:pl-8 md:pt-4">
                  <Link
                    href="/archive/"
                    className="text-sm font-medium text-squirrel-700 transition-colors hover:text-squirrel-800 md:text-[15px]"
                  >
                    <span className="md:hidden">{mobileRemaining} more posts →</span>
                    <span className="hidden md:inline">
                      {desktopRemaining} more posts{backTo} →
                    </span>
                  </Link>
                </div>
              </>
            )}
          </>
        )}
      </Rail>

      {visible.length === 0 && (
        <p className="py-10 text-sm text-text-muted">
          Nothing recent under this topic —{' '}
          <Link href="/archive/" className="font-medium text-squirrel-700 hover:text-squirrel-800">
            search the archive
          </Link>
          .
        </p>
      )}
    </>
  );
}
