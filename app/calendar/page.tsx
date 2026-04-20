import type { Metadata } from 'next';
import Script from 'next/script';
import { Header } from '@/components/Header';

const CALENDAR_URL = 'https://calendar.app.google/Ma7EfFAWvoMACg457';

export const metadata: Metadata = {
  title: 'Calendar',
  robots: { index: false },
};

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-24 md:px-6 flex flex-col items-center">
        <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-surface p-10 shadow-sm text-center max-w-md w-full">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-brand">
            <svg
              viewBox="0 0 24 24"
              width={32}
              height={32}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="text-squirrel-600"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-text-primary mb-2">Redirecting to calendar…</h1>
            <p className="text-sm text-text-muted">
              You&rsquo;ll be taken to Google Calendar to book a time.{' '}
              <a
                href={CALENDAR_URL}
                className="text-squirrel-600 underline hover:text-squirrel-700 transition-colors"
              >
                Click here if you are not redirected.
              </a>
            </p>
          </div>
        </div>
      </main>
      <Script
        id="calendar-redirect"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(CALENDAR_URL)})`,
        }}
      />
    </div>
  );
}
