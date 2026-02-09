'use client';
import { useState, useEffect } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { textareaClass, labelClass } from '../../components/styles';

export default function Client() {
  const [text1, setText1] = useState("function hello() {\n  console.log('Hello World');\n  return true;\n}\n\nconst x = 42;");
  const [text2, setText2] = useState("function hello() {\n  console.log('Hello DevToolKit!');\n  return false;\n}\n\nconst x = 42;\nconst y = 100;");
  const [diff, setDiff] = useState([]);

  useEffect(() => {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const maxLen = Math.max(lines1.length, lines2.length);
    const result = [];
    for (let i = 0; i < maxLen; i++) {
      const l1 = lines1[i] ?? '';
      const l2 = lines2[i] ?? '';
      if (l1 === l2) result.push({ type: 'same', line: l1, num: i + 1 });
      else {
        if (i < lines1.length) result.push({ type: 'removed', line: l1, num: i + 1 });
        if (i < lines2.length) result.push({ type: 'added', line: l2, num: i + 1 });
      }
    }
    setDiff(result);
  }, [text1, text2]);

  return (
    <ToolLayout title="Text Diff Checker" description="Compare two texts and see the differences highlighted line by line.">
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[280px]">
          <label className={labelClass}>Original</label>
          <textarea className={textareaClass} value={text1} onChange={e => setText1(e.target.value)} rows={8} spellCheck={false} />
        </div>
        <div className="flex-1 min-w-[280px]">
          <label className={labelClass}>Modified</label>
          <textarea className={textareaClass} value={text2} onChange={e => setText2(e.target.value)} rows={8} spellCheck={false} />
        </div>
      </div>
      <label className={`${labelClass} mt-4`}>Diff Result</label>
      <div className="bg-dark-900 rounded-lg p-3 border border-dark-700 font-mono text-[13px] max-h-[250px] overflow-auto">
        {diff.map((d, i) => (
          <div key={i} className="px-2 py-0.5" style={{
            background: d.type === 'added' ? 'rgba(34,197,94,0.1)' : d.type === 'removed' ? 'rgba(239,68,68,0.1)' : 'transparent',
            color: d.type === 'added' ? '#4ade80' : d.type === 'removed' ? '#f87171' : '#64748b',
            borderLeft: `3px solid ${d.type === 'added' ? '#22c55e' : d.type === 'removed' ? '#ef4444' : 'transparent'}`
          }}>
            <span className="opacity-50 mr-3 inline-block w-5 text-right">{d.num}</span>
            {d.type === 'added' ? '+' : d.type === 'removed' ? '-' : ' '} {d.line}
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
