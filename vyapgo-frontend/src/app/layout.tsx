'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import Navigation from '@/components/layout/navigation';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/contexts/auth-context';
// Keep these if you use the font variables elsewhere
import { devanagari, notoSans } from '@/lib/yantra-fonts';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';

  // Auth pages (no header)
  const isAuth =
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname.startsWith('/auth');

  // Fullscreen/Studio style pages (no header)
  const isFullscreen =
    pathname.startsWith('/marketplace') ||
    pathname === '/create-app' ||
    pathname === '/model' ||
    pathname === '/studio' ||
    pathname === '/model/studio';

  const hideNav = isAuth || isFullscreen;

  return (
    <html
      lang="en"
      className={[
        inter.variable,
        (devanagari as any)?.variable ?? '',
        (notoSans as any)?.variable ?? '',
      ].join(' ')}
    >
      {/* Beige site background, no white band */}
      <body className="min-h-screen bg-[#F3EBDD] text-gray-900 antialiased font-sans">
        <AuthProvider>
          {!hideNav && <Navigation />}
          {/* Offset only when header is present */}
          <div className={hideNav ? '' : 'pt-20'}>{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}