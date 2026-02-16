export const metadata = {
  title: 'PostgreSQL Config Generator — Tune postgresql.conf Online',
  description: 'Free PostgreSQL configuration generator. Optimize postgresql.conf for your server: set shared_buffers, work_mem, effective_cache_size based on RAM, CPU, and workload type. Alternative to PGTune.',
  alternates: { canonical: '/postgres-config/' },
  keywords: ['postgresql config', 'pgtune', 'postgresql.conf generator', 'postgres tuning', 'shared_buffers calculator', 'postgres optimization'],
};
import Client from './client';
export default function Page() { return <Client />; }
