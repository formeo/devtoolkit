export const metadata = {
  title: 'Password Generator — Strong Random Passwords Online',
  description: 'Generate strong, secure random passwords. Customize length, characters, numbers, symbols. Runs in browser, no data sent anywhere.',
  keywords: ['password generator', 'random password', 'strong password generator', 'secure password', 'password creator online'],
  alternates: { canonical: '/password-generator/' },
};
import Client from './client';
export default function Page() { return <Client />; }
