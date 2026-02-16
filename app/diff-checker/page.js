export const metadata = { title: 'Text Diff Checker — Compare Texts Online', description: 'Free online text diff checker. Compare two texts side by side with highlighted additions, deletions, and changes. Like git diff in your browser.', alternates: { canonical: '/diff-checker/' }, keywords: ['diff checker', 'text compare online', 'text diff tool', 'compare two texts', 'online diff'] };
import Client from './client';
export default function Page() { return <Client />; }
