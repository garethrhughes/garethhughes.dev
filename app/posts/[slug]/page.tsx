import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAllSlugs, getPostBySlug } from '@/lib/posts';
import { Header } from '@/components/Header';
import { PostContent } from '@/components/PostContent';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const canonicalUrl = `/posts/${post.slug}`;
  const imageUrl = post.coverImage || '/avatar.jpeg';

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title: post.title,
      description: post.excerpt,
      siteName: 'Gareth Hughes',
      publishedTime: post.datePublished,
      authors: ['Gareth Hughes'],
      tags: post.tags,
      images: [
        {
          url: imageUrl,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const date = new Date(post.datePublished).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background">
      <Header currentPath="/" />

      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-squirrel-600 transition-colors"
        >
          <ArrowLeft size={14} />
          All posts
        </Link>

        <article>
          <header className="mb-8">
            <h1 className="mb-4 text-3xl font-bold text-text-primary leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-faint">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {date}
              </span>
              {post.tags.length > 0 && (
                <span className="flex flex-wrap items-center gap-1.5">
                  <Tag size={14} />
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-squirrel-100 px-2.5 py-0.5 text-xs text-squirrel-700"
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              )}
            </div>
            <hr className="mt-6 border-border" />
          </header>

          <PostContent content={post.content} enableImageLinks />
        </article>
      </main>
    </div>
  );
}
