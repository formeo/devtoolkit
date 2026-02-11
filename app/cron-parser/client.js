'use client';
import { useState, useEffect, useCallback } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { inputClass, btnPrimary, btnSecondary, labelClass, selectClass } from '../../components/styles';

const PRESETS = [
  { label: 'Every minute', cron: '* * * * *' },
  { label: 'Every 5 minutes', cron: '*/5 * * * *' },
  { label: 'Every 15 minutes', cron: '*/15 * * * *' },
  { label: 'Every hour', cron: '0 * * * *' },
  { label: 'Every 6 hours', cron: '0 */6 * * *' },
  { label: 'Every day at midnight', cron: '0 0 * * *' },
  { label: 'Every day at noon', cron: '0 12 * * *' },
  { label: 'Every Monday at 9 AM', cron: '0 9 * * 1' },
  { label: 'Weekdays at 8 AM', cron: '0 8 * * 1-5' },
  { label: 'First of month at midnight', cron: '0 0 1 * *' },
  { label: 'Every Sunday at 2 AM', cron: '0 2 * * 0' },
  { label: 'Every quarter (Jan,Apr,Jul,Oct 1st)', cron: '0 0 1 1,4,7,10 *' },
];

const FIELD_NAMES = ['Minute', 'Hour', 'Day of Month', 'Month', 'Day of Week'];
const FIELD_RANGES = [
  { min: 0, max: 59, label: 'minute' },
  { min: 0, max: 23, label: 'hour' },
  { min: 1, max: 31, label: 'day' },
  { min: 1, max: 12, label: 'month' },
  { min: 0, max: 6, label: 'weekday' },
];

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function parseField(field, min, max) {
  const values = new Set();
  const parts = field.split(',');
  for (const part of parts) {
    if (part === '*') {
      for (let i = min; i <= max; i++) values.add(i);
    } else if (part.includes('/')) {
      const [range, stepStr] = part.split('/');
      const step = parseInt(stepStr);
      let start = min;
      let end = max;
      if (range !== '*') {
        if (range.includes('-')) {
          [start, end] = range.split('-').map(Number);
        } else {
          start = parseInt(range);
        }
      }
      for (let i = start; i <= end; i += step) values.add(i);
    } else if (part.includes('-')) {
      const [s, e] = part.split('-').map(Number);
      for (let i = s; i <= e; i++) values.add(i);
    } else {
      const v = parseInt(part);
      if (!isNaN(v)) values.add(v);
    }
  }
  return [...values].sort((a, b) => a - b);
}

function describeCron(expr) {
  const parts = expr.trim().split(/\s+/);
  if (parts.length < 5) return { error: 'Need at least 5 fields: minute hour day month weekday' };
  if (parts.length > 5) return { error: 'Only 5-field (standard) cron supported. Got ' + parts.length + ' fields.' };

  const [minute, hour, dom, month, dow] = parts;
  const desc = [];

  try {
    // Validate
    const fields = [
      { val: minute, ...FIELD_RANGES[0] },
      { val: hour, ...FIELD_RANGES[1] },
      { val: dom, ...FIELD_RANGES[2] },
      { val: month, ...FIELD_RANGES[3] },
      { val: dow, ...FIELD_RANGES[4] },
    ];

    const parsed = fields.map(f => parseField(f.val, f.min, f.max));

    // Build description
    // Minute
    if (minute === '*') desc.push('Every minute');
    else if (minute.startsWith('*/')) desc.push(`Every ${minute.slice(2)} minutes`);
    else if (minute.includes(',')) desc.push(`At minutes ${minute}`);
    else if (minute.includes('-')) desc.push(`Every minute from ${minute}`);
    else desc.push(`At minute ${minute}`);

    // Hour
    if (hour === '*') {
      if (minute !== '*' && !minute.startsWith('*/')) desc.push('of every hour');
    } else if (hour.startsWith('*/')) {
      desc.push(`every ${hour.slice(2)} hours`);
    } else if (hour.includes(',')) {
      desc.push(`at hours ${hour.split(',').map(h => h + ':00').join(', ')}`);
    } else if (hour.includes('-')) {
      const [s, e] = hour.split('-');
      desc.push(`between ${s}:00 and ${e}:00`);
    } else {
      // Replace "At minute X" with a time format
      const h = parseInt(hour);
      const m = minute === '*' ? 'xx' : minute.padStart ? minute.padStart(2, '0') : minute;
      if (!minute.startsWith('*/') && !minute.includes(',') && !minute.includes('-') && minute !== '*') {
        desc.length = 0;
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
        desc.push(`At ${h12}:${String(parseInt(minute)).padStart(2, '0')} ${ampm}`);
      } else {
        desc.push(`during hour ${hour}`);
      }
    }

    // Day of Month
    if (dom !== '*') {
      if (dom === '1' && month === '*') desc.push('on the 1st');
      else if (dom.includes(',')) desc.push(`on days ${dom} of the month`);
      else if (dom.includes('-')) desc.push(`on days ${dom} of the month`);
      else if (dom.startsWith('*/')) desc.push(`every ${dom.slice(2)} days`);
      else desc.push(`on day ${dom} of the month`);
    }

    // Month
    if (month !== '*') {
      if (month.includes(',')) {
        const names = month.split(',').map(m => MONTH_NAMES[parseInt(m)] || m).join(', ');
        desc.push(`in ${names}`);
      } else if (month.includes('-')) {
        const [s, e] = month.split('-').map(m => MONTH_NAMES[parseInt(m)] || m);
        desc.push(`from ${s} through ${e}`);
      } else {
        desc.push(`in ${MONTH_NAMES[parseInt(month)] || month}`);
      }
    }

    // Day of Week
    if (dow !== '*') {
      if (dow.includes(',')) {
        const names = dow.split(',').map(d => DAY_NAMES[parseInt(d)] || d).join(', ');
        desc.push(`on ${names}`);
      } else if (dow.includes('-')) {
        const [s, e] = dow.split('-').map(d => DAY_NAMES[parseInt(d)] || d);
        desc.push(`${s} through ${e}`);
      } else {
        desc.push(`on ${DAY_NAMES[parseInt(dow)] || dow}`);
      }
    }

    return { description: desc.join(' '), parsed, fields: parts };
  } catch (e) {
    return { error: 'Parse error: ' + e.message };
  }
}

function getNextRuns(expr, count = 10) {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return [];

  const [minute, hour, dom, month, dow] = parts;
  const mins = parseField(minute, 0, 59);
  const hours = parseField(hour, 0, 23);
  const doms = parseField(dom, 1, 31);
  const months = parseField(month, 1, 12);
  const dows = parseField(dow, 0, 6);

  const runs = [];
  const now = new Date();
  const d = new Date(now);
  d.setSeconds(0);
  d.setMilliseconds(0);
  d.setMinutes(d.getMinutes() + 1);

  const maxIter = 525960; // ~1 year of minutes
  for (let i = 0; i < maxIter && runs.length < count; i++) {
    if (
      months.includes(d.getMonth() + 1) &&
      doms.includes(d.getDate()) &&
      dows.includes(d.getDay()) &&
      hours.includes(d.getHours()) &&
      mins.includes(d.getMinutes())
    ) {
      runs.push(new Date(d));
    }
    d.setMinutes(d.getMinutes() + 1);
  }
  return runs;
}

export default function Client() {
  const [cron, setCron] = useState('0 9 * * 1-5');
  const [result, setResult] = useState(null);
  const [nextRuns, setNextRuns] = useState([]);
  const [activeField, setActiveField] = useState(-1);

  const parse = useCallback(() => {
    const r = describeCron(cron);
    setResult(r);
    if (!r.error) {
      setNextRuns(getNextRuns(cron, 10));
    } else {
      setNextRuns([]);
    }
  }, [cron]);

  useEffect(() => { parse(); }, [parse]);

  const fieldColors = [
    'text-blue-400', 'text-green-400', 'text-yellow-400', 'text-purple-400', 'text-pink-400'
  ];
  const fieldBgs = [
    'bg-blue-400/10', 'bg-green-400/10', 'bg-yellow-400/10', 'bg-purple-400/10', 'bg-pink-400/10'
  ];

  const cronFields = cron.trim().split(/\s+/);

  return (
    <ToolLayout title="Cron Expression Parser" description="Parse cron expressions into human-readable text, visualize schedules, and see upcoming run times.">
      {/* Input */}
      <div className="mb-4">
        <label className={labelClass}>Cron Expression</label>
        <input
          className={inputClass + ' text-lg font-mono tracking-widest'}
          value={cron}
          onChange={e => setCron(e.target.value)}
          placeholder="* * * * *"
          spellCheck={false}
        />
      </div>

      {/* Field labels with colors */}
      <div className="flex gap-1 mb-6 font-mono text-xs overflow-x-auto pb-1">
        {cronFields.slice(0, 5).map((f, i) => (
          <div
            key={i}
            className={`flex-1 min-w-[80px] text-center rounded-lg px-2 py-2 cursor-pointer transition-all ${
              activeField === i ? fieldBgs[i] + ' ring-1 ring-current' : 'bg-dark-800'
            } ${fieldColors[i]}`}
            onMouseEnter={() => setActiveField(i)}
            onMouseLeave={() => setActiveField(-1)}
          >
            <div className="font-bold text-sm">{f}</div>
            <div className="text-[10px] opacity-60 mt-0.5">{FIELD_NAMES[i]}</div>
            <div className="text-[10px] opacity-40">{FIELD_RANGES[i].min}-{FIELD_RANGES[i].max}</div>
          </div>
        ))}
      </div>

      {/* Result */}
      {result && (
        <div className={`rounded-xl p-4 mb-6 ${result.error ? 'bg-red-500/10 border border-red-500/20' : 'bg-brand-400/5 border border-brand-400/20'}`}>
          {result.error ? (
            <div className="text-red-400 text-sm">{result.error}</div>
          ) : (
            <div className="text-lg font-semibold text-dark-100">
              📅 {result.description}
            </div>
          )}
        </div>
      )}

      {/* Presets */}
      <div className="mb-6">
        <label className={labelClass}>Quick Presets</label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button
              key={p.cron}
              onClick={() => setCron(p.cron)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                cron === p.cron
                  ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
                  : 'bg-dark-800 text-dark-400 border border-dark-700 hover:text-dark-200 hover:border-dark-500'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Next runs */}
      {nextRuns.length > 0 && (
        <div className="mb-6">
          <label className={labelClass}>Next {nextRuns.length} Runs</label>
          <div className="bg-dark-900 border border-dark-700 rounded-xl overflow-hidden">
            {nextRuns.map((d, i) => {
              const now = new Date();
              const diff = d - now;
              const mins = Math.floor(diff / 60000);
              const hours = Math.floor(mins / 60);
              const days = Math.floor(hours / 24);
              let relative = '';
              if (days > 0) relative = `in ${days}d ${hours % 24}h`;
              else if (hours > 0) relative = `in ${hours}h ${mins % 60}m`;
              else relative = `in ${mins}m`;

              return (
                <div key={i} className={`flex items-center justify-between px-4 py-2.5 text-sm ${i % 2 === 0 ? 'bg-dark-900' : 'bg-dark-850'} ${i > 0 ? 'border-t border-dark-700/50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-dark-500 text-xs font-mono w-5">{i + 1}</span>
                    <span className="text-dark-200 font-mono">
                      {d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-brand-400 font-mono font-bold">
                      {d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                  </div>
                  <span className="text-dark-500 text-xs">{relative}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Field reference */}
      <details className="mb-6">
        <summary className="text-xs font-semibold text-dark-400 cursor-pointer hover:text-dark-200 transition-colors">
          📖 Cron Syntax Reference
        </summary>
        <div className="mt-3 bg-dark-900 border border-dark-700 rounded-xl p-4 text-xs text-dark-400">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div><code className="text-brand-400">*</code> — any value</div>
            <div><code className="text-brand-400">5</code> — exact value</div>
            <div><code className="text-brand-400">1-5</code> — range</div>
            <div><code className="text-brand-400">1,3,5</code> — list</div>
            <div><code className="text-brand-400">*/15</code> — every N</div>
            <div><code className="text-brand-400">1-5/2</code> — range + step</div>
          </div>
          <div className="mt-3 pt-3 border-t border-dark-700 font-mono text-[11px] leading-relaxed">
            ┌──────── minute (0-59)<br/>
            │ ┌────── hour (0-23)<br/>
            │ │ ┌──── day of month (1-31)<br/>
            │ │ │ ┌── month (1-12)<br/>
            │ │ │ │ ┌ day of week (0-6, Sun=0)<br/>
            * * * * *
          </div>
        </div>
      </details>

      {/* SEO content */}
      <section className="mt-10 border-t border-dark-700 pt-6">
        <h2 className="text-base font-bold text-dark-200 mb-3">About Cron Expressions</h2>
        <div className="text-xs text-dark-400 leading-relaxed space-y-2">
          <p>A cron expression is a string of five fields that defines a schedule for recurring tasks. Originally from Unix crontab, cron expressions are now used in Linux servers, CI/CD pipelines (GitHub Actions, GitLab CI, Jenkins), cloud services (AWS CloudWatch, Google Cloud Scheduler, Azure Functions), container orchestration (Kubernetes CronJobs), and application frameworks (Spring @Scheduled, Celery Beat, node-cron).</p>
          <p>This parser reads standard 5-field cron expressions, translates them to human-readable descriptions, and calculates the next execution times based on your local timezone. Use the presets for common patterns or type your own expression.</p>
          <p>All parsing happens locally in your browser — no data is sent to any server.</p>
        </div>
      </section>
    </ToolLayout>
  );
}
