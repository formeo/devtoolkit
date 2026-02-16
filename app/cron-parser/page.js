export const metadata = {
  title: 'Cron Expression Parser & Generator — Explain Cron Jobs Online',
  description: 'Free online cron expression parser and generator. Convert cron expressions to human-readable text, build schedules visually, see next run times. Supports Linux crontab and Quartz formats.',
  alternates: { canonical: '/cron-parser/' },
  keywords: ['cron parser', 'cron expression generator', 'crontab guru', 'cron schedule', 'cron job online', 'quartz cron'],
};
import Client from './client';
export default function Page() { return <Client />; }
