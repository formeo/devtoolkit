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
    </ToolLayout>
  );
}
