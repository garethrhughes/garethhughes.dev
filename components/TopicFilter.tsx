'use client';

import { TOPIC_NAMES, type Topic } from '@/lib/post-meta';
import { chipClass } from './TagPill';

export const EVERYTHING = 'Everything' as const;

export type TopicSelection = Topic | typeof EVERYTHING;

interface TopicFilterProps {
  active: TopicSelection;
  onChange: (topic: TopicSelection) => void;
}

/**
 * Five curated topic chips. There is deliberately no search box here — searching the ten
 * most recent posts is pointless, and a box that only navigates elsewhere reads as a
 * broken input. Search lives on `/archive/`, reachable from the nav and the EARLIER row.
 */
export function TopicFilter({ active, onChange }: TopicFilterProps) {
  const options: TopicSelection[] = [EVERYTHING, ...TOPIC_NAMES];

  return (
    /* Chips scroll horizontally on mobile rather than wrapping — labels stay full. */
    <div className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:mb-9 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
      {options.map((topic) => {
        const isActive = topic === active;
        return (
          <button
            key={topic}
            type="button"
            onClick={() => onChange(topic)}
            aria-pressed={isActive}
            className={chipClass(isActive)}
          >
            {topic}
          </button>
        );
      })}
    </div>
  );
}
