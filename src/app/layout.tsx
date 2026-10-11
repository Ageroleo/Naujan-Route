import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';

export const metadata: Metadata = {
  title: {
    default: 'Naujan Trail — Tourism Guide | Oriental Mindoro',
    template: '%s | Naujan Trail',
  },
  description:
    'Your pocket guide to exploring Naujan, Oriental Mindoro, Philippines. Discover attractions, plan routes, calculate fares, and access emergency contacts — even offline.',
  keywords: [
    'Naujan',
    'Oriental Mindoro',
    'tourism',
    'travel guide',
    'Philippines',
    'Naujan Lake',
    'Simbahang Bato',
    'hot springs',
    'waterfalls',
  ],
  authors: [{ name: 'Municipality of Naujan' }],
  openGraph: {
    title: 'Naujan Trail — Tourism Guide',
    description:
      'Discover Naujan, Oriental Mindoro. Attractions, routes, fares & emergency contacts in one offline-ready app.',
    siteName: 'Naujan Trail',
    locale: 'en_PH',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        <main className="page-content">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
