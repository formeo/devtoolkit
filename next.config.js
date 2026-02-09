/** @type {import('next').NextConfig} */
const nextConfig = {
  // For Vercel: no 'output: export' needed — Vercel handles SSR/SSG natively
  // For other hosts (Cloudflare Pages, GitHub Pages): uncomment the line below
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
