'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          
          {/* VyapGO Brand - More Space */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 relative">
                <Image
                  src="/images/logo.png"
                  alt="VyapGO Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-3xl font-semibold">VyapGO</span>
            </div>
            
            <div className="space-y-4 max-w-md">
              <p className="text-xl font-medium text-gray-300">
                India's First Business Copilot
              </p>
              <p className="text-gray-400 leading-relaxed text-base">
                Empowering Indian businesses with AI-powered solutions for inventory management, 
                customer analytics, and business growth. Transform your operations with intelligent automation.
              </p>
            </div>
          </div>

          {/* Solutions - Compact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-200 mb-4">Solutions</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Home
              </Link>
              <Link href="/copilot" className="block text-gray-400 hover:text-white transition-colors text-sm">
                VyapSathi
              </Link>
              <Link href="/marketplace" className="block text-gray-400 hover:text-white transition-colors text-sm">
                VyapMandi
              </Link>
              <Link href="/platform" className="block text-gray-400 hover:text-white transition-colors text-sm">
                VyapYantra
              </Link>
            </div>
          </div>

          {/* Support - Compact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-200 mb-4">Support</h3>
            <div className="space-y-2 text-sm">
              <div>
                <a href="mailto:support@vyapgo.com" className="text-gray-400 hover:text-white transition-colors">
                  support@vyapgo.com
                </a>
              </div>
              <div>
                <a href="tel:+919876543210" className="text-gray-400 hover:text-white transition-colors">
                  +91 98765 43210
                </a>
              </div>
              <div>
                <Link href="/help" className="text-gray-400 hover:text-white transition-colors">
                  Help Center
                </Link>
              </div>
              <div>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div>
              <p className="text-gray-400 text-sm">
                © 2025 VyapGO. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/security" className="text-gray-400 hover:text-white transition-colors">
                Security
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
