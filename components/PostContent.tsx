'use client';

import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface PostContentProps {
  content: string;
  enableImageLinks?: boolean;
}

const clickableImageComponents: Components = {
  img: ({ src, alt }) => {
    if (!src) return null;

    return (
      <a
        href={String(src)}
        target="_blank"
        rel="noopener noreferrer"
        className="markdown-image-link"
        aria-label={`Open image${alt ? `: ${alt}` : ''}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={String(src)} alt={alt ?? ''} loading="lazy" />
      </a>
    );
  },
};

export function PostContent({ content, enableImageLinks = false }: PostContentProps) {
  return (
    <div className="note-preview">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={enableImageLinks ? clickableImageComponents : undefined}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
