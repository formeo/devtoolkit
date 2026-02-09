'use client';
import { useState, useEffect } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { textareaClass, labelClass } from '../../components/styles';

export default function Client() {
  const [input, setInput] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MTYyMzkwMjIsInJvbGUiOiJhZG1pbiJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const parts = input.split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT: must have 3 parts');
      const h = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const p = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      setHeader(JSON.stringify(h, null, 2));
      setPayload(JSON.stringify(p, null, 2));
      setError('');
    } catch (e) { setError(e.message); setHeader(''); setPayload(''); }
  }, [input]);

  return (
    <ToolLayout title="JWT Decoder" description="Decode and inspect JWT tokens. View header, payload, and expiration info.">
      <label className={labelClass}>JWT Token</label>
      <textarea className={`${textareaClass} mb-4`} value={input} onChange={e => setInput(e.target.value)} rows={4} spellCheck={false} />
      {error && <div className="text-red-400 mb-3 text-[13px]">⚠ {error}</div>}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[280px]">
          <label className={labelClass}>Header <span className="text-red-400 font-normal text-[11px] normal-case">ALGORITHM & TOKEN TYPE</span></label>
          <textarea className={`${textareaClass} text-red-400`} value={header} readOnly rows={6} />
        </div>
        <div className="flex-1 min-w-[280px]">
          <label className={labelClass}>Payload <span className="text-purple-400 font-normal text-[11px] normal-case">DATA</span></label>
          <textarea className={`${textareaClass} text-purple-400`} value={payload} readOnly rows={6} />
        </div>
      </div>
    </ToolLayout>
  );
}
