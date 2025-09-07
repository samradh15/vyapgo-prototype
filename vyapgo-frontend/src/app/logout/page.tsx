'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/auth-client';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      try {
        // clear any onboarding one-shot flag
        try { localStorage.removeItem('vyap:onboarding:pending'); } catch {}

        await signOut(auth);
      } catch {
        // ignore error—we'll still try to move on
      } finally {
        router.replace('/'); // go home after sign out
      }
    };
    doLogout();
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center text-gray-700">
      Signing you out…
    </div>
  );
}