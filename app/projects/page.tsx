import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Side projects by Gareth Hughes.',
  alternates: {
    canonical: '/projects/',
  },
};

const projects = [
  {
    name: 'OpenCode Skills',
    description:
      'A collection of reusable OpenCode skills for structured AI-assisted software development. Includes skills for architecture design, TDD-based development, security reviews, decision logging, and full feature dev-workflow orchestration.',
    url: null,
    appUrl: null,
    githubUrl: 'https://github.com/garethrhughes/skills',
    tags: ['OpenCode', 'AI', 'Developer Tooling', 'Skills'],
    blogSlug: 'opencode-skills' as string | null,
    image: null as string | null,
  },
  {
    name: 'Squirrel Notes',
    description:
      'A zero-knowledge, end-to-end encrypted notes app built for people who struggle to focus. Your passphrase never leaves your browser — the server stores only ciphertext. Features markdown editing, collections, tags, file attachments, and an MCP integration for Claude.',
    url: 'https://squirrelnotes.app',
    appUrl: 'https://my.squirrelnotes.app',
    githubUrl: null as string | null,
    tags: ['Zero-Knowledge', 'E2EE', 'Notes', 'MCP'],
    blogSlug: 'introducing-squirrel-notes' as string | null,
    image: '/images/screenshot2.png',
  },
  {
    name: 'Fragile',
    description:
      'A lightweight engineering metrics tool that syncs with Jira to surface DORA metrics, planning accuracy, cycle time, and roadmap accuracy — without the maintenance overhead of expensive SaaS alternatives. Built to give teams an honest snapshot of their sprints and planning.',
    url: null,
    appUrl: null,
    githubUrl: 'https://github.com/garethrhughes/fragile',
    tags: ['DORA', 'Jira', 'Engineering Metrics'],
    blogSlug: 'introducing-fragile' as string | null,
    image: '/images/screencapture-localhost-3000-dora-2026-04-15-12_10_43.png',
  },
  {
    name: 'gareth.photography',
    description:
      'A photography portfolio showcasing landscapes, wildlife, and nature across Australia. Built as a statically-exported Next.js site with album-based organisation and a clean, minimal gallery experience.',
    url: 'https://gareth.photography',
    appUrl: null,
    githubUrl: 'https://github.com/garethrhughes/gareth.photography',
    tags: ['Photography', 'Portfolio', 'Next.js'],
    blogSlug: null as string | null,
    image: '/images/gareth-photography-preview.jpg',
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header currentPath="/projects/" />
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <h1 className="mb-2 text-3xl font-bold text-text-primary">Projects</h1>
        <p className="mb-8 text-text-muted">
          Side projects and tools I&apos;ve built.
        </p>

        <div className="grid gap-6">
          {projects.map((project) => (
            <div
              key={project.name}
              className="rounded-xl border border-border bg-surface overflow-hidden shadow-sm"
            >
              {project.image && (
                <div className="relative aspect-[2/1] w-full bg-surface-alt">
                  <Image
                    src={project.image}
                    alt={`${project.name} screenshot`}
                    fill
                    className="object-cover object-top"
                  />
                </div>
              )}
              <div className="p-6">
              <h2 className="mb-2 text-xl font-bold text-text-primary">
                {project.name}
              </h2>
              <p className="mb-4 leading-relaxed text-text-secondary">
                {project.description}
              </p>

              <div className="mb-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-surface-brand px-2.5 py-0.5 text-xs font-medium text-squirrel-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
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
