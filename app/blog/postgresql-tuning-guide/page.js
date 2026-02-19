export const metadata = {
  title: 'PostgreSQL Tuning Guide 2026 — Free PGTune Alternative',
  description: 'Complete postgresql.conf tuning guide: shared_buffers, work_mem, effective_cache_size, WAL settings. With free online config generator.',
  alternates: { canonical: '/blog/postgresql-tuning-guide/' },
  keywords: ['postgresql tuning guide', 'postgres performance', 'pgtune guide', 'postgresql.conf optimization', 'shared_buffers tuning', 'work_mem calculation', 'postgres config for 16gb', 'postgres config for 32gb'],
};
import Link from 'next/link';

export default function PostgresTuningGuide() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/blog/" className="text-xs text-dark-500 hover:text-dark-300 no-underline">&larr; Blog</Link>
      </div>
      <h1 className="text-2xl font-bold text-dark-50 mb-2">PostgreSQL Performance Tuning Guide 2026</h1>
      <p className="text-sm text-dark-500 mb-8">Complete configuration reference with formulas and recommended values</p>

      <article className="text-sm text-dark-300 leading-relaxed space-y-4">
        <p>PostgreSQL ships with default settings designed to run on minimal hardware. On a production server with 16–128 GB of RAM, these defaults leave 90% of your hardware unused. This guide explains every key parameter, the formula behind it, and the recommended value for your server size.</p>

        <p>Want instant results? Use our <Link href="/postgres-config/" className="text-brand-400 hover:underline">free PostgreSQL Config Generator</Link> — a modern PGTune alternative that runs in your browser.</p>

        <h2 className="text-lg font-bold text-dark-100 mt-8 mb-3">1. Memory Configuration</h2>

        <h3 className="text-base font-semibold text-dark-200 mt-6 mb-2">shared_buffers</h3>
        <p><strong className="text-dark-100">What it does:</strong> PostgreSQL&apos;s dedicated memory cache for table and index data pages. The single most impactful parameter for query performance.</p>
        <p><strong className="text-dark-100">Formula:</strong> 25% of total system RAM, with adjustments for very large systems.</p>
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-700 font-mono text-xs my-3">
          <div className="text-dark-400"># Examples by server size</div>
          <div>4 GB RAM  &rarr; shared_buffers = 1GB</div>
          <div>8 GB RAM  &rarr; shared_buffers = 2GB</div>
          <div>16 GB RAM &rarr; shared_buffers = 4GB</div>
          <div>32 GB RAM &rarr; shared_buffers = 8GB</div>
          <div>64 GB RAM &rarr; shared_buffers = 16GB</div>
          <div>128 GB RAM &rarr; shared_buffers = 32GB <span className="text-dark-500"># up to 40% for large RAM</span></div>
        </div>
        <p>On servers with more than 64 GB RAM, going above 25% to 40% can help for workloads with large working sets. However, PostgreSQL relies heavily on the OS page cache, so allocating too much to shared_buffers starves it. Sweet spot: 25–40%.</p>
        <p><strong className="text-dark-100">Common mistake:</strong> Setting shared_buffers to 50%+ of RAM. This causes double-buffering (data in both PG and OS cache) and can reduce performance.</p>

        <h3 className="text-base font-semibold text-dark-200 mt-6 mb-2">effective_cache_size</h3>
        <p><strong className="text-dark-100">What it does:</strong> Tells the query planner how much memory is available for caching, including both shared_buffers AND the OS page cache. Doesn&apos;t allocate any memory — purely advisory.</p>
        <p><strong className="text-dark-100">Formula:</strong> 75% of total system RAM.</p>
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-700 font-mono text-xs my-3">
          <div>16 GB RAM &rarr; effective_cache_size = 12GB</div>
          <div>32 GB RAM &rarr; effective_cache_size = 24GB</div>
          <div>64 GB RAM &rarr; effective_cache_size = 48GB</div>
        </div>
        <p>If set too low, the planner avoids index scans in favor of sequential scans — dramatically hurting OLTP performance.</p>

        <h3 className="text-base font-semibold text-dark-200 mt-6 mb-2">work_mem</h3>
        <p><strong className="text-dark-100">What it does:</strong> Controls memory each sort, hash join, or aggregation can use before spilling to disk.</p>
        <p><strong className="text-dark-100">Formula:</strong> <code className="bg-dark-800 px-1.5 py-0.5 rounded text-dark-200">(RAM - shared_buffers) / (max_connections &times; 3)</code></p>
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-700 font-mono text-xs my-3">
          <div className="text-dark-400"># 16 GB RAM, 4 GB shared_buffers, 200 connections</div>
          <div>(16384 - 4096) / (200 &times; 3) = 20 MB</div>
          <div></div>
          <div className="text-dark-400"># 64 GB RAM, 16 GB shared_buffers, 100 connections</div>
          <div>(65536 - 16384) / (100 &times; 3) = 163 MB</div>
        </div>
        <p>The &times;3 factor accounts for multiple operations per query. If you see &quot;Sort Method: external merge Disk&quot; in EXPLAIN ANALYZE, work_mem is too low.</p>
        <p><strong className="text-dark-100">Warning:</strong> work_mem is per-operation, not per-connection. A complex query with 5 joins uses 5 &times; work_mem. With 200 connections, aggressive values can cause OOM kills.</p>

        <h3 className="text-base font-semibold text-dark-200 mt-6 mb-2">maintenance_work_mem</h3>
        <p><strong className="text-dark-100">Formula:</strong> RAM / 16, capped at 2 GB. Used for VACUUM, CREATE INDEX, ALTER TABLE. Can be set higher than work_mem because few maintenance ops run simultaneously. More memory = faster VACUUM and index creation.</p>

        <h2 className="text-lg font-bold text-dark-100 mt-8 mb-3">2. Storage Configuration</h2>

        <h3 className="text-base font-semibold text-dark-200 mt-6 mb-2">random_page_cost</h3>
        <p><strong className="text-dark-100">Default:</strong> 4.0 (assumes HDD). <strong className="text-dark-100">SSD:</strong> Set to 1.1. This is one of the most impactful changes for SSD servers — the planner will prefer index scans far more aggressively.</p>

        <h3 className="text-base font-semibold text-dark-200 mt-6 mb-2">effective_io_concurrency</h3>
        <p><strong className="text-dark-100">HDD:</strong> 2. <strong className="text-dark-100">SSD:</strong> 200. Tells PostgreSQL how many concurrent I/O operations storage can handle.</p>

        <h2 className="text-lg font-bold text-dark-100 mt-8 mb-3">3. Checkpoint & WAL</h2>
        <p><strong className="text-dark-100">wal_buffers:</strong> 64 MB for most servers. <strong className="text-dark-100">checkpoint_completion_target:</strong> 0.9 (default in PG 14+) — spreads checkpoint I/O over 90% of the interval. <strong className="text-dark-100">max_wal_size:</strong> 4 GB for web, 8 GB for write-heavy OLTP, 16 GB for bulk data warehouse loads.</p>

        <h2 className="text-lg font-bold text-dark-100 mt-8 mb-3">4. Parallelism</h2>
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-700 font-mono text-xs my-3">
          <div>max_parallel_workers_per_gather = CPU_CORES / 2</div>
          <div>max_worker_processes = CPU_CORES</div>
          <div>max_parallel_workers = CPU_CORES</div>
          <div>max_parallel_maintenance_workers = CPU_CORES / 2</div>
        </div>
        <p>Web apps with many simple queries benefit less from parallelism. Data warehouses with complex aggregations can see 10–20x speedups on multi-core servers.</p>

        <h2 className="text-lg font-bold text-dark-100 mt-8 mb-3">5. Quick Reference: Settings by Server Size</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse my-3">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left py-2 pr-3 text-dark-400 font-semibold">Parameter</th>
                <th className="text-right py-2 px-3 text-dark-400 font-semibold">4 GB</th>
                <th className="text-right py-2 px-3 text-dark-400 font-semibold">16 GB</th>
                <th className="text-right py-2 px-3 text-dark-400 font-semibold">32 GB</th>
                <th className="text-right py-2 px-3 text-dark-400 font-semibold">64 GB</th>
              </tr>
            </thead>
            <tbody className="font-mono text-dark-300">
              <tr className="border-b border-dark-800"><td className="py-1.5 pr-3">shared_buffers</td><td className="text-right px-3">1 GB</td><td className="text-right px-3">4 GB</td><td className="text-right px-3">8 GB</td><td className="text-right px-3">16 GB</td></tr>
              <tr className="border-b border-dark-800"><td className="py-1.5 pr-3">effective_cache_size</td><td className="text-right px-3">3 GB</td><td className="text-right px-3">12 GB</td><td className="text-right px-3">24 GB</td><td className="text-right px-3">48 GB</td></tr>
              <tr className="border-b border-dark-800"><td className="py-1.5 pr-3">work_mem</td><td className="text-right px-3">5 MB</td><td className="text-right px-3">20 MB</td><td className="text-right px-3">40 MB</td><td className="text-right px-3">80 MB</td></tr>
              <tr className="border-b border-dark-800"><td className="py-1.5 pr-3">maintenance_work_mem</td><td className="text-right px-3">256 MB</td><td className="text-right px-3">1 GB</td><td className="text-right px-3">2 GB</td><td className="text-right px-3">2 GB</td></tr>
              <tr className="border-b border-dark-800"><td className="py-1.5 pr-3">wal_buffers</td><td className="text-right px-3">32 MB</td><td className="text-right px-3">64 MB</td><td className="text-right px-3">64 MB</td><td className="text-right px-3">64 MB</td></tr>
              <tr><td className="py-1.5 pr-3">max_wal_size</td><td className="text-right px-3">2 GB</td><td className="text-right px-3">4 GB</td><td className="text-right px-3">4 GB</td><td className="text-right px-3">8 GB</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-dark-400">Values assume web application workload with ~200 connections on SSD. For OLTP or data warehouse, use our <Link href="/postgres-config/" className="text-brand-400 hover:underline">PostgreSQL Config Generator</Link>.</p>

        <h2 className="text-lg font-bold text-dark-100 mt-8 mb-3">Generate Your Config Automatically</h2>
        <p>Instead of calculating each parameter manually, use our <Link href="/postgres-config/" className="text-brand-400 hover:underline font-semibold">free PostgreSQL Config Generator</Link>. Enter RAM, CPUs, storage type, and workload — get a complete optimized postgresql.conf in seconds. A modern, browser-based PGTune alternative with explanations for every setting.</p>
      </article>
    </div>
  );
}
