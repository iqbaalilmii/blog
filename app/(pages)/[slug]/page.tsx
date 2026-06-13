import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPageSlugs, getPageBySlug } from '../../../lib/pages';
import { markdownToHtml } from '../../../lib/markdown';

export const dynamic = 'force-static';

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getAllPageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const page = getPageBySlug(slug);
    return {
      title: page.title,
      description: page.description
    };
  } catch {
    return { title: 'Not found' };
  }
}

export default async function MarkdownPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = (() => {
    try {
      return getPageBySlug(slug);
    } catch {
      notFound();
    }
  })();

  const html = await markdownToHtml(page.content);

  return (
    <article className="grid">
      <header className="post-header">
        <h1 className="post-title">{page.title}</h1>
      </header>
      <div
        className="post-content post-content-full"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
