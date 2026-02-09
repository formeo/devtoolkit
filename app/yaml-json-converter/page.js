export const metadata = {
  title: 'YAML to JSON Converter — Convert YAML ↔ JSON Online',
  description: 'Free online YAML to JSON and JSON to YAML converter. Supports nested objects, arrays, and comments. Instant conversion.',
  keywords: ['yaml to json', 'json to yaml', 'yaml converter', 'yaml parser online'],
  alternates: { canonical: '/yaml-json-converter/' },
};
import Client from './client';
export default function Page() { return <Client />; }
