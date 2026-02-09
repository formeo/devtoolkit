'use client';
import { useState, useEffect } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { textareaClass, inputClass, labelClass } from '../../components/styles';

export default function Client() {
  const [pattern, setPattern] = useState('(\\w+)@(\\w+\\.\\w+)');
  const [flags, setFlags] = useState('gi');
  const [text, setText] = useState('Contact us at dev@example.com or support@devtoolkit.io for help.\nAlso: admin@server.net works too.');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const regex = new RegExp(pattern, flags);
      const found = [];
      let match;
      if (flags.includes('g')) {
        while ((match = regex.exec(text)) !== null) {
          found.push({ full: match[0], groups: match.slice(1), index: match.index });
          if (!match[0]) break;
        }
      } else {
        match = regex.exec(text);
        if (match) found.push({ full: match[0], groups: match.slice(1), index: match.index });
      }
      setMatches(found);
      setError('');
    } catch (e) { setError(e.message); setMatches([]); }
  }, [pattern, flags, text]);

  return (
    <ToolLayout title="Regex Tester" description="Test regular expressions in real-time with match highlighting and group extraction.">
      <div className="flex gap-3 mb-4 flex-wrap items-center">
        <div className="flex-1 min-w-[200px]">
          <label className={labelClass}>Pattern</label>
          <input className={inputClass} value={pattern} onChange={e => setPattern(e.target.value)} spellCheck={false} />
        </div>
        <div className="w-24">
          <label className={labelClass}>Flags</label>
          <input className={inputClass} value={flags} onChange={e => setFlags(e.target.value)} />
        </div>
      </div>
      {error && <div className="text-red-400 mb-3 text-[13px]">⚠ {error}</div>}
      <label className={labelClass}>Test String</label>
      <textarea className={`${textareaClass} mb-4`} value={text} onChange={e => setText(e.target.value)} rows={5} />
      <label className={labelClass}>Matches ({matches.length})</label>
      <div className="bg-dark-900 rounded-lg p-4 border border-dark-700 max-h-[200px] overflow-auto">
        {matches.length === 0 ? (
          <div className="text-dark-500 text-[13px] italic">No matches found</div>
        ) : matches.map((m, i) => (
          <div key={i} className="py-1.5 border-b border-dark-700 last:border-b-0 text-[13px]">
            <span className="text-cyan-400 font-mono">{m.full}</span>
            <span className="text-dark-500 ml-2">@{m.index}</span>
            {m.groups.length > 0 && (
              <span className="text-dark-300 ml-2">
                groups: {m.groups.map((g, j) => <span key={j} className="text-purple-400 mr-1.5">${j + 1}=&quot;{g}&quot;</span>)}
              </span>
            )}
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
