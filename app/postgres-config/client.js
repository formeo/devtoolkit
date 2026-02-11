'use client';
import { useState, useMemo } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { btnPrimary, btnSecondary, labelClass, selectClass } from '../../components/styles';

const WORKLOADS = [
  { id: 'web', label: 'Web Application', desc: 'Many connections, simple queries, Django/Rails/Laravel' },
  { id: 'oltp', label: 'OLTP', desc: 'High transaction rate, point lookups' },
  { id: 'dw', label: 'Data Warehouse', desc: 'Complex queries, aggregations, fewer connections' },
  { id: 'mixed', label: 'Mixed', desc: 'Balanced workload' },
  { id: 'desktop', label: 'Desktop / Dev', desc: 'Single user, local development' },
];

const STORAGE_TYPES = [
  { id: 'ssd', label: 'SSD' },
  { id: 'hdd', label: 'HDD' },
  { id: 'san', label: 'SAN / Network Storage' },
];

const PG_VERSIONS = ['17', '16', '15', '14', '13'];

function generateConfig({ ram, cpus, storage, workload, connections, pgVersion }) {
  const ramMB = ram * 1024;
  const config = {};
  const notes = {};

  // max_connections
  const defaultConns = { web: 200, oltp: 300, dw: 40, mixed: 100, desktop: 20 };
  config.max_connections = connections || defaultConns[workload];
  notes.max_connections = `Typical for ${WORKLOADS.find(w => w.id === workload)?.label} workloads`;

  // shared_buffers: 25% of RAM, but cap at reasonable values
  let sharedBuf = Math.floor(ramMB / 4);
  if (workload === 'desktop') sharedBuf = Math.floor(ramMB / 16);
  if (sharedBuf > 16384) sharedBuf = Math.min(sharedBuf, Math.floor(ramMB * 0.4)); // allow up to 40% for large RAM
  config.shared_buffers = formatMem(sharedBuf);
  notes.shared_buffers = `${Math.round(sharedBuf / ramMB * 100)}% of RAM — primary PostgreSQL cache`;

  // effective_cache_size: 75% of RAM
  let effCache = Math.floor(ramMB * 0.75);
  if (workload === 'desktop') effCache = Math.floor(ramMB / 4);
  config.effective_cache_size = formatMem(effCache);
  notes.effective_cache_size = `Estimate of OS + PG cache available for queries`;

  // work_mem: (RAM - shared_buffers) / (max_connections * 3)
  let workMem = Math.floor((ramMB - sharedBuf) / (config.max_connections * 3));
  if (workload === 'dw') workMem = Math.floor((ramMB - sharedBuf) / (config.max_connections * 1));
  if (workload === 'desktop') workMem = Math.floor(ramMB / 16);
  workMem = Math.max(4, workMem); // minimum 4MB
  if (workMem >= 1024) workMem = Math.floor(workMem / 64) * 64; // round to 64MB
  config.work_mem = formatMem(workMem);
  notes.work_mem = `Per-operation memory for sorts and hash joins`;

  // maintenance_work_mem
  let maintMem = Math.floor(ramMB / 16);
  if (workload === 'dw') maintMem = Math.floor(ramMB / 8);
  maintMem = Math.min(maintMem, 2048); // cap 2GB
  maintMem = Math.max(64, maintMem);
  config.maintenance_work_mem = formatMem(maintMem);
  notes.maintenance_work_mem = `Memory for VACUUM, CREATE INDEX, ALTER TABLE`;

  // wal_buffers: 3% of shared_buffers, min 32KB, max 64MB
  let walBuf = Math.floor(sharedBuf * 0.03);
  walBuf = Math.max(1, Math.min(walBuf, 64));
  if (walBuf < 1) walBuf = -1; // use default
  config.wal_buffers = walBuf > 0 ? formatMem(walBuf) : '-1';
  notes.wal_buffers = `~3% of shared_buffers, capped at 64MB`;

  // checkpoint
  config.checkpoint_completion_target = '0.9';
  notes.checkpoint_completion_target = `Spread checkpoint writes over 90% of interval`;

  config.min_wal_size = workload === 'dw' ? '4GB' : '1GB';
  config.max_wal_size = workload === 'dw' ? '16GB' : '4GB';
  notes.min_wal_size = `Minimum WAL retained on disk`;
  notes.max_wal_size = `Triggers checkpoint when exceeded`;

  // Storage-specific
  if (storage === 'ssd') {
    config.random_page_cost = '1.1';
    config.effective_io_concurrency = '200';
    notes.random_page_cost = `Low value tells planner random I/O is cheap (SSD)`;
    notes.effective_io_concurrency = `SSD can handle many concurrent I/O requests`;
  } else if (storage === 'hdd') {
    config.random_page_cost = '4.0';
    config.effective_io_concurrency = '2';
    notes.random_page_cost = `Higher value because random I/O is expensive on HDD`;
    notes.effective_io_concurrency = `HDD handles very few concurrent requests`;
  } else {
    config.random_page_cost = '1.5';
    config.effective_io_concurrency = '100';
    notes.random_page_cost = `Moderate value for network storage`;
    notes.effective_io_concurrency = `SAN/network storage — moderate concurrency`;
  }

  // Parallel workers (PG 10+)
  if (cpus > 1) {
    config.max_worker_processes = Math.max(8, cpus);
    config.max_parallel_workers_per_gather = Math.min(4, Math.floor(cpus / 2));
    config.max_parallel_workers = Math.max(8, cpus);
    config.max_parallel_maintenance_workers = Math.min(4, Math.floor(cpus / 2));
    notes.max_worker_processes = `Background worker pool size`;
    notes.max_parallel_workers_per_gather = `Workers per parallel query node`;
    notes.max_parallel_workers = `Total parallel workers across all queries`;
    notes.max_parallel_maintenance_workers = `Workers for parallel CREATE INDEX, VACUUM`;

    if (workload === 'dw') {
      config.max_parallel_workers_per_gather = Math.min(8, cpus);
      config.max_parallel_maintenance_workers = Math.min(8, Math.floor(cpus / 2));
    } else if (workload === 'desktop') {
      config.max_parallel_workers_per_gather = Math.min(2, cpus);
    }
  }

  // huge_pages
  if (ramMB >= 32768) {
    config.huge_pages = 'try';
    notes.huge_pages = `Recommended for ${ram}GB+ RAM — reduces TLB misses`;
  }

  // logging
  config.log_min_duration_statement = workload === 'desktop' ? '100' : '1000';
  notes.log_min_duration_statement = `Log queries slower than ${config.log_min_duration_statement}ms`;

  return { config, notes };
}

function formatMem(mb) {
  if (mb >= 1024 && mb % 1024 === 0) return `${mb / 1024}GB`;
  return `${mb}MB`;
}

export default function Client() {
  const [ram, setRam] = useState(16);
  const [cpus, setCpus] = useState(4);
  const [storage, setStorage] = useState('ssd');
  const [workload, setWorkload] = useState('web');
  const [connections, setConnections] = useState(0); // 0 = auto
  const [pgVersion, setPgVersion] = useState('16');
  const [copied, setCopied] = useState(false);
  const [showNotes, setShowNotes] = useState(true);

  const { config, notes } = useMemo(
    () => generateConfig({ ram, cpus, storage, workload, connections, pgVersion }),
    [ram, cpus, storage, workload, connections, pgVersion]
  );

  const configText = useMemo(() => {
    const lines = ['# PostgreSQL Configuration', `# Generated for: ${ram}GB RAM, ${cpus} CPUs, ${storage.toUpperCase()}, ${WORKLOADS.find(w => w.id === workload)?.label}`, `# PostgreSQL ${pgVersion}`, `# Generated by DevToolKit — https://www.devtoolkit.site/postgres-config/`, ''];
    const sections = {
      'Memory': ['shared_buffers', 'effective_cache_size', 'work_mem', 'maintenance_work_mem', 'huge_pages'],
      'Connections': ['max_connections'],
      'WAL': ['wal_buffers', 'min_wal_size', 'max_wal_size', 'checkpoint_completion_target'],
      'Disk': ['random_page_cost', 'effective_io_concurrency'],
      'Parallelism': ['max_worker_processes', 'max_parallel_workers_per_gather', 'max_parallel_workers', 'max_parallel_maintenance_workers'],
      'Logging': ['log_min_duration_statement'],
    };

    for (const [section, keys] of Object.entries(sections)) {
      const available = keys.filter(k => config[k] !== undefined);
      if (available.length === 0) continue;
      lines.push(`# ${section}`);
      for (const key of available) {
        const comment = showNotes && notes[key] ? `  # ${notes[key]}` : '';
        lines.push(`${key} = ${config[key]}${comment}`);
      }
      lines.push('');
    }
    return lines.join('\n');
  }, [config, notes, ram, cpus, storage, workload, pgVersion, showNotes]);

  const copy = () => {
    navigator.clipboard.writeText(configText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const ramOptions = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512];
  const cpuOptions = [1, 2, 4, 8, 16, 32, 48, 64, 96, 128];

  return (
    <ToolLayout title="PostgreSQL Config Generator" description="Generate optimized postgresql.conf settings based on your server hardware and workload. Free PGTune alternative.">
      {/* Input panel */}
      <div className="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* RAM */}
        <div>
          <label className={labelClass}>RAM (GB)</label>
          <select className={selectClass + ' w-full'} value={ram} onChange={e => setRam(Number(e.target.value))}>
            {ramOptions.map(v => <option key={v} value={v}>{v} GB</option>)}
          </select>
        </div>

        {/* CPUs */}
        <div>
          <label className={labelClass}>CPU Cores</label>
          <select className={selectClass + ' w-full'} value={cpus} onChange={e => setCpus(Number(e.target.value))}>
            {cpuOptions.map(v => <option key={v} value={v}>{v} cores</option>)}
          </select>
        </div>

        {/* Storage */}
        <div>
          <label className={labelClass}>Storage Type</label>
          <select className={selectClass + ' w-full'} value={storage} onChange={e => setStorage(e.target.value)}>
            {STORAGE_TYPES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>

        {/* PG Version */}
        <div>
          <label className={labelClass}>PostgreSQL Version</label>
          <select className={selectClass + ' w-full'} value={pgVersion} onChange={e => setPgVersion(e.target.value)}>
            {PG_VERSIONS.map(v => <option key={v} value={v}>PostgreSQL {v}</option>)}
          </select>
        </div>

        {/* Workload */}
        <div className="sm:col-span-2 lg:col-span-2">
          <label className={labelClass}>Workload Type</label>
          <div className="flex flex-wrap gap-2">
            {WORKLOADS.map(w => (
              <button
                key={w.id}
                onClick={() => setWorkload(w.id)}
                className={`text-xs px-3 py-2 rounded-lg transition-all ${
                  workload === w.id
                    ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
                    : 'bg-dark-800 text-dark-400 border border-dark-700 hover:text-dark-200'
                }`}
                title={w.desc}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Max connections override */}
      <div className="mb-6 flex items-center gap-4">
        <label className={labelClass + ' mb-0 whitespace-nowrap'}>Max Connections</label>
        <input
          type="number"
          className={selectClass + ' w-24'}
          value={connections || ''}
          onChange={e => setConnections(Number(e.target.value) || 0)}
          placeholder="auto"
          min={1}
          max={10000}
        />
        <span className="text-xs text-dark-500">
          {connections ? '' : `Auto: ${config.max_connections} for ${WORKLOADS.find(w => w.id === workload)?.label}`}
        </span>
      </div>

      {/* Config Output */}
      <div className="mb-4 flex items-center justify-between">
        <label className={labelClass + ' mb-0'}>Generated Configuration</label>
        <div className="flex gap-2 items-center">
          <label className="flex items-center gap-1.5 text-xs text-dark-400 cursor-pointer">
            <input type="checkbox" checked={showNotes} onChange={e => setShowNotes(e.target.checked)} className="accent-brand-500" />
            Comments
          </label>
          <button onClick={copy} className={`${btnPrimary} text-xs`}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <pre className="bg-dark-900 border border-dark-700 rounded-xl p-4 font-mono text-[12px] text-dark-200 overflow-x-auto leading-relaxed whitespace-pre max-h-[500px] overflow-y-auto">
        {configText}
      </pre>

      {/* Quick summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 mb-6">
        {[
          { label: 'shared_buffers', value: config.shared_buffers, color: 'text-blue-400' },
          { label: 'work_mem', value: config.work_mem, color: 'text-green-400' },
          { label: 'effective_cache', value: config.effective_cache_size, color: 'text-yellow-400' },
          { label: 'maintenance', value: config.maintenance_work_mem, color: 'text-purple-400' },
        ].map(c => (
          <div key={c.label} className="bg-dark-800 border border-dark-700 rounded-xl p-3 text-center">
            <div className={`text-lg font-bold font-mono ${c.color}`}>{c.value}</div>
            <div className="text-[10px] text-dark-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      {/* SEO content */}
      <section className="mt-10 border-t border-dark-700 pt-6">
        <h2 className="text-base font-bold text-dark-200 mb-3">About PostgreSQL Configuration Tuning</h2>
        <div className="text-xs text-dark-400 leading-relaxed space-y-2">
          <p>PostgreSQL ships with conservative default settings designed to work on minimal hardware. For production servers, tuning postgresql.conf based on your actual RAM, CPU count, storage type, and workload pattern can improve query performance by 2-10x.</p>
          <p><strong className="text-dark-300">shared_buffers</strong> is PostgreSQL&apos;s main memory cache — typically 25% of RAM. <strong className="text-dark-300">effective_cache_size</strong> tells the query planner how much total cache (OS + PG) is available. <strong className="text-dark-300">work_mem</strong> controls per-operation memory for sorts and hash joins — too low causes disk spills, too high risks OOM with many concurrent queries.</p>
          <p>For SSD storage, lowering <strong className="text-dark-300">random_page_cost</strong> to 1.1 tells the planner that random I/O is nearly as fast as sequential, enabling more efficient index scans. Parallel query settings scale with CPU cores — data warehouse workloads benefit from higher parallelism.</p>
          <p>This generator follows the same algorithms as PGTune, adapted from PostgreSQL documentation and community best practices. All calculations run in your browser.</p>
        </div>
      </section>
    </ToolLayout>
  );
}
