## nice-blog

** fully vibecoded lmao **

Static blog untuk writeup CTF berbasis Markdown, siap deploy di Vercel.

### Struktur

- Markdown posts: `blog-posts/*.md`
- Markdown pages (route statik): `content/pages/*.md` → `/<slug>/` (contoh: `content/pages/about.md` → `/about/`)
- Aset gambar lokal:
	- Simpan di folder mana pun di bawah `blog-posts/` (contoh: `blog-posts/images-baby-step/`)
	- Saat `npm run dev` / `npm run build`, semua folder (non-`.md`) di bawah `blog-posts/` akan disalin ke `public/` lewat `scripts/sync-assets.mjs`
	- Di markdown, referensikan gambar pakai path absolut seperti: `!/images-baby-step/nama.png`

### Format frontmatter (opsional)

Contoh (mengikuti file di `blog-posts/`):

```md
---
title: "Judul Post"
pubDate: "2025-12-29"
description: "ringkas 1 kalimat"
featured: true
---

Isi markdown...
```

### Jalanin lokal

```bash
npm install
npm run dev
```

Lalu buka `http://localhost:3000`.

### Build static (untuk Vercel)

```bash
npm run build
```

Output static akan ada di folder `out/`.

Preview lokal:

```bash
npm run preview
```

### Deploy ke Vercel

1. Push repo ini ke GitHub.
2. Di Vercel: **New Project** → import repo.
3. Framework akan terdeteksi sebagai Next.js.
4. Klik **Deploy**.

### Nambah post baru

1. Tambah file baru di `blog-posts/` mis. `blog-posts/nama-post.md`.
2. Isi markdown + frontmatter (kalau mau).
3. Jalankan `npm run dev` dan post otomatis muncul di halaman Home/Posts.
