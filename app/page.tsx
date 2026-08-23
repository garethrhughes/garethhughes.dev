import Link from 'next/link';
import { getEarliestPostYear, getTimelinePosts } from '@/lib/posts';
import { projects } from '@/lib/projects';
import { Header } from '@/components/Header';
import { Timeline } from '@/components/Timeline';
import { CurrentlyReading } from '@/components/CurrentlyReading';
import type { Metadata } from 'next';

const RECENT_POST_COUNT = 10;

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
  const posts = getTimelinePosts();

  return (
    <div className="min-h-screen bg-background">
      <Header currentPath="/" />
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-14">
        {/* items-end bottom-aligns the book cover with the bio line, not the name label. */}
        <div className="mb-8 flex flex-col gap-5 md:mb-11 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="max-w-[560px]">
            <h1 className="mb-2.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-text-muted md:mb-3 md:text-[15px]">
              Gareth Hughes
            </h1>
            <p className="text-[19px] leading-[1.45] text-text-primary md:text-[22px]">
              I build software and lead the people who build software. Sydney, Australia.
            </p>
          </div>
          <CurrentlyReading />
        </div>

        <Timeline
          posts={posts}
          recentCount={RECENT_POST_COUNT}
          earliestYear={getEarliestPostYear()}
        />

        <section className="mt-10 border-t border-border pt-7 md:mt-14 md:pt-9">
          <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.08em] text-text-muted md:mb-4">
            Things I&apos;ve built
          </h2>
          <div className="flex flex-col gap-2.5 md:grid md:grid-cols-5 md:gap-4">
            {projects.map((project) => (
              <Link
                key={project.name}
                href="/projects/"
                className="rounded-xl border border-border bg-surface-alt p-3.5 transition-colors hover:border-squirrel-300 md:p-4"
              >
                <p className="mb-1 text-sm font-semibold leading-[1.35] text-text-primary md:mb-1.5">
                  {project.name}
                </p>
                <p className="text-xs leading-normal text-text-muted">{project.kind}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
