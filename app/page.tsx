import { Suspense } from 'react';
import { getAllPostMeta } from '@/lib/posts';
import { Header } from '@/components/Header';
import { BlogList } from '@/components/BlogList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Gareth Hughes',
  description: 'Thoughts on software engineering, leadership, and technology.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    title: 'Blog - Gareth Hughes',
    description: 'Thoughts on software engineering, leadership, and technology.',
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
    title: 'Blog - Gareth Hughes',
    description: 'Thoughts on software engineering, leadership, and technology.',
    images: ['/avatar.jpeg'],
  },
};

export default function HomePage() {
  const posts = getAllPostMeta();

  return (
    <div className="min-h-screen bg-background">
      <Header currentPath="/" />
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <h1 className="mb-2 text-3xl font-bold text-text-primary">Blog</h1>
        <p className="mb-8 text-text-muted">
          Thoughts on software engineering, leadership, and technology.
        </p>
        <Suspense>
          <BlogList posts={posts} />
        </Suspense>
      </main>
    </div>
  );
}
