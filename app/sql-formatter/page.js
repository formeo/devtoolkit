export const metadata = {
  title: 'SQL Formatter — Format & Beautify SQL Online',
  description: 'Free online SQL formatter and beautifier. Format messy SQL queries instantly. Supports MySQL, PostgreSQL, SQL Server, and more.',
  keywords: ['sql formatter', 'sql beautifier', 'format sql online', 'sql pretty print', 'sql formatter online free'],
  alternates: { canonical: '/sql-formatter/' },
};
import Client from './client';
export default function Page() { return <Client />; }
