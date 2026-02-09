export const metadata = {
  title: 'Password Generator — Strong Random Passwords Online',
  description: 'Generate strong, secure random passwords instantly. Customize length, characters, numbers, and symbols. Everything runs in your browser — no data sent anywhere.',
  keywords: ['password generator', 'random password', 'strong password generator', 'secure password', 'password creator online'],
  alternates: { canonical: '/password-generator/' },
};
import Client from './client';
export default function Page() { return <Client />; }
