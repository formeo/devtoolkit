export const metadata = {
  title: 'JSON Tree Viewer — Visualize JSON Structure Online',
  description: 'Free JSON tree viewer. Visualize JSON as a collapsible tree, see data types, copy node paths. Search keys instantly.',
  alternates: { canonical: '/json-tree-viewer/' },
  keywords: ['json tree viewer', 'json visualizer', 'json explorer', 'json tree online', 'json structure viewer', 'json path finder'],
};
import Client from './client';
export default function Page() { return <Client />; }
