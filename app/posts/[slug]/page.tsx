import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  getAdjacentPosts,
  getAllSlugs,
  getPostBySlug,
  getRelatedPosts,
} from '@/lib/posts';
import { formatPostDate, formatTimelineStamp, type PostMeta } from '@/lib/post-meta';
import { Header } from '@/components/Header';
import { PostContent } from '@/components/PostContent';
import { SectionLabel } from '@/components/PageHeader';
import { GUTTER } from '@/components/Rail';
import { TagPills } from '@/components/TagPill';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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

/**
 * A related post as a timeline row rather than a card. This aside used to render the
 * `PostCard` that ADR 0016 removed from the home page — shadow lift, 16/9 cover and an
 * image zoom — on the page every timeline click lands on.
 */
function RelatedRow({ post }: { post: PostMeta }) {
  return (
    <li>
      <Link href={`/posts/${post.slug}/`} className="group flex gap-3 py-3.5">
        <div className="min-w-0 flex-1">
          <div className={`${GUTTER} mb-1`}>{formatTimelineStamp(post.datePublished)}</div>
          <div className="text-sm font-semibold leading-snug text-text-primary transition-colors group-hover:text-squirrel-700">
            {post.title}
          </div>
        </div>
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt=""
            width={96}
            height={60}
            className="h-[60px] w-24 flex-none rounded-lg border border-border bg-surface-alt object-cover object-top"
          />
        )}
      </Link>
    </li>
  );
}

/** Older / newer navigation, stamped in the timeline's gutter style. */
function AdjacentLink({
  post,
  direction,
}: {
  post: PostMeta;
  direction: 'newer' | 'older';
}) {
  const isNewer = direction === 'newer';
  return (
    <Link
      href={`/posts/${post.slug}/`}
      className={`group rounded-xl border border-border bg-surface-alt p-4 transition-colors hover:border-squirrel-300 ${
        isNewer ? '' : 'md:col-start-2 md:text-right'
      }`}
    >
      <div className={`${GUTTER} mb-1.5 flex items-center gap-1.5 ${isNewer ? '' : 'md:justify-end'}`}>
        {isNewer && <ArrowLeft size={12} aria-hidden="true" />}
        {isNewer ? 'NEWER' : 'OLDER'}
        {!isNewer && <ArrowRight size={12} aria-hidden="true" />}
      </div>
      <div className="text-sm font-semibold leading-snug text-text-primary transition-colors group-hover:text-squirrel-700">
        {post.title}
      </div>
    </Link>
  );
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug, post.tags, 5);
  const { newer, older } = getAdjacentPosts(post.slug);

  return (
    <div className="min-h-screen bg-background">
      <Header currentPath="/" />

      {/* Narrower than the site's max-w-7xl so the article column *is* the reading measure.
          Capping at 72ch inside a 1fr column left ~140px of dead space that read as an
          enormous gutter between the post and the aside. */}
      <main className="mx-auto max-w-[1140px] px-4 py-10 md:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-squirrel-600 transition-colors"
        >
          <ArrowLeft size={14} />
          All posts
        </Link>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
          <article className="min-w-0">
            {/* Still capped for the single-column layout below `lg`, where the container is
                wider than the measure. At `lg` and up the grid column already matches it. */}
            <div className="max-w-[72ch]">
              <header className="mb-8">
                <h1 className="mb-4 text-3xl font-bold leading-tight text-text-primary [text-wrap:pretty]">
                  {post.title}
                </h1>
                {/* No calendar or tag icons — the timeline states the same two facts as a
                    bare mono stamp and quiet pills. */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className={GUTTER}>{formatPostDate(post.datePublished)}</span>
                  <TagPills tags={post.tags} />
                </div>
                <hr className="mt-6 border-border" />
              </header>

              <PostContent content={post.content} enableImageLinks />

              {/* A two-column grid rather than a flex row: the newest and oldest posts
                  have only one neighbour, and a lone link should stay in its own half
                  rather than stretch across the measure. */}
              {(newer || older) && (
                <nav
                  aria-label="Adjacent posts"
                  className="mt-12 flex flex-col gap-2.5 border-t border-border pt-7 md:grid md:grid-cols-2 md:gap-4"
                >
                  {newer && <AdjacentLink post={newer} direction="newer" />}
                  {older && <AdjacentLink post={older} direction="older" />}
                </nav>
              )}
            </div>
          </article>

          {related.length > 0 && (
            <aside className="lg:sticky lg:top-20 lg:self-start">
              <SectionLabel>Related posts</SectionLabel>
              <ul className="divide-y divide-border border-t border-border">
                {related.map((r) => (
                  <RelatedRow key={r.slug} post={r} />
                ))}
              </ul>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}
