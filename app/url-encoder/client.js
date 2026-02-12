'use client';
import { useState, useEffect } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { textareaClass, btnPrimary, btnSecondary, labelClass } from '../../components/styles';

export default function Client() {
  const [input, setInput] = useState('https://example.com/path?query=hello world&lang=ru&text=привет мир');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');

  useEffect(() => {
    try { setOutput(mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input)); }
    catch { setOutput('Error: Invalid input'); }
  }, [input, mode]);

  return (
    <ToolLayout title="URL Encoder / Decoder" description="Encode or decode URLs and query parameters. Supports Unicode characters.">
      <div className="flex gap-3 mb-4">
        <button onClick={() => setMode('encode')} className={mode === 'encode' ? btnPrimary : btnSecondary}>Encode</button>
        <button onClick={() => setMode('decode')} className={mode === 'decode' ? btnPrimary : btnSecondary}>Decode</button>
      </div>
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[280px]">
          <label className={labelClass}>Input</label>
          <textarea className={textareaClass} value={input} onChange={e => setInput(e.target.value)} rows={6} />
        </div>
        <div className="flex-1 min-w-[280px]">
          <label className={labelClass}>Output</label>
          <textarea className={textareaClass} value={output} readOnly rows={6} />
        </div>
      </div>
    
      {/* SEO content */}
      <section className="mt-10 border-t border-dark-700 pt-6">
        <h2 className="text-base font-bold text-dark-200 mb-3">About URL Encoding</h2>
        <div className="text-xs text-dark-400 leading-relaxed space-y-2">
          <p>URL encoding (percent-encoding) converts special characters into a format that can be safely transmitted in URLs. Characters like spaces, ampersands, and Unicode are replaced with %XX codes. This is required for query parameters, form data, API requests, and redirect URLs.</p>
          <p>This tool encodes and decodes URL components with full Unicode support, handling international characters, emoji, and special symbols. Essential for debugging query strings, building OAuth callbacks, testing webhook URLs, and working with REST APIs.</p>
        </div>
      </section>
    </ToolLayout>
  );
}
