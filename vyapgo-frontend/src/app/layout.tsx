'use client';

import type { Metadata } from 'next';
import { devanagari, notoSans } from '@/lib/yantra-fonts'
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/layout/navigation';
import { usePathname } from 'next/navigation';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';

  // ✅ Hide global nav on ANY marketplace route (e.g., /marketplace, /marketplace/search, /marketplace/anything)
  const inMarketplace = pathname.startsWith('/marketplace');

  // Keep your other “no-nav” pages
  const hideNav =
    inMarketplace ||
    pathname === '/create-app' ||
    pathname === '/model' ||
    pathname === '/studio' ||
    pathname === '/model/studio';

  return (
    <body className="font-sans antialiased bg-white text-gray-900 min-h-screen">
      {!hideNav && <Navigation />}
      {/* Only add top padding when the global nav is visible */}
      <div className={hideNav ? '' : 'pt-20'}>
        {children}
      </div>
    </body>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <LayoutContent>{children}</LayoutContent>
    </html>
  );
}