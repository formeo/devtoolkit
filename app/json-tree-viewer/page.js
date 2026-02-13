export const metadata = {
  title: 'JSON Tree Viewer — Visualize JSON Structure Online',
  description: 'Free online JSON tree viewer and explorer. Visualize JSON as a collapsible tree, see data types, array sizes, copy node paths like response.data[0].user.name. Search keys instantly.',
  alternates: { canonical: '/json-tree-viewer/' },
  keywords: ['json tree viewer', 'json visualizer', 'json explorer', 'json tree online', 'json structure viewer', 'json path finder'],
};
import Client from './client';
export default function Page() { return <Client />; }
