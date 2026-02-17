export const metadata = {
  title: 'PostgreSQL Config Generator — Free PGTune Alternative',
  description: 'Free PostgreSQL config generator. Optimize shared_buffers, work_mem, effective_cache_size for your server. PGTune alternative, runs in browser.',
  alternates: { canonical: '/postgres-config/' },
  keywords: ['postgresql config', 'pgtune', 'pgtune alternative', 'pgtune online', 'postgresql.conf generator', 'postgres tuning', 'shared_buffers calculator', 'postgres config generator', 'postgres optimization'],
};
import Client from './client';
export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What should shared_buffers be set to in PostgreSQL?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "shared_buffers should typically be set to 25% of your server's total RAM. For a 16 GB server, set it to 4 GB. For servers with more than 64 GB RAM, you can go up to 40%, though beyond 8-16 GB there are diminishing returns."
                }
              },
              {
                "@type": "Question",
                "name": "How do I calculate work_mem for PostgreSQL?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "work_mem = (RAM - shared_buffers) / (max_connections × 3). For a 16 GB server with 4 GB shared_buffers and 200 connections: (16384 - 4096) / (200 × 3) = ~20 MB."
                }
              },
              {
                "@type": "Question",
                "name": "What is the difference between PGTune and DevToolKit?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Both use similar algorithms based on PostgreSQL community recommendations. DevToolKit runs 100% in your browser (no data sent to servers), provides explanations for each parameter, and supports the latest PostgreSQL versions."
                }
              },
              {
                "@type": "Question",
                "name": "What should random_page_cost be for SSD?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "For SSD storage, set random_page_cost to 1.1 (default is 4.0). SSDs have nearly equal random and sequential read speeds, so this tells PostgreSQL to prefer index scans more aggressively. Also set effective_io_concurrency to 200."
                }
              }
            ]
          })
        }}
      />
      <Client />
    </>
  );
}
