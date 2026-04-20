import type { MetadataRoute } from 'next';
import { getAllPostMeta } from '@/lib/posts';

export const dynamic = 'force-static';

const BASE_URL = 'https://garethhughes.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPostMeta();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/calendar`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/posts/${post.slug}`,
    lastModified: new Date(post.datePublished),
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  return [...staticRoutes, ...postRoutes];
}
