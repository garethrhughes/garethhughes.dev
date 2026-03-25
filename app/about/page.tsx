import { getAboutContent } from '@/lib/posts';
import { Header } from '@/components/Header';
import { PostContent } from '@/components/PostContent';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'About' };

export default function AboutPage() {
  const content = getAboutContent();

  return (
    <div className="min-h-screen bg-background">
      <Header currentPath="/about/" />
      <main className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <PostContent content={content} />
      </main>
    </div>
  );
}
