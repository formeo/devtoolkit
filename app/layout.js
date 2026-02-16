import './globals.css';
import Script from 'next/script';
import { DM_Sans, JetBrains_Mono } from 'next/font/google';
import ClientLayout from '../components/ClientLayout';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-sans', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });

const SITE_URL = 'https://www.devtoolkit.site';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'DevToolKit — Free Online Developer Tools',
    template: '%s | DevToolKit',
  },
  description: 'Free online developer tools: JSON formatter, Base64 encoder, JWT decoder, UUID generator, regex tester, cron parser, PostgreSQL config generator, and more. No sign-up, runs in your browser.',
  keywords: ['developer tools', 'json formatter', 'base64 encoder', 'uuid generator', 'online tools', 'web developer utilities', 'cron parser', 'postgresql config generator', 'pgtune alternative'],
  authors: [{ name: 'DevToolKit' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'DevToolKit — Free Online Developer Tools',
    description: 'Free browser-based developer utilities. JSON, Base64, JWT, UUID, Regex, Hash, Cron, PostgreSQL config, and more.',
    url: SITE_URL,
    siteName: 'DevToolKit',
    type: 'website',
    locale: 'en_US',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'DevToolKit — 19 Free Developer Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevToolKit — Free Online Developer Tools',
    description: 'Free browser-based developer utilities. No signup, runs in your browser.',
    images: [`${SITE_URL}/og-image.png`],
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "DevToolKit",
              "url": "https://www.devtoolkit.site",
              "description": "Free online developer tools: JSON formatter, Base64 encoder, JWT decoder, UUID generator, regex tester, cron parser, PostgreSQL config generator, and more.",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Any",
              "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
              "browserRequirements": "Requires a modern web browser",
              "featureList": "JSON Formatter, JSON Tree Viewer, YAML-JSON Converter, Base64 Encoder, JWT Decoder, URL Encoder, Hash Generator, UUID Generator, Regex Tester, Timestamp Converter, Color Converter, Lorem Ipsum Generator, Diff Checker, Password Generator, QR Code Generator, SQL Formatter, Cron Parser, PostgreSQL Config Generator, HTTP Status Codes"
            })
          }}
        />
      </head>
      <body className={`antialiased ${dmSans.variable} ${jetbrainsMono.variable}`}>
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
