'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/auth-client'; // must export `auth` from your client

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // mobile menu
  const [user, setUser] = useState<any>(null);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement | null>(null);

  // Scroll style
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // Close menus on Escape / outside click
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setAvatarOpen(false);
      }
    };
    const onClickDoc = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClickDoc);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClickDoc);
    };
  }, []);

  const userLabel = useMemo(
    () => user?.displayName || user?.email || 'Account',
    [user]
  );

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        isScrolled
          ? 'bg-gradient-to-r from-orange-100/90 via-yellow-100/90 to-green-100/90 backdrop-blur-md shadow-sm'
          : 'bg-gradient-to-r from-orange-50/80 via-yellow-50/80 to-green-50/80'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand (logo + text → one clickable home link) */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 relative transform group-hover:scale-110 transition-transform duration-200">
                <Image
                  src="/images/logo.png"
                  alt="VyapGO Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-md" />
            </div>
            <span className="text-2xl font-bold text-gray-900 transition-colors duration-200">
              VyapGO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/services"
              className="relative font-medium text-gray-700 hover:text-orange-600 transition-colors duration-200 group"
            >
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-200 group-hover:w-full" />
            </Link>

            <Link
              href="/marketplace"
              className="relative font-medium text-gray-700 hover:text-orange-600 transition-colors duration-200 group"
            >
              VyapMandi
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-200 group-hover:w-full" />
            </Link>

            <Link
              href="/model"
              className="relative font-medium text-gray-700 hover:text-orange-600 transition-colors duration-200 group"
            >
              VyapYantra
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-200 group-hover:w-full" />
            </Link>

            {/* Right-side: Login OR Avatar */}
            {!user ? (
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Login
              </Link>
            ) : (
              <div className="relative" ref={avatarRef}>
                <button
                  onClick={() => setAvatarOpen((o) => !o)}
                  className="w-10 h-10 rounded-full ring-1 ring-black/5 shadow-sm bg-white overflow-hidden flex items-center justify-center hover:ring-black/10 transition"
                  aria-label="Open account menu"
                >
                  {/* Avatar icon (check.png) */}
                  <Image
                    src="/images/user1.png"
                    alt="Account"
                    width={34}
                    height={34}
                    className="object-contain"
                  />
                </button>

                {/* Dropdown */}
                {avatarOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white border border-gray-100 shadow-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{userLabel}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email || 'Signed in'}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                        onClick={() => setAvatarOpen(false)}
                      >
                        Account
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                        onClick={() => setAvatarOpen(false)}
                      >
                        Settings
                      </Link>
                      <Link
                        href="/logout"
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        onClick={() => setAvatarOpen(false)}
                      >
                        Sign out
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              setIsOpen(!isOpen);
              setAvatarOpen(false);
            }}
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 ${
                  isOpen ? 'rotate-45 translate-y-1' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 mt-1 ${
                  isOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 mt-1 ${
                  isOpen ? '-rotate-45 -translate-y-1' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden mt-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100"
          >
            <div className="py-6 space-y-4 px-4">
              <Link
                href="/services"
                className="block py-3 px-4 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/marketplace"
                className="block py-3 px-4 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 font-medium"
                onClick={() => setIsOpen(false)}
              >
                VyapMandi
              </Link>
              <Link
                href="/model"
                className="block py-3 px-4 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 font-medium"
                onClick={() => setIsOpen(false)}
              >
                VyapYantra
              </Link>

              {!user ? (
                <Link
                  href="/login"
                  className="block py-3 px-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-semibold text-center transition-all duration-200 hover:from-orange-600 hover:to-yellow-600"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              ) : (
                <div className="mt-2 border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-9 h-9 rounded-full bg-white ring-1 ring-black/5 flex items-center justify-center overflow-hidden">
                      <Image
                        src="/images/user1.png"
                        alt="Account"
                        width={34}
                        height={34}
                        className="object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{userLabel}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email || 'Signed in'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <Link
                      href="/account"
                      className="block py-2 px-3 text-gray-700 hover:bg-orange-50 rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Account
                    </Link>
                    <Link
                      href="/settings"
                      className="block py-2 px-3 text-gray-700 hover:bg-orange-50 rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Settings
                    </Link>
                    <Link
                      href="/logout"
                      className="block py-2 px-3 text-red-600 hover:bg-red-50 rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign out
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}