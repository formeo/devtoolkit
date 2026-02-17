export const metadata = {
  title: 'Cron Expression Parser & Generator Online',
  description: 'Free cron expression parser and generator. Convert cron to human-readable text, build schedules visually, see next 10 run times.',
  alternates: { canonical: '/cron-parser/' },
  keywords: ['cron parser', 'cron expression generator', 'crontab guru', 'cron schedule', 'cron job online', 'quartz cron'],
};
import Client from './client';
export default function Page() { return <Client />; }
