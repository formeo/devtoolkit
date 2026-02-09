'use client';
import { useState, useCallback, useEffect } from 'react';
import { format } from 'sql-formatter';
import ToolLayout from '../../components/ToolLayout';
import { textareaClass, btnPrimary, btnSecondary, labelClass, selectClass } from '../../components/styles';

const SAMPLE = `SELECT u.id, u.name, u.email, o.order_id, o.total, o.status FROM users u INNER JOIN orders o ON u.id = o.user_id LEFT JOIN payments p ON o.order_id = p.order_id WHERE u.created_at >= '2024-01-01' AND o.status IN ('completed', 'processing') AND p.amount > 100 GROUP BY u.id, u.name, u.email, o.order_id, o.total, o.status HAVING COUNT(o.order_id) > 3 ORDER BY o.total DESC LIMIT 50;`;

const DIALECTS = [
  { value: 'sql', label: 'Standard SQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'transactsql', label: 'SQL Server (T-SQL)' },
  { value: 'mariadb', label: 'MariaDB' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'plsql', label: 'Oracle PL/SQL' },
  { value: 'bigquery', label: 'BigQuery' },
];

export default function Client() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState('');
  const [dialect, setDialect] = useState('sql');
  const [indent, setIndent] = useState(2);
  const [uppercase, setUppercase] = useState(true);
  const [error, setError] = useState('');
  const [lineCount, setLineCount] = useState({ input: 0, output: 0 });

  const doFormat = useCallback(() => {
    try {
      const result = format(input, {
        language: dialect,
        tabWidth: indent,
        keywordCase: uppercase ? 'upper' : 'preserve',
        linesBetweenQueries: 2,
      });
      setOutput(result);
      setError('');
      setLineCount({
        input: input.split('\n').length,
        output: result.split('\n').length,
      });
    } catch (e) {
      setError(e.message);
      setOutput('');
    }
  }, [input, dialect, indent, uppercase]);

  const minify = useCallback(() => {
    const minified = input
      .replace(/\s+/g, ' ')
      .replace(/\s*([(),])\s*/g, '$1')
      .replace(/\s*=\s*/g, '=')
      .trim();
    setOutput(minified);
    setError('');
  }, [input]);

  useEffect(() => { doFormat(); }, []);

  const copy = () => {
    navigator.clipboard?.writeText(output);
  };

  return (
    <ToolLayout title="SQL Formatter" description="Format and beautify SQL queries online. Supports MySQL, PostgreSQL, SQL Server, Oracle, SQLite, BigQuery, and more.">
      {/* Controls */}
      <div className="flex gap-3 mb-4 flex-wrap items-center">
        <button onClick={doFormat} className={btnPrimary}>Format</button>
        <button onClick={minify} className={btnSecondary}>Minify</button>
        <button onClick={copy} className={btnSecondary}>Copy Output</button>

        <div className="flex gap-3 ml-auto flex-wrap items-center">
          <label className="text-dark-300 text-[13px] flex items-center gap-2">
            Dialect:
            <select value={dialect} onChange={e => setDialect(e.target.value)} className={selectClass}>
              {DIALECTS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </label>
          <label className="text-dark-300 text-[13px] flex items-center gap-2">
            Indent:
            <select value={indent} onChange={e => setIndent(Number(e.target.value))} className={selectClass}>
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
            </select>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)}
              className="w-4 h-4 rounded accent-cyan-500" />
            <span className="text-dark-300 text-[13px]">UPPERCASE keywords</span>
          </label>
        </div>
      </div>

      {error && <div className="text-red-400 mb-3 text-[13px]">⚠ {error}</div>}

      {/* Input / Output */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[300px]">
          <div className="flex justify-between items-center mb-1.5">
            <label className={labelClass}>Input SQL</label>
            <span className="text-[11px] text-dark-500">{lineCount.input} lines</span>
          </div>
          <textarea
            className={`${textareaClass} min-h-[350px]`}
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={16}
            spellCheck={false}
            placeholder="Paste your SQL query here..."
          />
        </div>
        <div className="flex-1 min-w-[300px]">
          <div className="flex justify-between items-center mb-1.5">
            <label className={labelClass}>Formatted Output</label>
            <span className="text-[11px] text-dark-500">{lineCount.output} lines</span>
          </div>
          <textarea
            className={`${textareaClass} min-h-[350px] text-emerald-300/90`}
            value={output}
            readOnly
            rows={16}
          />
        </div>
      </div>

      {/* SQL examples */}
      <div className="mt-6 border-t border-dark-700 pt-4">
        <label className={labelClass}>Quick Examples</label>
        <div className="flex gap-2 flex-wrap mt-2">
          {[
            { label: 'SELECT + JOIN', sql: SAMPLE },
            { label: 'CREATE TABLE', sql: `CREATE TABLE products (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, description TEXT, price DECIMAL(10,2) NOT NULL DEFAULT 0.00, category_id INTEGER REFERENCES categories(id), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, is_active BOOLEAN DEFAULT TRUE);` },
            { label: 'INSERT', sql: `INSERT INTO users (name, email, role, created_at) VALUES ('John Doe', 'john@example.com', 'admin', NOW()), ('Jane Smith', 'jane@example.com', 'user', NOW()), ('Bob Wilson', 'bob@example.com', 'user', NOW()) ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();` },
            { label: 'Subquery', sql: `SELECT department, avg_salary FROM (SELECT d.name AS department, AVG(e.salary) AS avg_salary FROM employees e JOIN departments d ON e.dept_id = d.id WHERE e.status = 'active' GROUP BY d.name) AS dept_stats WHERE avg_salary > (SELECT AVG(salary) FROM employees WHERE status = 'active') ORDER BY avg_salary DESC;` },
          ].map(ex => (
            <button key={ex.label} onClick={() => { setInput(ex.sql); }}
              className="text-xs px-3 py-1.5 rounded-md bg-dark-800 border border-dark-700 text-dark-300 hover:text-dark-100 hover:border-dark-600 transition-all cursor-pointer">
              {ex.label}
            </button>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
