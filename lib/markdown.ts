import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';
import { visit } from 'unist-util-visit';

function rehypeRewriteRelativeImageSrc() {
  return function transformer(tree: unknown) {
    visit(tree as any, 'element', (node: any) => {
      if (node.tagName !== 'img') return;
      const src = node.properties?.src;
      if (typeof src !== 'string') return;
      // Keep already-absolute URLs and non-http schemes intact (e.g., data: for base64 images).
      if (
        src.startsWith('http://') ||
        src.startsWith('https://') ||
        src.startsWith('/') ||
        src.startsWith('data:') ||
        src.startsWith('blob:')
      ) {
        return;
      }

      // Treat relative assets as rooted at repo static path (copied to /public)
      node.properties.src = `/${src.replace(/^\.\//, '')}`;
    });
  };
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight)
    .use(rehypeRewriteRelativeImageSrc)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return String(file);
}
