'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TOOLS } from './tools-data';

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const filtered = TOOLS.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  // Close mobile sidebar on navigation
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Close on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3 left-3 z-50 w-10 h-10 rounded-lg bg-dark-800 border border-dark-700 text-dark-200 flex items-center justify-center"
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`flex flex-col flex-shrink-0 border-r border-dark-700 bg-dark-900 transition-all duration-300 relative
          ${mobileOpen ? 'fixed inset-y-0 left-0 z-50 w-[260px]' : 'hidden md:flex'}
        `}
        style={!mobileOpen ? { width: open ? 250 : 56 } : undefined}
      >
        {/* Logo */}
        <div className="flex items-center justify-between" style={{ padding: open || mobileOpen ? '18px 18px 14px' : '18px 12px 14px' }}>
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-dark-950 text-base flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #0891b2, #22d3ee)' }}>D</div>
            {(open || mobileOpen) && <span className="font-bold text-base text-dark-50 whitespace-nowrap"><span className="text-brand-400">Dev</span>ToolKit</span>}
          </Link>
          {mobileOpen && (
            <button onClick={() => setMobileOpen(false)} className="text-dark-400 text-lg px-2">✕</button>
          )}
        </div>

        {/* Toggle (desktop only) */}
        <button
          onClick={() => setOpen(!open)}
          className="hidden md:flex absolute top-5 -right-3 w-6 h-6 rounded-full bg-dark-700 border border-dark-600 text-dark-300 text-xs items-center justify-center cursor-pointer z-10 hover:bg-dark-600"
        >
          {open ? '◀' : '▶'}
        </button>

        {/* Search */}
        {(open || mobileOpen) && (
          <div className="px-3.5 pb-3">
            <input
              placeholder="Search tools..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-dark-950 border border-dark-700 rounded-lg px-2.5 py-1.5 text-xs text-dark-100 font-mono outline-none"
            />
          </div>
        )}

        {/* Tools */}
        <nav className="flex-1 overflow-auto" style={{ padding: (open || mobileOpen) ? '0 8px' : '0 6px' }}>
          {filtered.map(tool => {
            const isActive = pathname === `/${tool.id}/` || pathname === `/${tool.id}`;
            return (
              <Link
                key={tool.id}
                href={`/${tool.id}/`}
                className={`flex items-center gap-2.5 w-full rounded-lg cursor-pointer transition-all mb-0.5 no-underline ${
                  isActive ? 'bg-brand-400/10 border border-brand-400/15' : 'border border-transparent hover:bg-dark-800'
                }`}
                style={{ padding: (open || mobileOpen) ? '9px 12px' : '9px 10px' }}
              >
                <span className={`text-sm font-mono w-7 text-center flex-shrink-0 ${isActive ? 'text-brand-400' : 'text-dark-400'}`}>{tool.icon}</span>
                {(open || mobileOpen) && <span className={`text-[13px] whitespace-nowrap ${isActive ? 'text-dark-100 font-semibold' : 'text-dark-300'}`}>{tool.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {(open || mobileOpen) && (
          <div className="p-4 border-t border-dark-700 text-[11px] text-dark-600 leading-relaxed">
            <div className="flex gap-3 mb-2">
              <Link href="/blog/" className="text-dark-400 hover:text-dark-200 no-underline">Blog</Link>
              <Link href="/about/" className="text-dark-400 hover:text-dark-200 no-underline">About</Link>
              <Link href="/privacy/" className="text-dark-400 hover:text-dark-200 no-underline">Privacy</Link>
            </div>
            100% free & open source<br />All tools run in your browser
          </div>
        )}
      </aside>
    </>
  );
}
