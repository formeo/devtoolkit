export const metadata = { title: 'Hash Generator — SHA-256, SHA-1, SHA-512', description: 'Free online hash generator. Create SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text. Uses Web Crypto API, runs in your browser.', alternates: { canonical: '/hash-generator/' }, keywords: ['hash generator', 'sha256 online', 'sha1 generator', 'sha512 hash', 'web crypto hash'] };
import Client from './client';
export default function Page() { return <Client />; }
