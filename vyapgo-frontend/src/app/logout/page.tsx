'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOutUser } from '@/lib/auth-client';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        await signOutUser();
      } finally {
        router.replace('/');
      }
    })();
  }, [router]);

  return (
    <main className="min-h-screen grid place-items-center">
      <p className="text-gray-600">Signing you out…</p>
    </main>
  );
}