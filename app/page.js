import Link from 'next/link';
import { TOOLS } from '../components/tools-data';
import AdBanner from '../components/AdBanner';

const POPULAR_IDS = ['json-formatter', 'postgres-config', 'jwt-decoder', 'nginx-config', 'gitlab-ci-generator', 'password-generator'];

const BLOG_POSTS = [
  {
    slug: 'postgresql-tuning-guide',
    title: 'PostgreSQL Performance Tuning Guide 2026',
    desc: 'Complete postgresql.conf reference with formulas and recommended values by server size.',
    tag: 'PostgreSQL',
  },
  {
    slug: 'nginx-configuration-guide',
    title: 'Nginx Configuration Guide for Developers',
    desc: 'Reverse proxy, SSL, gzip, load balancing, security headers — practical examples.',
    tag: 'Nginx',
  },
  {
    slug: 'gitlab-ci-cd-guide',
    title: 'GitLab CI/CD Pipeline Guide 2026',
    desc: 'Build, test, and deploy with .gitlab-ci.yml — from zero to production pipeline.',
    tag: 'DevOps',
  },
];

export default function HomePage() {
  const popular = POPULAR_IDS.map(id => TOOLS.find(t => t.id === id)).filter(Boolean);
  const rest = TOOLS.filter(t => !POPULAR_IDS.includes(t.id));

  const categories = {};
  rest.forEach(t => { (categories[t.category] = categories[t.category] || []).push(t); });

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-dark-50 mb-3 tracking-tight">
          <span className="text-brand-400">Dev</span>ToolKit
        </h1>
        <p className="text-lg text-dark-400 max-w-lg mx-auto leading-relaxed">
          Free online tools for developers. No sign-up, no tracking — everything runs in your browser.
        </p>
      </div>

      {/* Popular Tools — large cards */}
      <div className="mb-10">
        <h2 className="text-xs font-bold text-dark-500 uppercase tracking-widest mb-4 pb-2 border-b border-dark-700">
          🔥 Popular Tools
        </h2>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map(tool => (
            <Link
              key={tool.id}
              href={`/${tool.id}/`}
              className="bg-dark-800 border border-dark-700 rounded-xl p-5 no-underline hover:border-brand-400/30 hover:bg-dark-800/80 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-mono text-brand-400 w-11 h-11 flex items-center justify-center bg-brand-400/10 rounded-lg flex-shrink-0 group-hover:bg-brand-400/15 transition-colors">
                  {tool.icon}
                </span>
                <div className="text-base font-semibold text-dark-100">{tool.name}</div>
              </div>
              <div className="text-xs text-dark-400 leading-relaxed">{tool.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      <AdBanner slot="HOME_TOP" className="mb-8" />

      {/* Blog / Guides */}
      <div className="mb-10">
        <h2 className="text-xs font-bold text-dark-500 uppercase tracking-widest mb-4 pb-2 border-b border-dark-700">
          📖 Guides & Tutorials
        </h2>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          {BLOG_POSTS.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}/`}
              className="bg-dark-800 border border-dark-700 rounded-xl p-4 no-underline hover:border-brand-400/30 transition-all group"
            >
              <span className="text-[10px] font-semibold text-brand-400 bg-brand-400/10 px-2 py-0.5 rounded-full uppercase tracking-wider">{post.tag}</span>
              <div className="text-sm font-semibold text-dark-100 mt-2 mb-1 group-hover:text-dark-50 transition-colors">{post.title}</div>
              <div className="text-xs text-dark-400">{post.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* All Other Tools by Category */}
      {Object.entries(categories).map(([cat, tools]) => (
        <div key={cat} className="mb-8">
          <h2 className="text-xs font-bold text-dark-500 uppercase tracking-widest mb-4 pb-2 border-b border-dark-700">{cat}</h2>
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {tools.map(tool => (
              <Link
                key={tool.id}
                href={`/${tool.id}/`}
                className="bg-dark-800 border border-dark-700 rounded-xl p-4 flex items-center gap-3.5 no-underline hover:border-brand-400/30 hover:bg-dark-800/80 transition-all group"
              >
                <span className="text-xl font-mono text-brand-400 w-10 h-10 flex items-center justify-center bg-brand-400/10 rounded-lg flex-shrink-0 group-hover:bg-brand-400/15 transition-colors">
                  {tool.icon}
                </span>
                <div>
                  <div className="text-sm font-semibold text-dark-100">{tool.name}</div>
                  <div className="text-xs text-dark-400 mt-0.5">{tool.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      <AdBanner slot="HOME_BOTTOM" className="mt-8 mb-8" />

      {/* SEO Content Block */}
      <section className="mt-12 border-t border-dark-700 pt-8">
        <h2 className="text-lg font-bold text-dark-200 mb-4">Why DevToolKit?</h2>
        <div className="text-sm text-dark-400 leading-relaxed space-y-3 max-w-2xl">
          <p>
            DevToolKit provides a collection of free, browser-based developer utilities. Every tool runs entirely
            in your browser — no data is sent to any server, ever. Your code, tokens, and data stay private.
          </p>
          <p>
            Whether you need to format JSON, decode a JWT token, generate a PostgreSQL config, build an Nginx
            configuration, create a GitLab CI pipeline, or test regular expressions — DevToolKit has you covered.
          </p>
          <p>
            Built by developers, for developers. No sign-up required. No tracking. No ads interrupting your workflow.
            Bookmark it and use it every day.
          </p>
        </div>

        <h2 className="text-lg font-bold text-dark-200 mb-4 mt-8">Guides</h2>
        <div className="text-sm text-dark-400 leading-relaxed space-y-2">
          <p><a href="/blog/postgresql-tuning-guide/" className="text-brand-400 hover:underline font-medium">PostgreSQL Performance Tuning Guide 2026</a> — Complete configuration reference with formulas, recommended values by server size, and best practices for shared_buffers, work_mem, and effective_cache_size.</p>
          <p><a href="/blog/nginx-configuration-guide/" className="text-brand-400 hover:underline font-medium">Nginx Configuration Guide for Developers</a> — How to set up Nginx as a reverse proxy, configure SSL with Let&apos;s Encrypt, enable gzip, add security headers, and set up load balancing.</p>
          <p><a href="/blog/gitlab-ci-cd-guide/" className="text-brand-400 hover:underline font-medium">GitLab CI/CD Pipeline Guide 2026</a> — Build production-ready .gitlab-ci.yml pipelines with lint, test, build, and deploy stages for any language and deployment target.</p>
        </div>

        <h2 className="text-lg font-bold text-dark-200 mb-4 mt-8">Available Tools</h2>
        <div className="text-sm text-dark-400 leading-relaxed space-y-2">
          <p><strong className="text-dark-200">JSON Formatter & Validator</strong> — Format, beautify, minify, and validate JSON data online with customizable indentation.</p>
          <p><strong className="text-dark-200">YAML ↔ JSON Converter</strong> — Convert between YAML and JSON formats instantly. Supports nested objects, arrays, and comments.</p>
          <p><strong className="text-dark-200">Base64 Encoder/Decoder</strong> — Encode text to Base64 or decode Base64 strings. Full UTF-8 support.</p>
          <p><strong className="text-dark-200">JWT Decoder</strong> — Decode and inspect JSON Web Tokens. View header, payload, and expiration info without any server.</p>
          <p><strong className="text-dark-200">URL Encoder/Decoder</strong> — Encode or decode URL components and query parameters with Unicode support.</p>
          <p><strong className="text-dark-200">Hash Generator</strong> — Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text using the Web Crypto API.</p>
          <p><strong className="text-dark-200">UUID Generator</strong> — Generate random UUID v4 identifiers in multiple formats.</p>
          <p><strong className="text-dark-200">Regex Tester</strong> — Test regular expressions in real-time with match highlighting and group extraction.</p>
          <p><strong className="text-dark-200">Unix Timestamp Converter</strong> — Convert Unix timestamps to human-readable dates and back.</p>
          <p><strong className="text-dark-200">Color Converter</strong> — Convert between HEX, RGB, and HSL color formats with a live preview.</p>
          <p><strong className="text-dark-200">Lorem Ipsum Generator</strong> — Generate placeholder text for your designs.</p>
          <p><strong className="text-dark-200">Text Diff Checker</strong> — Compare two texts side by side with highlighted differences.</p>
          <p><strong className="text-dark-200">Password Generator</strong> — Generate strong random passwords with customizable complexity.</p>
          <p><strong className="text-dark-200">QR Code Generator</strong> — Create QR codes for URLs, text, Wi-Fi, email. Download as PNG or SVG.</p>
          <p><strong className="text-dark-200">SQL Formatter</strong> — Format and beautify SQL queries. Supports MySQL, PostgreSQL, SQLite, BigQuery, and more.</p>
          <p><strong className="text-dark-200">Cron Expression Parser</strong> — Parse and generate cron expressions with human-readable descriptions and next execution times.</p>
          <p><strong className="text-dark-200">PostgreSQL Config Generator</strong> — Generate optimized postgresql.conf based on your hardware. Free PGTune alternative.</p>
          <p><strong className="text-dark-200">JSON Tree Viewer</strong> — Visualize JSON as an interactive collapsible tree with node path copying.</p>
          <p><strong className="text-dark-200">HTTP Status Codes</strong> — Look up any HTTP status code with explanations, causes, and fixes.</p>
          <p><strong className="text-dark-200">GitLab CI/CD Generator</strong> — Build .gitlab-ci.yml pipelines visually for any language and deployment target.</p>
          <p><strong className="text-dark-200">Nginx Config Generator</strong> — Build nginx.conf for reverse proxy, static sites, PHP-FPM, and load balancing with SSL and security headers.</p>
        </div>
      </section>
    </div>
  );
}
