'use client';



import { Suspense } from 'react';
import StudioClient from './StudioClient';

export default function StudioPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-600">Loading studio...</div>}>
      <StudioClient />
    </Suspense>
  );
}
