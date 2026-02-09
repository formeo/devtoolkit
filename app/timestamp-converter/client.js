'use client';
import { useState, useEffect } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { textareaClass, inputClass, labelClass } from '../../components/styles';

export default function Client() {
  const [ts, setTs] = useState(Math.floor(Date.now() / 1000).toString());
  const [dateStr, setDateStr] = useState('');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const num = Number(ts);
    if (!isNaN(num) && ts.trim()) {
      const ms = ts.length > 12 ? num : num * 1000;
      const d = new Date(ms);
      if (!isNaN(d.getTime())) {
        setDateStr(d.toISOString() + '\n' + d.toUTCString() + '\n' + d.toLocaleString());
      } else setDateStr('Invalid timestamp');
    }
  }, [ts]);

  return (
    <ToolLayout title="Unix Timestamp Converter" description="Convert Unix timestamps to human-readable dates and back. Live clock included.">
      <div className="bg-dark-900 rounded-lg p-4 border border-dark-700 mb-5 flex gap-6 flex-wrap">
        <div>
          <div className="text-[11px] text-dark-400 font-semibold tracking-wider">CURRENT TIME (SECONDS)</div>
          <div className="font-mono text-xl text-cyan-400 cursor-pointer hover:text-cyan-300"
            onClick={() => { setTs(Math.floor(now / 1000).toString()); navigator.clipboard?.writeText(Math.floor(now / 1000).toString()); }}>
            {Math.floor(now / 1000)}
          </div>
        </div>
        <div>
          <div className="text-[11px] text-dark-400 font-semibold tracking-wider">MILLISECONDS</div>
          <div className="font-mono text-xl text-purple-400 cursor-pointer hover:text-purple-300"
            onClick={() => { setTs(now.toString()); navigator.clipboard?.writeText(now.toString()); }}>
            {now}
          </div>
        </div>
      </div>
      <label className={labelClass}>Timestamp (seconds or milliseconds)</label>
      <input className={`${inputClass} mb-4`} value={ts} onChange={e => setTs(e.target.value)} placeholder="1234567890" />
      <label className={labelClass}>Converted Date</label>
      <textarea className={textareaClass} value={dateStr} readOnly rows={4} />
    </ToolLayout>
  );
}
