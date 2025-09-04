'use client';

import Link from 'next/link';

export default function OnboardingPage() {
  return (
    <main className="min-h-[70vh] max-w-2xl mx-auto px-6 py-24">
      <h1 className="text-2xl font-semibold text-gray-900">Let’s personalize VyapGO</h1>
      <p className="mt-2 text-gray-600">
        We’ll ask 5–6 quick questions about your shop to tailor your experience.
      </p>

      <div className="mt-8 rounded-2xl border border-amber-200/50 bg-white p-6">
        <ol className="list-decimal list-inside text-gray-700 space-y-2">
          <li>Shop category</li>
          <li>Single vs. multiple stores</li>
          <li>Inventory tracking depth</li>
          <li>Preferred payment methods</li>
          <li>Languages</li>
          <li>Priority goal for the next 30 days</li>
        </ol>

        <Link
          href="/dashboard"
          className="inline-flex mt-6 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold"
        >
          Skip for now →
        </Link>
      </div>
    </main>
  );
}