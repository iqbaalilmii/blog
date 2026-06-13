import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type PostMeta = {
  slug: string;
  title: string;
  pubDate?: string;
  description?: string;
  featured?: boolean;
};

export type Post = PostMeta & {
  content: string;
};

const POSTS_DIR = path.join(process.cwd(), 'blog-posts');

const PINNED_SLUGS: string[] = ['writeups'];

function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, '');
}

function readMarkdownFile(slug: string): { filePath: string; raw: string; mtimeMs: number } {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  const stat = fs.statSync(filePath);
  const raw = fs.readFileSync(filePath, 'utf8');
  return { filePath, raw, mtimeMs: stat.mtimeMs };
}

function inferTitle(slug: string, content: string): string {
  const headingMatch = content.match(/^#\s+(.+)$/m);
  if (headingMatch?.[1]) return headingMatch[1].trim();
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeDate(input?: unknown): string | undefined {
  if (typeof input !== 'string') return undefined;
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString().slice(0, 10);
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((name: string) => name.endsWith('.md'))
    .map((name: string) => slugFromFilename(name))
    .sort();
}

export function getAllPostsMeta(): PostMeta[] {
  const slugs = getAllSlugs();

  const posts = slugs.map((slug) => {
    const { raw, mtimeMs } = readMarkdownFile(slug);
    const parsed = matter(raw);
    const data = parsed.data as Record<string, unknown>;

    const title = (typeof data.title === 'string' && data.title.trim()) || inferTitle(slug, parsed.content);
    const pubDate = normalizeDate(data.pubDate) ?? normalizeDate(data.date) ?? new Date(mtimeMs).toISOString().slice(0, 10);

    return {
      slug,
      title,
      pubDate,
      description: typeof data.description === 'string' ? data.description : undefined,
      featured: typeof data.featured === 'boolean' ? data.featured : undefined
    } satisfies PostMeta;
  });

  posts.sort((a, b) => {
    const pinnedA = PINNED_SLUGS.indexOf(a.slug);
    const pinnedB = PINNED_SLUGS.indexOf(b.slug);
    const rankA = pinnedA === -1 ? Number.POSITIVE_INFINITY : pinnedA;
    const rankB = pinnedB === -1 ? Number.POSITIVE_INFINITY : pinnedB;
    if (rankA !== rankB) return rankA - rankB;

    return (b.pubDate ?? '').localeCompare(a.pubDate ?? '');
  });
  return posts;
}

export function getPostBySlug(slug: string): Post {
  const { raw } = readMarkdownFile(slug);
  const parsed = matter(raw);
  const data = parsed.data as Record<string, unknown>;

  const title = (typeof data.title === 'string' && data.title.trim()) || inferTitle(slug, parsed.content);
  const pubDate = normalizeDate(data.pubDate) ?? normalizeDate(data.date);

  return {
    slug,
    title,
    pubDate,
    description: typeof data.description === 'string' ? data.description : undefined,
    featured: typeof data.featured === 'boolean' ? data.featured : undefined,
    content: parsed.content
  };
}
