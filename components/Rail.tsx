/**
 * The gutter-and-thread geometry behind the home timeline, About's Experience and Skills
 * sections, and the post page's related list. Geometry only — gutter width, the rail
 * border, the dot. All content is passed as children so the four uses cannot drift apart
 * visually while staying free to differ in what they render.
 */

/** The mono stamp style for whatever sits in the gutter. */
export const GUTTER = 'font-mono text-[11px] font-medium text-text-faint md:text-xs';

export function Rail({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-[52px_1fr] md:grid-cols-[96px_1fr] ${className}`}>
      {children}
    </div>
  );
}

interface RailRowProps {
  /** Rendered in the date gutter — a stamp, a period, or a category label. */
  gutter: React.ReactNode;
  children: React.ReactNode;
  /** Larger dot and roomier padding, for the first entry in a run. */
  emphasis?: boolean;
  /** Desktop-only row. `contents` keeps both halves direct children of the grid. */
  hideOnMobile?: boolean;
  /** Extra padding on the gutter cell so the stamp lines up with the row's first line. */
  gutterClassName?: string;
  threadClassName?: string;
}

/**
 * One row: a gutter cell and a threaded cell, wrapped in `display: contents` so both stay
 * direct children of the `Rail` grid and the rail border runs unbroken down the column.
 */
export function RailRow({
  gutter,
  children,
  emphasis = false,
  hideOnMobile = false,
  gutterClassName = '',
  threadClassName = '',
}: RailRowProps) {
  const dot = emphasis
    ? 'absolute -left-[6px] top-[26px] h-2.5 w-2.5 rounded-full bg-squirrel-500 shadow-[0_0_0_3px_var(--surface)] md:-left-[7px] md:top-9 md:h-3 md:w-3'
    : 'absolute -left-[4px] top-6 h-1.5 w-1.5 rounded-full bg-squirrel-300 shadow-[0_0_0_3px_var(--surface)] md:-left-[5px] md:top-[30px] md:h-2 md:w-2';

  const padding = emphasis
    ? 'py-[18px] pb-[26px] md:py-[22px] md:pb-[30px]'
    : 'py-4 pb-[18px] md:py-5 md:pb-[22px]';

  return (
    <div className={hideOnMobile ? 'hidden md:contents' : 'contents'}>
      <div
        className={`${GUTTER} ${emphasis ? 'pt-[22px] md:pt-[26px]' : 'pt-5 md:pt-[26px]'} ${gutterClassName}`}
      >
        {gutter}
      </div>

      <div
        className={`relative border-l-2 border-squirrel-100 pl-[18px] md:pl-8 ${padding} ${threadClassName}`}
      >
        <span className={dot} aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}
