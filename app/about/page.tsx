import Image from 'next/image';
import Link from 'next/link';
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
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">

        {/* Profile hero */}
        <div className="mb-10 flex flex-col items-center gap-6 rounded-xl border border-border bg-surface p-8 shadow-sm sm:flex-row sm:items-start">
          <Image
            src="/avatar.jpeg"
            alt="Gareth Hughes"
            width={96}
            height={96}
            className="rounded-full object-cover ring-4 ring-squirrel-100 dark:ring-surface-raised shrink-0"
            priority
          />
          <div className="text-center sm:text-left">
            <h1 className="mb-1 text-2xl font-bold text-text-primary">Gareth Hughes</h1>
            <p className="mb-4 text-text-muted">Senior Engineering Manager · Sydney, Australia</p>
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              <Link
                href="/calendar/"
                className="inline-flex items-center gap-1.5 rounded-md bg-squirrel-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-squirrel-600 transition-colors"
              >
                <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Book a call
              </Link>
              <Link
                href="https://www.linkedin.com/in/garethhughes/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors"
              >
                LinkedIn
              </Link>
              <Link
                href="https://github.com/garethrhughes/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors"
              >
                GitHub
              </Link>
            </div>
          </div>
        </div>

        <PostContent content={content} />
      </main>
    </div>
  );
}
