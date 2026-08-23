import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { projects } from '@/lib/projects';
import { PageHeader } from '@/components/PageHeader';
import { TagPills } from '@/components/TagPill';
import type { Metadata } from 'next';

const title = 'Projects - Gareth Hughes';
const description =
  'Side projects and tools built by Gareth Hughes — a zero-knowledge notes app, an engineering metrics dashboard, developer tooling, and a photography portfolio.';

export const metadata: Metadata = {
  title: 'Projects',
  description,
  alternates: {
    canonical: '/projects/',
  },
  openGraph: {
    type: 'website',
    url: '/projects/',
    title,
    description,
    siteName: 'Gareth Hughes',
    images: [{ url: '/avatar.jpeg', alt: 'Gareth Hughes' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/avatar.jpeg'],
  },
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header currentPath="/projects/" />
      <main className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <PageHeader
          label="Projects"
          lead="Side projects and tools I've built — mostly things I wanted to exist and couldn't buy."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.name}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface-alt transition-colors hover:border-squirrel-300"
            >
              {project.image && (
                <div className="relative aspect-[16/9] w-full bg-surface-alt">
                  <Image
                    src={project.image}
                    alt={`${project.name} screenshot`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-top"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
              <h2 className="mb-2 text-xl font-bold text-text-primary">
                {project.name}
              </h2>
              <p className="mb-4 leading-relaxed text-text-secondary">
                {project.description}
              </p>

              <TagPills tags={project.tags} className="mb-5" />

              <div className="mt-auto flex flex-wrap gap-2">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md bg-squirrel-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-squirrel-600 transition-colors"
                  >
                    Website
                  </a>
                )}
                {project.appUrl && (
                  <a
                    href={project.appUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors"
                  >
                    Try it free
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors"
                  >
                    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                    GitHub
                  </a>
                )}
                {project.npmUrl && (
                  <a
                    href={project.npmUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors"
                  >
                    <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden="true">
                      <rect width="16" height="16" rx="2" fill="currentColor"/>
                      <text x="8" y="11.5" textAnchor="middle" fill="white" fontSize="7" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" fontWeight="900">npm</text>
                    </svg>
                    npm
                  </a>
                )}
                {project.blogSlug && (
                <Link
                  href={`/posts/${project.blogSlug}/`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors"
                >
                  Read the blog post
                </Link>
                )}
              </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
