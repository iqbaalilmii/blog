import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type PageMeta = {
  slug: string;
  title: string;
  description?: string;
};

export type Page = PageMeta & {
  content: string;
};

const PAGES_DIR = path.join(process.cwd(), 'content', 'pages');

function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, '');
}

function inferTitle(slug: string, content: string): string {
  const headingMatch = content.match(/^#\s+(.+)$/m);
  if (headingMatch?.[1]) return headingMatch[1].trim();
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function readMarkdownFile(slug: string): string {
  const filePath = path.join(PAGES_DIR, `${slug}.md`);
  return fs.readFileSync(filePath, 'utf8');
}

export function getAllPageSlugs(): string[] {
  if (!fs.existsSync(PAGES_DIR)) return [];
  return fs
    .readdirSync(PAGES_DIR)
    .filter((name: string) => name.endsWith('.md'))
    .map((name: string) => slugFromFilename(name))
    .sort();
}

export function getPageBySlug(slug: string): Page {
  const raw = readMarkdownFile(slug);
  const parsed = matter(raw);
  const data = parsed.data as Record<string, unknown>;

  const title = (typeof data.title === 'string' && data.title.trim()) || inferTitle(slug, parsed.content);

  return {
    slug,
    title,
    description: typeof data.description === 'string' ? data.description : undefined,
    content: parsed.content
  };
}
