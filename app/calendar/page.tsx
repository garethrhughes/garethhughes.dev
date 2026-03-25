import type { Metadata } from 'next';

const CALENDAR_URL = 'https://calendar.app.google/Ma7EfFAWvoMACg457';

export const metadata: Metadata = {
  title: 'Calendar',
  robots: { index: false },
};

export default function CalendarPage() {
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content={`0; url=${CALENDAR_URL}`} />
      </head>
      <body>
        <p>
          Redirecting to calendar…{' '}
          <a href={CALENDAR_URL}>Click here if you are not redirected.</a>
        </p>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.location.replace(${JSON.stringify(CALENDAR_URL)})`,
          }}
        />
      </body>
    </html>
  );
}
