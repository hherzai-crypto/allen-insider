import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Allen Insider | Your Weekly Guide to Allen, TX Events',
  description:
    'Never miss what\'s happening in Allen, TX. Get the best local events delivered to your inbox every Thursday. Concerts, festivals, family fun, food trucks, and more.',
  keywords: 'Allen TX, Allen Texas events, Allen things to do, Allen weekend events, Allen local events, Allen concerts, Allen festivals, Allen family activities, Allen farmers market',
  authors: [{ name: 'Hamid Harzai' }],
  creator: 'Allen Insider',
  publisher: 'Allen Insider',
  metadataBase: new URL('https://allen-insider.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Allen Insider | Your Weekly Guide to Allen, TX Events',
    description: 'Never miss what\'s happening in Allen, TX. Get the best local events delivered to your inbox every Thursday.',
    url: 'https://allen-insider.com',
    siteName: 'Allen Insider',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Allen Insider - Your Weekly Guide to Allen, TX Events',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Allen Insider | Your Weekly Guide to Allen, TX Events',
    description: 'Never miss what\'s happening in Allen, TX. Get the best local events delivered to your inbox every Thursday.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // TODO: Add after Google Search Console setup
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-bg-offwhite">{children}</body>
    </html>
  );
}
