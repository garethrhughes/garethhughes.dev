import { Suspense } from 'react';
import { getAllPostMeta } from '@/lib/posts';
import { Header } from '@/components/Header';
import { ArchiveList } from '@/components/ArchiveList';
import type { Metadata } from 'next';

const title = 'Archive - Gareth Hughes';
const description =
  'Every post — search and filter the full back catalogue by tag or keyword.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/archive/',
  },
  openGraph: {
    type: 'website',
    url: '/archive/',
    title,
    description,
    siteName: 'Gareth Hughes',
    images: [
      {
        url: '/avatar.jpeg',
        alt: 'Gareth Hughes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/avatar.jpeg'],
  },
};

export default function ArchivePage() {
  const posts = getAllPostMeta();

  return (
    <div className="min-h-screen bg-background">
      <Header currentPath="/archive/" />
      <main className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="mb-8 max-w-3xl">
          <h1 className="mb-2 text-3xl font-bold text-text-primary">Archive</h1>
          <p className="text-text-muted">
            All {posts.length} posts, newest first.
          </p>
        </div>
        <Suspense>
          <ArchiveList posts={posts} />
        </Suspense>
      </main>
    </div>
  );
}
