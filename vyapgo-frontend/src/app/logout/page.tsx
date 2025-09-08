'use client';

import { useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/auth-client';

export default function LogoutPage() {
  // Guard against double-running in React Strict Mode (dev)
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        // Clear any one-shot onboarding flag
        try {
          localStorage.removeItem('vyap:onboarding:pending');
        } catch {
          /* no-op */
        }

        await signOut(auth);
      } catch {
        // ignore error—we'll still navigate away
      } finally {
        // Hard redirect to fully reset client state/UI
        window.location.replace('/');
      }
    })();
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center text-gray-700">
      Signing you out…
    </div>
  );
}