import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Allen Insider | Your Weekly Guide to Allen, TX Events',
  description:
    'Never miss what\'s happening in Allen, TX. Get the best local events delivered to your inbox every Thursday. Concerts, festivals, family fun, food trucks, and more.',
  keywords: 'Allen TX, Allen Texas events, Allen things to do, Allen weekend events, Allen local events',
  openGraph: {
    title: 'Allen Insider | Your Weekly Guide to Allen, TX Events',
    description: 'Never miss what\'s happening in Allen, TX. Get the best local events delivered to your inbox every Thursday.',
    url: 'https://allen-insider.com',
    siteName: 'Allen Insider',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Allen Insider | Your Weekly Guide to Allen, TX Events',
    description: 'Never miss what\'s happening in Allen, TX. Get the best local events delivered to your inbox every Thursday.',
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
