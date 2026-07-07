/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Tambahkan baris ini untuk static export GitHub Pages
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
