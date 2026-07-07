import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import ThemeToggle from './components/ThemeToggle';

export const metadata: Metadata = {
  title: {
    default: 'fourbetter',
    template: '%s · fourbetter'
  },
  description: 'Security research, forensic analysis, and threat intelligence by a DFIR practitioner.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-FOUC: restore saved theme before first paint */}
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}` }} />
      </head>
      <body>
        <header className="page-header">
          <div className="grid">
            <div className="logo">
              <Link href="/">fourbetter</Link>
            </div>
            <p className="tagline">security research &amp; dfir</p>
            <hr className="lifted" />
          </div>
          <nav>
            <input type="checkbox" id="drop" />
            <label htmlFor="drop" id="menu-toggle" />
            <ul className="menu nls">
              <li>
                <Link className="navlink" href="/">
                  <span className="navlink-text">home</span>
                </Link>
              </li>
              <li>
                <Link className="navlink" href="/posts/">
                  <span className="navlink-text">posts</span>
                </Link>
              </li>
              <li>
                <Link className="navlink" href="/about/">
                  <span className="navlink-text">about</span>
                </Link>
              </li>
              <li className="theme-toggle-li">
                <ThemeToggle />
              </li>
            </ul>
          </nav>
        </header>

        <main>{children}</main>

        <footer>
          <p className="privacy">
            <a href="https://github.com/iqbaalilmii" target="_blank" rel="noopener noreferrer">github</a>
            {' · '}
            <a href="https://www.linkedin.com/in/iqbaalilmii/" target="_blank" rel="noopener noreferrer">linkedin</a>
            {' · '}
            <span>© 2026 fourbetter</span>
          </p>
        </footer>
      </body>
    </html>
  );
}
