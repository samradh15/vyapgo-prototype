'use client';

import React from 'react';
import AuthAutoPreview from './AuthAutoPreview';

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="min-h-screen w-full flex items-center"
      style={{ background: 'linear-gradient(180deg,#F6F0E6,#F2E9DD)' }}
    >
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="grid gap-10 lg:grid-cols-2 items-start justify-items-center">
          {/* Left: compact auto-running preview (fits without scrolling) */}
          <div className="rounded-2xl p-6 bg-white/60 backdrop-blur border border-amber-200/60 shadow-sm">
            <AuthAutoPreview />
          </div>

          {/* Right: login card same visual footprint */}
          <div className="rounded-2xl p-6 bg-white/90 border border-amber-200/60 shadow-md">
            {/* constrain to phone footprint for symmetry */}
            <div style={{ width: 320, minHeight: 620 }}>{children}</div>
          </div>
        </div>
      </div>
    </main>
  );
}