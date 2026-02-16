export const metadata = { title: 'Text Diff Checker — Compare Texts Online', description: 'Free online text diff checker. Compare two texts side by side with highlighted additions, deletions, and changes. Like git diff in your browser.', alternates: { canonical: '/diff-checker/' } };
import Client from './client';
export default function Page() { return <Client />; }
