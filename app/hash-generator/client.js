'use client';
import { useState, useEffect } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { textareaClass, labelClass } from '../../components/styles';

export default function Client() {
  const [input, setInput] = useState('Hello, World!');
  const [hashes, setHashes] = useState({});

  useEffect(() => {
    (async () => {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const results = {};
      for (const algo of ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']) {
        const hash = await crypto.subtle.digest(algo, data);
        results[algo] = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
      }
      setHashes(results);
    })();
  }, [input]);

  return (
    <ToolLayout title="Hash Generator" description="Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes of any text instantly.">
      <label className={labelClass}>Input Text</label>
      <textarea className={`${textareaClass} mb-5`} value={input} onChange={e => setInput(e.target.value)} rows={4} />
      <div className="flex flex-col gap-3">
        {Object.entries(hashes).map(([algo, hash]) => (
          <div key={algo} className="bg-dark-900 rounded-lg px-4 py-3 border border-dark-700">
            <div className="text-[11px] text-dark-400 mb-1 font-semibold tracking-wider">{algo}</div>
            <div className="font-mono text-[13px] text-dark-100 break-all cursor-pointer hover:text-brand-400 transition-colors"
              onClick={() => navigator.clipboard?.writeText(hash)} title="Click to copy">
              {hash}
            </div>
          </div>
        ))}
      </div>
    
      {/* SEO content */}
      <section className="mt-10 border-t border-dark-700 pt-6">
        <h2 className="text-base font-bold text-dark-200 mb-3">About Cryptographic Hashing</h2>
        <div className="text-xs text-dark-400 leading-relaxed space-y-2">
          <p>Cryptographic hash functions produce a fixed-size digest from any input. SHA-256 is used in Bitcoin, TLS certificates, and file integrity checks. SHA-1, while deprecated for security, is still used in git commits. SHA-512 offers higher security for password hashing and digital signatures.</p>
          <p>This tool uses the Web Crypto API built into your browser &mdash; the most secure way to generate hashes client-side. No data leaves your machine. Useful for verifying file checksums, generating content fingerprints, and testing hash-based authentication flows.</p>
        </div>
      </section>
    </ToolLayout>
  );
}
