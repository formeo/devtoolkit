export const metadata = {
  title: 'Blog — Developer Guides & Tutorials',
  description: 'Developer guides and tutorials. PostgreSQL tuning, Nginx configuration, GitLab CI/CD pipelines, and more.',
  alternates: { canonical: '/blog/' },
};
import Link from 'next/link';

const posts = [
  {
    slug: 'gitlab-ci-cd-guide',
    title: 'GitLab CI/CD Pipeline Guide 2026 — From Zero to Production',
    desc: 'Build production-ready .gitlab-ci.yml pipelines with lint, test, build, and deploy stages for any language.',
    date: '2026-02-19',
    tag: 'DevOps',
  },
  {
    slug: 'nginx-configuration-guide',
    title: 'Nginx Configuration Guide for Developers',
    desc: 'Reverse proxy, SSL with Let\'s Encrypt, gzip, security headers, load balancing — practical examples.',
    date: '2026-02-19',
    tag: 'Nginx',
  },
  {
    slug: 'postgresql-tuning-guide',
    title: 'PostgreSQL Performance Tuning Guide 2026 — Complete Configuration Reference',
    desc: 'How to tune shared_buffers, work_mem, effective_cache_size and other key parameters for your PostgreSQL server.',
    date: '2026-02-17',
    tag: 'PostgreSQL',
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-dark-50 mb-6">Blog</h1>
      <div className="space-y-4">
        {posts.map(p => (
          <Link key={p.slug} href={`/blog/${p.slug}/`} className="block bg-dark-800 border border-dark-700 rounded-xl p-5 no-underline hover:border-brand-400/30 transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-semibold text-brand-400 bg-brand-400/10 px-2 py-0.5 rounded-full uppercase tracking-wider">{p.tag}</span>
              <span className="text-xs text-dark-500">{p.date}</span>
            </div>
            <div className="text-base font-semibold text-dark-100 mb-1 group-hover:text-dark-50 transition-colors">{p.title}</div>
            <div className="text-sm text-dark-400">{p.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
