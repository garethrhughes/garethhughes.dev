import Image from 'next/image';
import { currentlyReading } from '@/lib/reading';

export function CurrentlyReading() {
  const book = currentlyReading;

  return (
    <aside className="flex items-center gap-3">
      <div className="relative aspect-[2/3] h-16 shrink-0 overflow-hidden rounded-md bg-surface-alt">
        <Image
          src={book.coverImage}
          alt={book.coverAlt}
          fill
          sizes="43px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Currently Reading
        </p>
        <h2 className="text-sm font-semibold leading-snug text-text-primary">
          {book.title}
        </h2>
        <p className="text-sm text-text-tertiary">{book.author}</p>
      </div>
    </aside>
  );
}
