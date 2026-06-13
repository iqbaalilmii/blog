import Link from 'next/link';

export default function NotFound() {
  return (
    <article className="grid">
      <header className="post-header">
        <h1 className="post-title">not found</h1>
      </header>
      <div className="post-content">
        <p>The page you&apos;re looking for doesn&apos;t exist.</p>
        <p><Link href="/">back to home</Link></p>
      </div>
    </article>
  );
}
