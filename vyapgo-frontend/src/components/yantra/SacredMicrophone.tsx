'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { YANTRA_THEMES } from '@/lib/yantra-config';

interface SacredMicrophoneProps {
  isRecording?: boolean;
  isListening?: boolean;
  isProcessing?: boolean;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  theme?: keyof typeof YANTRA_THEMES;
  disabled?: boolean;
}

export const SacredMicrophone: React.FC<SacredMicrophoneProps> = ({
  isRecording = false,
  isListening = false,
  isProcessing = false,
  onClick,
  size = 'medium',
  theme = 'SACRED_SAFFRON',
  disabled = false
}) => {
  const colorPalette = YANTRA_THEMES[theme];
  
  const sizeConfig = {
    small: { wrapper: 'w-10 h-10', svg: 'w-6 h-6' },
    medium: { wrapper: 'w-14 h-14', svg: 'w-8 h-8' },
    large: { wrapper: 'w-20 h-20', svg: 'w-12 h-12' }
  };

  const currentSize = sizeConfig[size];

  return (
    <motion.div
      className={`${currentSize.wrapper} relative cursor-pointer select-none`}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      style={{
        filter: disabled ? 'grayscale(0.5) opacity(0.6)' : 'none'
      }}
    >
      {/* Sacred Energy Aura */}
      <AnimatePresence>
        {(isRecording || isListening || isProcessing) && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, 
                ${colorPalette.primary}40 0%, 
                ${colorPalette.accent}30 40%, 
                transparent 70%
              )`
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1.2, 0.8],
              opacity: [0, 0.8, 0]
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        )}
      </AnimatePresence>

      {/* Main Microphone Container */}
      <motion.div
        className="relative z-10 w-full h-full flex items-center justify-center rounded-full"
        style={{
          background: `linear-gradient(135deg, 
            ${colorPalette.primary} 0%, 
            ${colorPalette.secondary} 50%, 
            ${colorPalette.accent} 100%
          )`,
          boxShadow: `0 4px 20px ${colorPalette.primary}40`
        }}
        animate={isRecording ? {
          boxShadow: [
            `0 4px 20px ${colorPalette.primary}40`,
            `0 6px 30px ${colorPalette.accent}60`,
            `0 4px 20px ${colorPalette.primary}40`
          ]
        } : {}}
        transition={{ duration: 1.5, repeat: isRecording ? Infinity : 0 }}
      >
        {/* Microphone SVG */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${currentSize.svg} relative z-20`}
        >
          <defs>
            <linearGradient id="mic-body-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colorPalette.divine} />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 0.9)" />
              <stop offset="100%" stopColor="rgba(255, 248, 220, 0.8)" />
            </linearGradient>
            <filter id="mic-glow-effect">
              <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Microphone Body */}
          <motion.path
            d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z"
            fill="url(#mic-body-gradient)"
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="0.5"
            filter="url(#mic-glow-effect)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          />
          
          {/* Microphone Stand */}
          <motion.path
            d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v4M8 23h8"
            stroke="url(#mic-body-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#mic-glow-effect)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
          />
          
          {/* Recording State Indicator */}
          <AnimatePresence>
            {isRecording && (
              <motion.circle
                cx="12"
                cy="8"
                r="2"
                fill="#DC2626"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.7, 1]
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity 
                }}
              />
            )}
          </AnimatePresence>
          
          {/* Listening State Indicator */}
          <AnimatePresence>
            {isListening && (
              <motion.circle
                cx="12"
                cy="8"
                r="1.5"
                fill="#059669"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ 
                  duration: 0.8, 
                  repeat: Infinity 
                }}
              />
            )}
          </AnimatePresence>
        </svg>

        {/* Processing State */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-3 h-3 border-2 border-white rounded-full border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Divine Energy Waves */}
      <AnimatePresence>
        {(isRecording || isListening) && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={`energy-wave-${index}`}
                className="absolute inset-0 border-2 rounded-full"
                style={{
                  borderColor: `${colorPalette.accent}30`
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: [0.8, 1.8, 2.2],
                  opacity: [0, 0.6, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.6,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
