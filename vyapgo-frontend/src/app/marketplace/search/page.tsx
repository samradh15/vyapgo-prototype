'use client';

import { Suspense } from 'react';
import SearchClient from './SearchClient';

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-600">Loading search results...</div>}>
      <SearchClient />
    </Suspense>
  );
}
