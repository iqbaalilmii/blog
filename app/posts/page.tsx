import Link from 'next/link';
import { Fragment } from 'react';
import { getAllPostsMeta } from '../../lib/posts';

export const dynamic = 'force-static';

export default function PostsPage() {
  const posts = getAllPostsMeta();

  return (
    <>
      {posts.map((p, i) => (
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
          {i < posts.length - 1 && <hr className="snippetbreak" />}
        </Fragment>
      ))}
    </>
  );
}
