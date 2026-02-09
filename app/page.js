import Link from 'next/link';
import { TOOLS } from '../components/tools-data';
import AdBanner from '../components/AdBanner';

export default function HomePage() {
  const categories = {};
  TOOLS.forEach(t => { (categories[t.category] = categories[t.category] || []).push(t); });

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-dark-50 mb-3 tracking-tight">
          <span className="text-brand-400">Dev</span>ToolKit
        </h1>
        <p className="text-lg text-dark-400 max-w-lg mx-auto leading-relaxed">
          Free online tools for developers. No sign-up, no tracking — everything runs in your browser.
        </p>
      </div>

      <AdBanner slot="HOME_TOP" className="mb-8" />

      {/* Tool Grid by Category */}
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
            Whether you need to format JSON, decode a JWT token, generate UUIDs, test regular expressions,
            convert timestamps, or compare text — DevToolKit has you covered with instant, reliable tools.
          </p>
          <p>
            Built by developers, for developers. No sign-up required. No tracking. No ads interrupting your workflow.
            Bookmark it and use it every day.
          </p>
        </div>

        <h2 className="text-lg font-bold text-dark-200 mb-4 mt-8">Available Tools</h2>
        <div className="text-sm text-dark-400 leading-relaxed space-y-2">
          <p><strong className="text-dark-200">JSON Formatter & Validator</strong> — Format, beautify, minify, and validate JSON data online with customizable indentation.</p>
          <p><strong className="text-dark-200">YAML ↔ JSON Converter</strong> — Convert between YAML and JSON formats instantly. Supports nested objects, arrays, and comments.</p>
          <p><strong className="text-dark-200">Base64 Encoder/Decoder</strong> — Encode text to Base64 or decode Base64 strings. Full UTF-8 support.</p>
          <p><strong className="text-dark-200">JWT Decoder</strong> — Decode and inspect JSON Web Tokens. View header, payload, and expiration info without any server.</p>
          <p><strong className="text-dark-200">URL Encoder/Decoder</strong> — Encode or decode URL components and query parameters with Unicode support.</p>
          <p><strong className="text-dark-200">Hash Generator</strong> — Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text using the Web Crypto API.</p>
          <p><strong className="text-dark-200">UUID Generator</strong> — Generate random UUID v4 identifiers in multiple formats: lowercase, uppercase, no-dashes, and braces.</p>
          <p><strong className="text-dark-200">Regex Tester</strong> — Test regular expressions in real-time with match highlighting, group extraction, and flag support.</p>
          <p><strong className="text-dark-200">Unix Timestamp Converter</strong> — Convert Unix timestamps to human-readable dates and back. Includes a live clock.</p>
          <p><strong className="text-dark-200">Color Converter</strong> — Convert between HEX, RGB, and HSL color formats with a live color preview.</p>
          <p><strong className="text-dark-200">Lorem Ipsum Generator</strong> — Generate placeholder text in words, sentences, or paragraphs for your designs.</p>
          <p><strong className="text-dark-200">Text Diff Checker</strong> — Compare two texts side by side and see differences highlighted line by line.</p>
        </div>
      </section>
    </div>
  );
}
