'use client';

import React, { useId } from 'react';
import { motion } from 'framer-motion';
import { YantraConfiguration, SacredColorPalette } from '@/types/yantra.types';
import { YANTRA_THEMES, ANIMATION_CONFIG } from '@/lib/yantra-config';

interface SacredGeometryProps {
  pattern: YantraConfiguration['pattern'];
  size?: number;
  theme?: keyof typeof YANTRA_THEMES;
  animated?: boolean;
  className?: string;
  opacity?: number;
}

export const SacredGeometry: React.FC<SacredGeometryProps> = ({
  pattern,
  size = 120,
  theme = 'SACRED_SAFFRON',
  animated = true,
  className = '',
  opacity = 1
}) => {
  const colorPalette = YANTRA_THEMES[theme];
  
  // ✅ FIXED: Stable IDs using useId()
  const uid = useId();
  const gradientId = `${pattern}-gradient-${uid}`;
  const filterId = `${pattern}-glow-${uid}`;

  // ✅ FIXED: Pre-calculated stable coordinates to prevent hydration mismatches
  const petalCoordinates = React.useMemo(() => {
    return Array.from({ length: 16 }, (_, index) => {
      const angle = (index * 22.5) * (Math.PI / 180);
      const x1 = Math.round((100 + Math.cos(angle) * 75) * 1000) / 1000;
      const y1 = Math.round((100 + Math.sin(angle) * 75) * 1000) / 1000;
      const x2 = Math.round((100 + Math.cos(angle) * 85) * 1000) / 1000;
      const y2 = Math.round((100 + Math.sin(angle) * 85) * 1000) / 1000;
      return { x1, y1, x2, y2, index };
    });
  }, []);

  const mandalaCoordinates = React.useMemo(() => {
    return Array.from({ length: 12 }, (_, index) => {
      const angle = (index * 30) * (Math.PI / 180);
      const x1 = Math.round((100 + Math.cos(angle) * 40) * 1000) / 1000;
      const y1 = Math.round((100 + Math.sin(angle) * 40) * 1000) / 1000;
      const x2 = Math.round((100 + Math.cos(angle) * 60) * 1000) / 1000;
      const y2 = Math.round((100 + Math.sin(angle) * 60) * 1000) / 1000;
      return { x1, y1, x2, y2, index };
    });
  }, []);

  const renderShriYantra = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={colorPalette.divine} />
          <stop offset="30%" stopColor={colorPalette.primary} />
          <stop offset="70%" stopColor={colorPalette.accent} />
          <stop offset="100%" stopColor={colorPalette.grounding} />
        </radialGradient>
        <filter id={filterId}>
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <circle
        cx="100"
        cy="100" 
        r="95"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        filter={`url(#${filterId})`}
      />
      
      {petalCoordinates.map(({ x1, y1, x2, y2, index }) => (
        <motion.path
          key={`outer-petal-${index}`}
          d={`M100,100 Q${x2},${y2} ${x1},${y1} Q${x2 + 3},${y2 + 3} 100,100`}
          fill={`url(#${gradientId})`}
          stroke={colorPalette.primary}
          strokeWidth="0.5"
          opacity="0.8"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.8 }}
          transition={{ 
            delay: index * 0.05, 
            duration: 0.6,
            ease: "easeOut"
          }}
        />
      ))}
      
      <motion.polygon
        points="100,50 130,110 70,110"
        fill="none"
        stroke={colorPalette.accent}
        strokeWidth="2"
        filter={`url(#${filterId})`}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
      />
      <motion.polygon
        points="100,150 70,90 130,90"
        fill="none"
        stroke={colorPalette.accent}
        strokeWidth="2"
        filter={`url(#${filterId})`}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.2 }}
      />
      
      <motion.circle
        cx="100"
        cy="100"
        r="4"
        fill={colorPalette.primary}
        filter={`url(#${filterId})`}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.3, 1] }}
        transition={{ duration: 1, delay: 2 }}
      />
    </svg>
  );

  const renderLotus = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <radialGradient id={gradientId}>
          <stop offset="0%" stopColor={colorPalette.divine} />
          <stop offset="60%" stopColor={colorPalette.primary} />
          <stop offset="100%" stopColor={colorPalette.secondary} />
        </radialGradient>
      </defs>
      
      {Array.from({ length: 8 }, (_, index) => {
        const angle = index * 45;
        const x = Math.round((100 + Math.cos((angle * Math.PI) / 180) * 55) * 100) / 100;
        const y = Math.round((100 + Math.sin((angle * Math.PI) / 180) * 55) * 100) / 100;
        
        return (
          <motion.ellipse
            key={`lotus-petal-${index}`}
            cx={x}
            cy={y}
            rx="18"
            ry="35"
            fill={`url(#${gradientId})`}
            stroke={colorPalette.accent}
            strokeWidth="1"
            opacity="0.9"
            transform={`rotate(${angle} ${x} ${y})`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.9 }}
            transition={{ 
              delay: index * 0.15, 
              duration: 0.8,
              ease: "easeOut"
            }}
          />
        );
      })}
      
      <circle 
        cx="100" 
        cy="100" 
        r="22" 
        fill={colorPalette.primary} 
        stroke={colorPalette.accent} 
        strokeWidth="2" 
      />
    </svg>
  );

  const renderOm = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colorPalette.primary} />
          <stop offset="50%" stopColor={colorPalette.accent} />
          <stop offset="100%" stopColor={colorPalette.secondary} />
        </linearGradient>
        <filter id={filterId}>
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <motion.text
        x="100"
        y="130"
        textAnchor="middle"
        fontSize="72"
        fill={`url(#${gradientId})`}
        fontFamily="Sanskrit 2003, Noto Sans Devanagari, serif"
        filter={`url(#${filterId})`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        ॐ
      </motion.text>
    </svg>
  );

  const renderMandala = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <radialGradient id={gradientId}>
          <stop offset="0%" stopColor={colorPalette.divine} />
          <stop offset="40%" stopColor={colorPalette.primary} />
          <stop offset="80%" stopColor={colorPalette.accent} />
          <stop offset="100%" stopColor={colorPalette.grounding} />
        </radialGradient>
      </defs>
      
      {[30, 50, 70, 90].map((radius, index) => (
        <motion.circle
          key={`mandala-circle-${index}`}
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="1.5"
          opacity="0.7"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ 
            delay: index * 0.2, 
            duration: 0.8,
            ease: "easeOut"
          }}
        />
      ))}
      
      {mandalaCoordinates.map(({ x1, y1, x2, y2, index }) => (
        <motion.line
          key={`mandala-ray-${index}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={colorPalette.primary}
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ 
            delay: 1 + index * 0.05, 
            duration: 0.5
          }}
        />
      ))}
    </svg>
  );

  const renderPattern = () => {
    switch (pattern) {
      case 'shriyantra':
        return renderShriYantra();
      case 'lotus':
        return renderLotus();
      case 'om':
        return renderOm();
      case 'mandala':
        return renderMandala();
      default:
        return renderShriYantra();
    }
  };

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size, opacity }}
      animate={animated && pattern !== 'om' ? { rotate: 360 } : {}}
      transition={{
        duration: ANIMATION_CONFIG.yantraRotation.duration / 1000,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      {renderPattern()}
    </motion.div>
  );
};
