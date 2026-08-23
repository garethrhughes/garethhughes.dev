/**
 * The site's one passive tag pill. Deliberately quiet — pills sit under titles and beside
 * prose, so they label rather than compete. The loud filled treatment is reserved for the
 * *active* state of an interactive chip (`TopicFilter`, the archive tag list).
 */
export const TAG_PILL =
  'rounded-full bg-squirrel-50 px-[9px] py-0.5 text-xs font-medium text-squirrel-700';

export function TagPill({ children }: { children: React.ReactNode }) {
  return <span className={TAG_PILL}>{children}</span>;
}

interface TagPillsProps {
  tags: string[];
  /** Cap the number rendered. Omit to show every tag. */
  max?: number;
  /** Render as `<span>`s — required inside a `<p>` or an `<a>`'s text flow. */
  inline?: boolean;
  className?: string;
}

export function TagPills({ tags, max, inline = false, className = '' }: TagPillsProps) {
  if (tags.length === 0) return null;

  const shown = max ? tags.slice(0, max) : tags;
  const Wrapper = inline ? 'span' : 'div';

  return (
    <Wrapper className={`flex flex-wrap gap-1.5 ${className}`}>
      {shown.map((tag) => (
        <span key={tag} className={TAG_PILL}>
          {tag}
        </span>
      ))}
    </Wrapper>
  );
}
