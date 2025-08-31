'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        isScrolled 
          ? 'bg-gradient-to-r from-orange-100/90 via-yellow-100/90 to-green-100/90 backdrop-blur-md shadow-sm' 
          : 'bg-gradient-to-r from-orange-50/80 via-yellow-50/80 to-green-50/80'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo with Custom Image */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              {/* Custom VyapGO Logo Image */}
              <div className="w-12 h-12 relative transform group-hover:scale-110 transition-transform duration-200">
                <Image
                  src="/images/logo.png"
                  alt="VyapGO Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              {/* Status Indicator Dot */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-md"></div>
            </div>
            <span className="text-2xl font-bold text-gray-900 transition-colors duration-200">
              VyapGO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="relative font-medium text-gray-700 hover:text-orange-600 transition-colors duration-200 group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            
            <Link 
              href="/services" 
              className="relative font-medium text-gray-700 hover:text-orange-600 transition-colors duration-200 group"
            >
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            
            <Link 
              href="/marketplace" 
              className="relative font-medium text-gray-700 hover:text-orange-600 transition-colors duration-200 group"
            >
              Marketplace
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>

            {/* CTA Button */}
            <Link 
              href="/model"
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Try VyapYantra
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 mt-1 ${isOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 mt-1 ${isOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100"
          >
            <div className="py-6 space-y-4 px-4">
              <Link 
                href="/" 
                className="block py-3 px-4 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
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
                Marketplace
              </Link>
              
              {/* Mobile CTA */}
              <Link 
                href="/model"
                className="block py-3 px-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-semibold text-center transition-all duration-200 hover:from-orange-600 hover:to-yellow-600"
                onClick={() => setIsOpen(false)}
              >
                Try VyapYantra
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
