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
                <svg role="img" viewBox="0 0 24 24" width={14} height={14} fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                LinkedIn
              </Link>
              <Link
                href="https://github.com/garethrhughes/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors"
              >
                <svg role="img" viewBox="0 0 24 24" width={14} height={14} fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
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
