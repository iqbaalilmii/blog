import path from 'node:path';
import { mkdir, cp, readdir, stat } from 'node:fs/promises';

const projectRoot = process.cwd();
const postsDir = path.join(projectRoot, 'blog-posts');
const publicDir = path.join(projectRoot, 'public');

async function isDirectory(p) {
  try {
    const s = await stat(p);
    return s.isDirectory();
  } catch {
    return false;
  }
}

await mkdir(publicDir, { recursive: true });

// Copy every directory inside blog-posts/ into public/.
// Example: blog-posts/images-baby-step -> public/images-baby-step
try {
  const entries = await readdir(postsDir);
  for (const name of entries) {
    const from = path.join(postsDir, name);
    if (!(await isDirectory(from))) continue;

    const to = path.join(publicDir, name);
    await cp(from, to, { recursive: true, force: true });
  }
} catch {
  // blog-posts might not exist in some environments
}
