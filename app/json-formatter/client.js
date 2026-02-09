'use client';
import { useState, useCallback, useEffect } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { textareaClass, btnPrimary, btnSecondary, labelClass, selectClass } from '../../components/styles';

export default function JSONFormatterClient() {
  const [input, setInput] = useState('{"name":"John","age":30,"hobbies":["coding","music"],"address":{"city":"Moscow","zip":"101000"}}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  const format = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError('');
    } catch (e) { setError(e.message); setOutput(''); }
  }, [input, indent]);

  const minify = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (e) { setError(e.message); setOutput(''); }
  }, [input]);

  useEffect(() => { format(); }, []);

  return (
    <ToolLayout title="JSON Formatter & Validator" description="Format, validate, and minify JSON data online. Paste your JSON and get instant results.">
      <div className="flex gap-3 mb-4 flex-wrap">
        <button onClick={format} className={btnPrimary}>Format</button>
        <button onClick={minify} className={btnSecondary}>Minify</button>
        <label className="flex items-center gap-2 text-dark-300 text-[13px]">
          Indent:
          <select value={indent} onChange={e => setIndent(Number(e.target.value))} className={selectClass}>
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </select>
        </label>
      </div>
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[280px]">
          <label className={labelClass}>Input JSON</label>
          <textarea className={textareaClass} value={input} onChange={e => setInput(e.target.value)} rows={14} spellCheck={false} />
        </div>
        <div className="flex-1 min-w-[280px]">
          <label className={labelClass}>Output {error && <span className="text-red-400 text-xs normal-case">⚠ {error}</span>}</label>
          <textarea className={`${textareaClass} ${error ? 'bg-red-950/20' : ''}`} value={output} readOnly rows={14} />
        </div>
      </div>
    </ToolLayout>
  );
}
