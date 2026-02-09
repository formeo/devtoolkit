export const metadata = {
  title: 'About DevToolKit',
  description: 'About DevToolKit — free, open-source, browser-based developer tools.',
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-dark-50 mb-6">About DevToolKit</h1>
      <div className="text-sm text-dark-300 leading-relaxed space-y-4">
        <p>DevToolKit is a collection of free, browser-based developer utilities built by developers, for developers.</p>
        
        <h2 className="text-lg font-semibold text-dark-100 pt-4">Our Mission</h2>
        <p>We believe developer tools should be free, fast, and private. Every tool on DevToolKit runs entirely in your browser — your data never touches our servers. No sign-up, no tracking, no data collection.</p>
        
        <h2 className="text-lg font-semibold text-dark-100 pt-4">What We Offer</h2>
        <p>A growing collection of essential developer utilities including JSON formatting, Base64 encoding, JWT decoding, UUID generation, regex testing, timestamp conversion, hash generation, color conversion, text diffing, and more. New tools are added regularly.</p>
        
        <h2 className="text-lg font-semibold text-dark-100 pt-4">Technology</h2>
        <p>Built with Next.js, React, and Tailwind CSS. Static site generation ensures maximum performance and zero server costs. All processing happens client-side using modern browser APIs like Web Crypto for hash generation and crypto.randomUUID for UUID generation.</p>
        
        <h2 className="text-lg font-semibold text-dark-100 pt-4">Open Source</h2>
        <p>DevToolKit is open source. You can view the code, suggest improvements, or contribute new tools on our <a href="https://github.com" className="text-brand-400 hover:underline" target="_blank" rel="noopener noreferrer">GitHub repository</a>.</p>
        
        <h2 className="text-lg font-semibold text-dark-100 pt-4">Support</h2>
        <p>If you find DevToolKit useful, you can support us by sharing it with fellow developers, contributing to the codebase, or disabling your ad blocker on our site.</p>
      </div>
    </div>
  );
}
