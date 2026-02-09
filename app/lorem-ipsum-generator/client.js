'use client';
import { useState, useCallback, useEffect } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { textareaClass, btnPrimary, btnSecondary, selectClass, inputClass, labelClass } from '../../components/styles';

const words = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');

export default function Client() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState('paragraphs');
  const [output, setOutput] = useState('');

  const generate = useCallback(() => {
    const rw = () => words[Math.floor(Math.random() * words.length)];
    const rs = () => { const s = Array.from({ length: 8 + Math.floor(Math.random() * 15) }, rw).join(' '); return s.charAt(0).toUpperCase() + s.slice(1) + '.'; };
    const rp = () => Array.from({ length: 3 + Math.floor(Math.random() * 5) }, rs).join(' ');

    if (unit === 'words') setOutput(Array.from({ length: count }, rw).join(' '));
    else if (unit === 'sentences') setOutput(Array.from({ length: count }, rs).join(' '));
    else setOutput(Array.from({ length: count }, rp).join('\n\n'));
  }, [count, unit]);

  useEffect(() => { generate(); }, [count, unit]);

  return (
    <ToolLayout title="Lorem Ipsum Generator" description="Generate placeholder text for your designs and mockups.">
      <div className="flex gap-3 mb-4 flex-wrap items-center">
        <label className="text-dark-300 text-[13px] flex items-center gap-2">
          Count: <input type="number" min={1} max={100} value={count} onChange={e => setCount(Math.max(1, Number(e.target.value)))} className={`${inputClass} !w-[70px]`} />
        </label>
        <select value={unit} onChange={e => setUnit(e.target.value)} className={selectClass}>
          <option value="paragraphs">Paragraphs</option>
          <option value="sentences">Sentences</option>
          <option value="words">Words</option>
        </select>
        <button onClick={generate} className={btnPrimary}>Regenerate</button>
        <button onClick={() => navigator.clipboard?.writeText(output)} className={btnSecondary}>Copy</button>
      </div>
      <textarea className={textareaClass} value={output} readOnly rows={12} />
    </ToolLayout>
  );
}
