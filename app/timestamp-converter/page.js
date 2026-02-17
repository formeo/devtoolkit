export const metadata = { title: 'Unix Timestamp Converter — Epoch to Date', description: 'Free Unix timestamp converter. Convert epoch timestamps to human-readable dates and back. Supports seconds and milliseconds. Includes live UTC clock.', keywords: ['unix timestamp converter', 'epoch converter', 'timestamp to date', 'unix time online'],
  alternates: { canonical: '/timestamp-converter/' } };
import Client from './client';
export default function Page() { return <Client />; }
