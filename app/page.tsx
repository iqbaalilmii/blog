import Link from 'next/link';
import { Fragment } from 'react';
import { getAllPostsMeta } from '../lib/posts';

export const dynamic = 'force-static';

const PINNED_SLUGS = ['writeups'];
const RECENT_COUNT = 5;

export default function HomePage() {
  const allPosts = getAllPostsMeta();

  const pinnedPosts = allPosts.filter(p => PINNED_SLUGS.includes(p.slug));
  const recentPosts = allPosts.filter(p => !PINNED_SLUGS.includes(p.slug)).slice(0, RECENT_COUNT);

  return (
    <>
      {pinnedPosts.map((p) => (
        <article key={p.slug} className="grid">
          <div className="post-header-snippet">
            <h2 className="post-title">
              <Link href={`/posts/${p.slug}/`}>{p.title}</Link>
            </h2>
            <p className="post-meta">
              {p.pubDate && <Link className="post-date" href={`/posts/${p.slug}/`}>{p.pubDate}</Link>}
              {p.description && <span className="post-author">{p.description}</span>}
            </p>
          </div>
        </article>
      ))}

      {recentPosts.map((p, i) => (
        <Fragment key={p.slug}>
          <article className="grid">
            <div className="post-header-snippet">
              <h2 className="post-title">
                <Link href={`/posts/${p.slug}/`}>{p.title}</Link>
              </h2>
              <p className="post-meta">
                {p.pubDate && <Link className="post-date" href={`/posts/${p.slug}/`}>{p.pubDate}</Link>}
                {p.description && <span className="post-author">{p.description}</span>}
              </p>
            </div>
          </article>
          {i < recentPosts.length - 1 && <hr className="snippetbreak" />}
        </Fragment>
      ))}

      <p className="expand-post-link">
        <Link className="more-link" href="/posts/">all posts →</Link>
      </p>
    </>
  );
}
