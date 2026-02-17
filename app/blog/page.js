export const metadata = {
  title: 'Blog — Developer Guides & Tutorials',
  description: 'Developer guides and tutorials. PostgreSQL tuning, JWT security, JSON tips, and more from DevToolKit.',
  alternates: { canonical: '/blog/' },
};
import Link from 'next/link';

const posts = [
  {
    slug: 'postgresql-tuning-guide',
    title: 'PostgreSQL Performance Tuning Guide 2026 — Complete Configuration Reference',
    desc: 'How to tune shared_buffers, work_mem, effective_cache_size and other key parameters for your PostgreSQL server.',
    date: '2026-02-17',
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-dark-50 mb-6">Blog</h1>
      <div className="space-y-6">
        {posts.map(p => (
          <Link key={p.slug} href={`/blog/${p.slug}/`} className="block bg-dark-800 border border-dark-700 rounded-xl p-5 no-underline hover:border-brand-400/30 transition-all">
            <div className="text-xs text-dark-500 mb-1">{p.date}</div>
            <div className="text-base font-semibold text-dark-100 mb-2">{p.title}</div>
            <div className="text-sm text-dark-400">{p.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
