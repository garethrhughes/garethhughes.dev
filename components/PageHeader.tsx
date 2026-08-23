interface PageHeaderProps {
  /** Small-caps kicker — the page's name, not its headline. */
  label: string;
  /** One sentence, set large and light. This carries the page, so keep it human. */
  lead: React.ReactNode;
  /** Sits before the text block — an avatar on `/about/`. */
  leading?: React.ReactNode;
  /** Actions or a secondary block, laid out to the right on desktop. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * The quiet page front established by the home page: an uppercase label above a large,
 * unbolded lead. Replaces the `text-3xl font-bold` heading each page used to hand-roll —
 * a bold headline competes with the post titles below it, which are the real content.
 *
 * `items-end` bottom-aligns whatever is passed as children with the lead line rather than
 * with the label above it.
 */
export function PageHeader({
  label,
  lead,
  leading,
  children,
  className = '',
}: PageHeaderProps) {
  return (
    <div
      className={`mb-8 flex flex-col gap-5 md:mb-11 md:flex-row md:items-end md:justify-between md:gap-10 ${className}`}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:gap-6">
        {leading}
        <div className="max-w-[560px]">
          <h1 className="mb-2.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-text-muted md:mb-3 md:text-[15px]">
            {label}
          </h1>
          <p className="text-[19px] leading-[1.45] text-text-primary md:text-[22px]">{lead}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

/**
 * The small-caps section label used between page sections, over a top rule. The home page's
 * "Things I've built" heading; About's section headings adopt it so a CV section and a
 * blog section carry the same weight.
 */
export function SectionLabel({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`mb-3.5 text-xs font-semibold uppercase tracking-[0.08em] text-text-muted md:mb-4 ${className}`}
    >
      {children}
    </h2>
  );
}
