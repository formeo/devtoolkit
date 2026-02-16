export const metadata = {
  title: 'PostgreSQL Config Generator — Tune postgresql.conf Online',
  description: 'Free PostgreSQL config generator. Optimize shared_buffers, work_mem, effective_cache_size for your hardware. PGTune alternative in browser.',
  alternates: { canonical: '/postgres-config/' },
  keywords: ['postgresql config', 'pgtune', 'postgresql.conf generator', 'postgres tuning', 'shared_buffers calculator', 'postgres optimization'],
};
import Client from './client';
export default function Page() { return <Client />; }
