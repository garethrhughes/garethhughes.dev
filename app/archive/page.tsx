import { Suspense } from 'react';
import { getTimelinePosts } from '@/lib/posts';
import { Header } from '@/components/Header';
import { ArchiveList } from '@/components/ArchiveList';
import { PageHeader } from '@/components/PageHeader';
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
  const posts = getTimelinePosts();

  return (
    <div className="min-h-screen bg-background">
      <Header currentPath="/archive/" />
      <main className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <PageHeader
          label="Archive"
          lead={`Every post — all ${posts.length} of them, newest first. Search by keyword or filter by tag.`}
        />
        <Suspense>
          <ArchiveList posts={posts} />
        </Suspense>
      </main>
    </div>
  );
}
