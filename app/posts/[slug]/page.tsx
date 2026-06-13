import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllSlugs, getPostBySlug } from '../../../lib/posts';
import { markdownToHtml } from '../../../lib/markdown';

export const dynamic = 'force-static';

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    return {
      title: post.title,
      description: post.description
    };
  } catch {
    return { title: 'Not found' };
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = (() => {
    try {
      return getPostBySlug(slug);
    } catch {
      notFound();
    }
  })();

  const html = await markdownToHtml(post.content);

  return (
    <article className="grid">
      <header className="post-header">
        <h1 className="post-title">{post.title}</h1>
        <p className="post-meta">
          {post.pubDate && (
            <Link className="post-date" href={`/posts/${slug}/`}>{post.pubDate}</Link>
          )}
          {post.description && (
            <span className="post-author">{post.description}</span>
          )}
        </p>
      </header>
      <div
        className="post-content post-content-full"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
