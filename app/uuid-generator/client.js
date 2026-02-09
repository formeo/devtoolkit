'use client';
import { useState, useCallback, useEffect } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { btnPrimary, selectClass, labelClass } from '../../components/styles';

export default function Client() {
  const [uuids, setUuids] = useState([]);
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState('default');

  const generate = useCallback(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      let uuid = crypto.randomUUID();
      if (format === 'upper') uuid = uuid.toUpperCase();
      else if (format === 'nodash') uuid = uuid.replace(/-/g, '');
      else if (format === 'braces') uuid = `{${uuid}}`;
      arr.push(uuid);
    }
    setUuids(arr);
  }, [count, format]);

  useEffect(() => { generate(); }, []);

  return (
    <ToolLayout title="UUID Generator" description="Generate random UUID v4 identifiers. Multiple formats supported.">
      <div className="flex gap-3 mb-4 flex-wrap items-center">
        <label className="text-dark-300 text-[13px] flex items-center gap-2">
          Count: <select value={count} onChange={e => setCount(Number(e.target.value))} className={selectClass}>
            {[1, 5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label className="text-dark-300 text-[13px] flex items-center gap-2">
          Format: <select value={format} onChange={e => setFormat(e.target.value)} className={selectClass}>
            <option value="default">lowercase</option>
            <option value="upper">UPPERCASE</option>
            <option value="nodash">No dashes</option>
            <option value="braces">{'{braces}'}</option>
          </select>
        </label>
        <button onClick={generate} className={btnPrimary}>Generate</button>
      </div>
      <div className="bg-dark-900 rounded-lg p-4 border border-dark-700">
        {uuids.map((uuid, i) => (
          <div key={i} className="font-mono text-sm text-dark-100 py-1.5 cursor-pointer hover:text-brand-400 transition-colors border-b border-dark-700 last:border-b-0"
            onClick={() => navigator.clipboard?.writeText(uuid)} title="Click to copy">
            {uuid}
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
