'use client';
export const dynamic = 'force-dynamic';

import './globals.css';
import { Inter } from 'next/font/google';
import Navigation from '@/components/layout/navigation';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider } from '@/contexts/auth-context';
import { useEffect, useMemo, useState } from 'react';

// Keep these if you use the font variables elsewhere
import { devanagari, notoSans } from '@/lib/yantra-fonts';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

/** ---------- Small modal for the homepage onboarding nudge ---------- */
function OnboardingPrompt({
  onStart,
  onClose,
}: {
  onStart: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-amber-200/60 overflow-hidden">
        <div className="p-5">
          <div className="text-sm font-semibold text-gray-800">Welcome to VyapGO</div>
          <h3 className="mt-1 text-lg font-bold text-gray-900">
            Let’s set up your shop in 60 seconds
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Answer 5–6 quick questions so VyapYantra & VyapMandi can personalize your experience.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={onStart}
              className="flex-1 h-11 rounded-xl text-white font-semibold shadow-lg transition-transform active:scale-[0.99]"
              style={{
                background: 'linear-gradient(90deg, #f97316, #f59e0b, #10b981)',
              }}
            >
              Start
            </button>
            <button
              onClick={onClose}
              className="h-11 px-4 rounded-xl border border-gray-200 text-gray-700 hover:border-gray-300"
            >
              Later
            </button>
          </div>
        </div>

        <div className="px-5 py-3 bg-gradient-to-r from-orange-50/70 via-yellow-50/70 to-emerald-50/70 text-[12px] text-gray-600">
          You can always finish setup from <span className="font-medium">Account → Complete setup</span>.
        </div>
      </div>
    </div>
  );
}

/** ---------- Gate: show the prompt only on homepage for new users ---------- */
function HomeOnboardingGate({ active }: { active: boolean }) {
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!active) return;

    // Only show if signup/login marked user as new
    const pending = typeof window !== 'undefined'
      ? window.localStorage.getItem('vyap:onboarding:pending') === '1'
      : false;

    // Avoid nagging within the same session if they hit "Later"
    const dismissedThisSession = typeof window !== 'undefined'
      ? window.sessionStorage.getItem('vyap:onboarding:dismissed') === '1'
      : false;

    if (pending && !dismissedThisSession) {
      setShow(true);
    }
  }, [active]);

  const handleStart = () => {
    setShow(false);
    router.push('/onboarding');
  };

  const handleLater = () => {
    setShow(false);
    try {
      // Dismiss just for this browser session
      window.sessionStorage.setItem('vyap:onboarding:dismissed', '1');
    } catch { }
  };

  if (!show) return null;
  return <OnboardingPrompt onStart={handleStart} onClose={handleLater} />;
}

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
  const isHome = pathname === '/';

  // Only show onboarding gate on the homepage and when header is present
  const showHomeGate = useMemo(() => isHome && !hideNav, [isHome, hideNav]);

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

          {/* New-user onboarding nudge (homepage only) */}
          <HomeOnboardingGate active={showHomeGate} />
        </AuthProvider>
      </body>
    </html>
  );
}