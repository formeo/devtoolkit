'use client';
import { useState, useCallback, useEffect } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { btnPrimary, btnSecondary, labelClass } from '../../components/styles';

const CHARSETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function getStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  if (score <= 2) return { label: 'Weak', color: '#ef4444', pct: 25 };
  if (score <= 3) return { label: 'Fair', color: '#f97316', pct: 50 };
  if (score <= 4) return { label: 'Good', color: '#eab308', pct: 75 };
  return { label: 'Strong', color: '#22c55e', pct: 100 };
}

export default function Client() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: true });
  const [count, setCount] = useState(5);
  const [passwords, setPasswords] = useState([]);
  const [copied, setCopied] = useState(null);

  const generate = useCallback(() => {
    let charset = '';
    Object.entries(options).forEach(([key, enabled]) => { if (enabled) charset += CHARSETS[key]; });
    if (!charset) { charset = CHARSETS.lowercase; }

    const arr = new Uint32Array(length * count);
    crypto.getRandomValues(arr);

    const results = [];
    for (let p = 0; p < count; p++) {
      let pw = '';
      for (let i = 0; i < length; i++) {
        pw += charset[arr[p * length + i] % charset.length];
      }
      results.push(pw);
    }
    setPasswords(results);
    setCopied(null);
  }, [length, options, count]);

  useEffect(() => { generate(); }, []);

  const copy = (pw, idx) => {
    navigator.clipboard?.writeText(pw);
    setCopied(idx);
    setTimeout(() => setCopied(null), 1500);
  };

  const copyAll = () => {
    navigator.clipboard?.writeText(passwords.join('\n'));
    setCopied('all');
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <ToolLayout title="Password Generator" description="Generate strong, secure random passwords. Customize length, characters, and complexity. Uses crypto.getRandomValues() for true randomness.">
      {/* Controls */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 p-5 mb-5">
        {/* Length slider */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className={labelClass}>Length</label>
            <span className="text-brand-400 font-mono text-lg font-bold">{length}</span>
          </div>
          <input
            type="range" min={4} max={128} value={length}
            onChange={e => setLength(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #0891b2 ${(length - 4) / 124 * 100}%, #1e293b ${(length - 4) / 124 * 100}%)` }}
          />
          <div className="flex justify-between text-[11px] text-dark-500 mt-1">
            <span>4</span><span>32</span><span>64</span><span>128</span>
          </div>
        </div>

        {/* Character options */}
        <div className="flex gap-4 flex-wrap mb-4">
          {Object.entries({ uppercase: 'A-Z', lowercase: 'a-z', numbers: '0-9', symbols: '!@#$' }).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={options[key]}
                onChange={e => setOptions(prev => ({ ...prev, [key]: e.target.checked }))}
                className="w-4 h-4 rounded accent-cyan-500"
              />
              <span className={`text-sm font-mono ${options[key] ? 'text-dark-100' : 'text-dark-500'}`}>{label}</span>
            </label>
          ))}
        </div>

        {/* Count + Generate */}
        <div className="flex gap-3 items-center flex-wrap">
          <label className="text-dark-300 text-[13px] flex items-center gap-2">
            Count:
            <select value={count} onChange={e => setCount(Number(e.target.value))}
              className="bg-dark-900 border border-dark-700 rounded-md px-2.5 py-1.5 text-dark-100 text-[13px] outline-none cursor-pointer">
              {[1, 3, 5, 10, 20].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <button onClick={generate} className={btnPrimary}>Generate</button>
          <button onClick={copyAll} className={btnSecondary}>
            {copied === 'all' ? '✓ Copied all' : 'Copy All'}
          </button>
        </div>
      </div>

      {/* Passwords */}
      <div className="space-y-2">
        {passwords.map((pw, i) => {
          const strength = getStrength(pw);
          return (
            <div key={i} className="bg-dark-900 rounded-lg border border-dark-700 p-3 flex items-center gap-3 group hover:border-dark-600 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="font-mono text-sm text-dark-100 break-all leading-relaxed tracking-wide">
                  {pw.split('').map((ch, j) => (
                    <span key={j} className={
                      /[A-Z]/.test(ch) ? 'text-cyan-400' :
                      /[0-9]/.test(ch) ? 'text-amber-400' :
                      /[^a-zA-Z0-9]/.test(ch) ? 'text-pink-400' : 'text-dark-200'
                    }>{ch}</span>
                  ))}
                </div>
                {/* Strength bar */}
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="h-1 flex-1 max-w-[120px] bg-dark-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${strength.pct}%`, background: strength.color }} />
                  </div>
                  <span className="text-[11px] font-medium" style={{ color: strength.color }}>{strength.label}</span>
                </div>
              </div>
              <button
                onClick={() => copy(pw, i)}
                className="flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium bg-dark-800 border border-dark-700 text-dark-300 hover:text-dark-100 hover:border-dark-600 transition-all"
              >
                {copied === i ? '✓' : 'Copy'}
              </button>
            </div>
          );
        })}
      </div>
    
      {/* SEO content */}
      <section className="mt-10 border-t border-dark-700 pt-6">
        <h2 className="text-base font-bold text-dark-200 mb-3">About Password Security</h2>
        <div className="text-xs text-dark-400 leading-relaxed space-y-2">
          <p>Strong passwords are the first line of defense against brute-force attacks and credential stuffing. A good password should be at least 16 characters long, contain uppercase and lowercase letters, numbers, and symbols, and never be reused across services.</p>
          <p>This generator uses crypto.getRandomValues() &mdash; the same cryptographic API used by password managers like 1Password and Bitwarden. Unlike Math.random(), it produces truly unpredictable values. All generation happens in your browser &mdash; no passwords are transmitted or stored anywhere.</p>
        </div>
      </section>
    </ToolLayout>
  );
}
