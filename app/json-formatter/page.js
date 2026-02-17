export const metadata = {
  title: 'JSON Formatter & Validator — Beautify JSON Online',
  description: 'Free online JSON formatter, validator, and minifier. Paste your JSON and get instant, beautifully formatted results. Supports customizable indentation.',
  keywords: ['json formatter', 'json validator', 'json beautifier', 'json minify', 'format json online', 'json pretty print'],
  alternates: { canonical: '/json-formatter/' },
};

import JSONFormatterClient from './client';
export default function Page() { return <JSONFormatterClient />; }
