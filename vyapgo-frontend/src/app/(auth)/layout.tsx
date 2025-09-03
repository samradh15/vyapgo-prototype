// src/app/(auth)/layout.tsx
'use client';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Hide the global nav only on auth routes */}
      <style jsx global>{`
        nav.fixed.top-0.left-0.right-0.z-50 {
          display: none !important;
        }
      `}</style>
      {children}
    </>
  );
}