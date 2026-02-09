'use client';
import AdBanner from './AdBanner';

export default function ToolLayout({ title, description, children }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-dark-50 mb-1.5">{title}</h1>
      <p className="text-sm text-dark-400 mb-6 leading-relaxed">{description}</p>
      <AdBanner slot="TOP_BANNER" className="mb-6" />
      {children}
      <AdBanner slot="BOTTOM_BANNER" className="mt-6" />
    </div>
  );
}
