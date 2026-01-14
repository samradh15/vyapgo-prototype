'use client';
export const dynamic = 'force-dynamic';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#F3EBDD]">
            <h1 className="text-6xl font-bold mb-4 text-orange-600">404</h1>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Page Not Found</h2>
            <Link href="/" className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors">
                Return Home
            </Link>
        </div>
    );
}
