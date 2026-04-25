'use client';

import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';

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
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={enableImageLinks ? clickableImageComponents : undefined}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
