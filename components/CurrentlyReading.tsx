import Image from 'next/image';
import { currentlyReading } from '@/lib/reading';

export function CurrentlyReading() {
  const book = currentlyReading;

  return (
    <aside className="rounded-xl border border-border bg-surface p-4 shadow-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
        Currently Reading
      </p>
      <div className="flex gap-4">
        <div className="relative aspect-[2/3] w-20 shrink-0 overflow-hidden rounded-md bg-surface-alt">
          <Image
            src={book.coverImage}
            alt={book.coverAlt}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold leading-snug text-text-primary">
            {book.title}
          </h2>
          <p className="mb-2 text-sm text-text-tertiary">{book.author}</p>
          <p className="text-sm leading-relaxed text-text-secondary">
            {book.synopsis}
          </p>
        </div>
      </div>
    </aside>
  );
}
