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
    
      {/* SEO content */}
      <section className="mt-10 border-t border-dark-700 pt-6">
        <h2 className="text-base font-bold text-dark-200 mb-3">Online JSON Formatter, Validator & Beautifier</h2>
        <div className="text-xs text-dark-400 leading-relaxed space-y-2">
          <p>JSON (JavaScript Object Notation) is the most widely used data interchange format for web APIs, configuration files, databases, and data pipelines. This free online JSON formatter validates syntax, highlights errors with precise line numbers, and lets you beautify minified JSON with customizable indentation.</p>

          <h3 className="text-sm font-semibold text-dark-300 mt-4 mb-2">When to Use a JSON Formatter</h3>
          <p><strong className="text-dark-300">Debugging API responses</strong> — paste raw output from curl, Postman, or browser DevTools to see the data structure clearly. <strong className="text-dark-300">Editing config files</strong> — format package.json, tsconfig.json, .eslintrc for readability. <strong className="text-dark-300">Validating webhooks</strong> — check that incoming JSON from Stripe, GitHub, or Slack is well-formed. <strong className="text-dark-300">Working with databases</strong> — format MongoDB documents, Elasticsearch queries, or DynamoDB items.</p>

          <h3 className="text-sm font-semibold text-dark-300 mt-4 mb-2">Common JSON Syntax Errors</h3>
          <p>The most frequent JSON errors: <strong className="text-dark-300">trailing commas</strong> after the last item (valid in JS, invalid in JSON), <strong className="text-dark-300">single quotes</strong> instead of double quotes, <strong className="text-dark-300">unquoted keys</strong> (all keys must be double-quoted strings), <strong className="text-dark-300">comments</strong> (JSON doesn&apos;t support // or /* */), and <strong className="text-dark-300">undefined/NaN values</strong> (use null instead). This formatter identifies these errors instantly with clear messages.</p>

          <h3 className="text-sm font-semibold text-dark-300 mt-4 mb-2">JSON Format vs Minify</h3>
          <p>Formatted JSON uses indentation and line breaks for readability — essential during development. Minified JSON removes all whitespace to reduce size — important for API responses and network transfer. This tool supports both: paste minified JSON to beautify it, or click &quot;Minify&quot; to compress. A typical API response shrinks 30–50% when minified.</p>

          <p>All processing runs locally in your browser using JavaScript&apos;s native <code className="text-dark-300">JSON.parse()</code> and <code className="text-dark-300">JSON.stringify()</code>. No data is ever sent to a server.</p>
        </div>
      </section>
    </ToolLayout>
  );
}
