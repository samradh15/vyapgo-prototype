'use client';
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import LoginClient from './LoginClient';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-600">Loading login...</div>}>
      <LoginClient />
    </Suspense>
  );
}
