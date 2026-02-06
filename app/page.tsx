import Link from 'next/link';
import { getAllPostsMeta } from '../lib/posts';

export const dynamic = 'force-static';

const PINNED_SLUGS = ['writeups'];
const RECENT_COUNT = 5;

export default function HomePage() {
  const allPosts = getAllPostsMeta();
  
  // Separate pinned and non-pinned posts
  const pinnedPosts = allPosts.filter(p => PINNED_SLUGS.includes(p.slug));
  const recentPosts = allPosts.filter(p => !PINNED_SLUGS.includes(p.slug)).slice(0, RECENT_COUNT);

  return (
    <>
      <h1 className="h1">keii.codes</h1>
      <p className="heroSubtitle">Security research, forensic deep-dives, and threat analysis from the trenches.</p>

      {pinnedPosts.length > 0 && (
        <>
          <h2 className="sectionTitle">📌 Pinned</h2>
          <section className="postList">
            {pinnedPosts.map((p) => (
              <article key={p.slug} className="postCard pinned">
                <h3 className="postCardTitle">
                  <Link href={`/posts/${p.slug}/`}>{p.title}</Link>
                </h3>
                <p className="postCardMeta">
                  {p.pubDate ? <span>{p.pubDate}</span> : null}
                  {p.description ? <span> · {p.description}</span> : null}
                </p>
              </article>
            ))}
          </section>
        </>
      )}

      <h2 className="sectionTitle">🕐 Recent posts</h2>
      <section className="postList">
        {recentPosts.map((p) => (
          <article key={p.slug} className="postCard">
            <h3 className="postCardTitle">
              <Link href={`/posts/${p.slug}/`}>{p.title}</Link>
            </h3>
            <p className="postCardMeta">
              {p.pubDate ? <span>{p.pubDate}</span> : null}
              {p.description ? <span> · {p.description}</span> : null}
            </p>
          </article>
        ))}
      </section>

      <div className="ctaWrapper">
        <Link href="/posts/" className="ctaBtn">View all posts →</Link>
      </div>
    </>
  );
}
