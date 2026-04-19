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
    name: 'Squirrel Notes',
    description:
      'A zero-knowledge, end-to-end encrypted notes app built for people who struggle to focus. Your passphrase never leaves your browser — the server stores only ciphertext. Features markdown editing, collections, tags, file attachments, and an MCP integration for Claude.',
    url: 'https://squirrelnotes.app',
    appUrl: 'https://my.squirrelnotes.app',
    tags: ['Zero-Knowledge', 'E2EE', 'Notes', 'MCP'],
    blogSlug: 'introducing-squirrel-notes',
    image: '/images/screenshot2.png',
  },
  {
    name: 'Fragile',
    description:
      'A lightweight engineering metrics tool that syncs with Jira to surface DORA metrics, planning accuracy, cycle time, and roadmap accuracy — without the maintenance overhead of expensive SaaS alternatives. Built to give teams an honest snapshot of their sprints and planning.',
    url: null,
    appUrl: null,
    tags: ['DORA', 'Jira', 'Engineering Metrics'],
    blogSlug: 'introducing-fragile',
    image: '/images/screencapture-localhost-3000-dora-2026-04-15-12_10_43.png',
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
              <div className="relative aspect-[2/1] w-full bg-surface-alt">
                <Image
                  src={project.image}
                  alt={`${project.name} screenshot`}
                  fill
                  className="object-cover object-top"
                />
              </div>
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
                    className="rounded-full bg-surface-brand px-2.5 py-0.5 text-xs font-medium text-squirrel-700 dark:text-text-tertiary"
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
                <Link
                  href={`/posts/${project.blogSlug}/`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors"
                >
                  Read the blog post
                </Link>
              </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
