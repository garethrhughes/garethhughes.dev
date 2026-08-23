import Image from 'next/image';
import { currentlyReading } from '@/lib/reading';

export function CurrentlyReading() {
  const book = currentlyReading;

  return (
    <aside className="flex items-center gap-3 border-y border-border-light py-3.5 md:border-0 md:py-0">
      <Image
        src={book.coverImage}
        alt={book.coverAlt}
        width={38}
        height={56}
        className="h-14 w-[38px] flex-none rounded-[5px] object-cover"
      />
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-faint">
          Reading
        </p>
        <p className="text-sm font-semibold text-text-primary">{book.title}</p>
        <p className="text-[13px] text-text-muted">{book.author}</p>
      </div>
    </aside>
  );
}
