import './globals.css';
import Script from 'next/script';
import ClientLayout from '../components/ClientLayout';

const SITE_URL = 'https://devtoolkit.site/';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'DevToolKit — Free Online Developer Tools',
    template: '%s | DevToolKit',
  },
  description: 'Free online developer tools: JSON formatter, Base64 encoder, JWT decoder, UUID generator, regex tester, and more. No sign-up, runs in your browser.',
  keywords: ['developer tools', 'json formatter', 'base64 encoder', 'uuid generator', 'online tools', 'web developer utilities'],
  authors: [{ name: 'DevToolKit' }],
  openGraph: {
    title: 'DevToolKit — Free Online Developer Tools',
    description: 'Free browser-based developer utilities. JSON, Base64, JWT, UUID, Regex, Hash, and more.',
    url: SITE_URL,
    siteName: 'DevToolKit',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevToolKit — Free Online Developer Tools',
    description: 'Free browser-based developer utilities.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className="antialiased">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BM1N2VKHD2"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BM1N2VKHD2');
          `}
        </Script>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
