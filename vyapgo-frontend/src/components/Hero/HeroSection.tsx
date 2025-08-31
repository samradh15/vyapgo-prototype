'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion, easeInOut } from 'framer-motion';
import Image from 'next/image';

export default function VyapGOHeroSection() {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setIsVoiceEnabled(true);
    }
  }, []);

  const handleVoiceActivation = useCallback(() => {
    if (!isVoiceEnabled) return;
    // Navigate to VyapYantra Studio as discussed
    alert('Voice activation started - Demo initiated');
  }, [isVoiceEnabled]);

  const animationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.6,
        ease: easeInOut,
      },
    },
  };

  return (
    <section
      className="min-h-screen relative overflow-hidden flex items-center"
      role="banner"
    >
      {/* Enhanced VyapGO Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
        {/* Floating Business Elements */}
        <motion.div
          className="absolute top-20 left-10 w-12 h-12 bg-orange-200 rounded-xl opacity-30"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 3, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        <motion.div
          className="absolute top-32 right-16 w-8 h-8 bg-green-200 rounded-full opacity-40"
          animate={{ 
            x: [0, 10, 0],
            y: [0, -8, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
        />

        <motion.div
          className="absolute bottom-24 left-1/4 w-16 h-16 bg-yellow-200 rounded-2xl opacity-25"
          animate={{ 
            rotate: [0, -8, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        />

        <motion.div
          className="absolute top-1/3 right-1/3 w-6 h-6 bg-orange-300 rounded-lg opacity-50"
          animate={{ 
            y: [0, -20, 0],
            x: [0, 8, 0],
            rotate: [0, 12, 0]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 0.5
          }}
        />

        {/* Subtle Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
              <pattern id="vyapgo-dots" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
                <circle cx="7.5" cy="7.5" r="1" fill="#f97316" opacity="0.3">
                  <animate attributeName="r" values="1;2;1" dur="8s" repeatCount="indefinite" />
                </circle>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#vyapgo-dots)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          
          {/* Left Side - Text Content */}
          <motion.div
            className="space-y-10"
            variants={animationVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="space-y-8">
              {/* Hindi Headline as per plan */}
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-semibold text-gray-900 leading-tight">
                <span className="block text-orange-600 mb-3 font-display">आपका बिज़नेस का</span>
                <span className="block text-green-700 font-display">अपना साथी</span>
              </h1>
              
              <div className="space-y-6">
                {/* English Subheadline */}
                <p className="text-2xl lg:text-3xl text-gray-800 font-medium leading-relaxed">
                  India's First Business Copilot
                </p>
                <p className="text-lg lg:text-xl text-gray-600 max-w-2xl leading-relaxed">
                  Transform your business with VyapGO's AI-powered platform. From inventory management to customer engagement, everything you need to grow.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Try Demo Button */}
              <button
                className="bg-gradient-to-r from-orange-500 via-yellow-500 to-green-500 hover:from-orange-600 hover:via-yellow-600 hover:to-green-600 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                onClick={handleVoiceActivation}
                disabled={!isVoiceEnabled}
              >
                Try Demo
              </button>
              
              <p className="text-base text-gray-500">
                {isVoiceEnabled ? 'Voice enabled • Hindi/English supported' : 'Click to start your journey'}
              </p>
            </div>
          </motion.div>

          {/* Right Side - Hero Rectangle with Avatar & Copilot */}
          <motion.div
            className="flex justify-center lg:justify-end"
            variants={animationVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: prefersReducedMotion ? 0 : 0.2 }}
          >
            <div className="relative w-[500px] h-[600px] lg:w-[600px] lg:h-[700px]">
              <motion.div
                className="relative w-full h-full"
                animate={{ 
                  y: [0, -10, 0],
                  scale: [1, 1.02, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                {/* Main Hero Rectangle Image */}
                {/* This will contain: AI avatar holding mobile with VyapGO logo, shop background, and VyapGO Copilot device on table */}
                <Image
                  src="/images/5.png"
                  alt="Happy Indian shopkeeper with VyapGO logo on mobile and Copilot device"
                  fill
                  className="object-contain rounded-2xl"
                  priority
                />
              </motion.div>
              
              {/* Subtle glow effect behind the rectangle */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-200/20 via-yellow-200/20 to-green-200/20 rounded-2xl blur-3xl -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
