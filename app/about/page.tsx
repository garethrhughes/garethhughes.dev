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
            className="rounded-full object-cover ring-4 ring-squirrel-100 shrink-0"
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
                <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                LinkedIn
              </Link>
              <Link
                href="https://github.com/garethrhughes/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors"
              >
                <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
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
