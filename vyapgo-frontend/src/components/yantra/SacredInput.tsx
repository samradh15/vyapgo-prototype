'use client';

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { YANTRA_THEMES, SANSKRIT_TYPOGRAPHY } from '@/lib/yantra-config';

interface SacredInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  theme?: keyof typeof YANTRA_THEMES;
  mantra?: string;
  sacred?: boolean;
}

export const SacredInput = forwardRef<HTMLTextAreaElement, SacredInputProps>(
  ({ 
    theme = 'SACRED_SAFFRON', 
    mantra, 
    sacred = true, 
    className = '', 
    ...props 
  }, ref) => {
    const colorPalette = YANTRA_THEMES[theme];

    return (
      <motion.div 
        className="relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Sacred Geometric Border */}
        <div className="absolute inset-0 rounded-3xl">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 400 160"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="sacred-border-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colorPalette.primary} />
                <stop offset="50%" stopColor={colorPalette.accent} />
                <stop offset="100%" stopColor={colorPalette.secondary} />
              </linearGradient>
              <filter id="sacred-border-glow">
                <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Main Border Path */}
            <motion.path
              d="M20,20 Q200,10 380,20 Q390,80 380,140 Q200,150 20,140 Q10,80 20,20 Z"
              fill="none"
              stroke="url(#sacred-border-gradient)"
              strokeWidth="2"
              filter="url(#sacred-border-glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
            />
            
            {/* Corner Sacred Elements */}
            {[
              { x: 25, y: 25, delay: 1 },
              { x: 375, y: 25, delay: 1.2 },
              { x: 375, y: 135, delay: 1.4 },
              { x: 25, y: 135, delay: 1.6 }
            ].map((corner, index) => (
              <motion.g key={`corner-${index}`}>
                <motion.circle
                  cx={corner.x}
                  cy={corner.y}
                  r="4"
                  fill={colorPalette.primary}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: corner.delay, duration: 0.5 }}
                />
                <motion.circle
                  cx={corner.x}
                  cy={corner.y}
                  r="8"
                  fill="none"
                  stroke={colorPalette.accent}
                  strokeWidth="0.5"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.6 }}
                  transition={{ delay: corner.delay + 0.2, duration: 0.5 }}
                />
              </motion.g>
            ))}
          </svg>
        </div>

        {/* Sacred Input Field */}
        <textarea
          ref={ref}
          className={`
            w-full relative z-10 bg-gradient-to-br from-amber-50/95 to-orange-50/95
            backdrop-blur-sm text-gray-800 text-lg leading-relaxed
            px-8 py-6 pr-20 resize-none focus:outline-none
            placeholder:text-amber-700/60 placeholder:font-normal
            min-h-[100px] max-h-[200px] overflow-y-auto
            font-medium rounded-3xl border-2 border-transparent
            transition-all duration-500 ease-out
            focus:border-orange-300/50 focus:shadow-xl focus:shadow-orange-200/20
            selection:bg-orange-200/40
            ${className}
          `}
          style={{
            fontFamily: SANSKRIT_TYPOGRAPHY.secondary,
            backgroundImage: `linear-gradient(135deg, 
              rgba(255, 248, 220, 0.95) 0%, 
              rgba(255, 237, 213, 0.95) 50%, 
              rgba(254, 215, 170, 0.95) 100%
            )`
          }}
          {...props}
        />

        {/* Sacred Mantra Text */}
        {mantra && (
          <motion.div
            className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 1 }}
          >
            <p 
              className="text-xs text-amber-600/70 font-medium tracking-wide"
              style={{ fontFamily: SANSKRIT_TYPOGRAPHY.sacred }}
            >
              {mantra}
            </p>
          </motion.div>
        )}

        {/* Enhanced Scrollbar Styles */}
        <style jsx>{`
          textarea::-webkit-scrollbar {
            width: 6px;
          }
          textarea::-webkit-scrollbar-track {
            background: rgba(254, 215, 170, 0.3);
            border-radius: 3px;
          }
          textarea::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, ${colorPalette.primary}, ${colorPalette.accent});
            border-radius: 3px;
            transition: all 0.3s ease;
          }
          textarea::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, ${colorPalette.accent}, ${colorPalette.secondary});
          }
          
          @media (max-width: 768px) {
            textarea {
              font-size: 16px;
              padding: 1.25rem;
            }
          }
        `}</style>
      </motion.div>
    );
  }
);

SacredInput.displayName = 'SacredInput';
