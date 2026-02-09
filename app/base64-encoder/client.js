'use client';
import { useState, useEffect } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { textareaClass, btnPrimary, btnSecondary, labelClass } from '../../components/styles';

export default function Client() {
  const [input, setInput] = useState('Hello, Developer! This is a Base64 encoding test.');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');

  useEffect(() => {
    try {
      setOutput(mode === 'encode'
        ? btoa(unescape(encodeURIComponent(input)))
        : decodeURIComponent(escape(atob(input))));
    } catch { setOutput('Error: Invalid input'); }
  }, [input, mode]);

  return (
    <ToolLayout title="Base64 Encoder / Decoder" description="Encode text to Base64 or decode Base64 to text. Supports UTF-8 characters.">
      <div className="flex gap-3 mb-4">
        <button onClick={() => setMode('encode')} className={mode === 'encode' ? btnPrimary : btnSecondary}>Encode</button>
        <button onClick={() => setMode('decode')} className={mode === 'decode' ? btnPrimary : btnSecondary}>Decode</button>
      </div>
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[280px]">
          <label className={labelClass}>Input</label>
          <textarea className={textareaClass} value={input} onChange={e => setInput(e.target.value)} rows={10} />
        </div>
        <div className="flex-1 min-w-[280px]">
          <label className={labelClass}>Output</label>
          <textarea className={textareaClass} value={output} readOnly rows={10} />
        </div>
      </div>
    </ToolLayout>
  );
}
