import { getAllPostMeta } from '@/lib/posts';
import { Header } from '@/components/Header';
import { BlogList } from '@/components/BlogList';

export default function HomePage() {
  const posts = getAllPostMeta();

  return (
    <div className="min-h-screen bg-background">
      <Header currentPath="/" />
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <h1 className="mb-2 text-3xl font-bold text-text-primary">Blog</h1>
        <p className="mb-8 text-text-muted">
          Thoughts on software engineering, leadership, and technology.
        </p>
        <BlogList posts={posts} />
      </main>
    </div>
  );
}
