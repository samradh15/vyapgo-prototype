'use client';

import React from 'react';

interface VyapYantraLogoProps {
  size?: number;
  variant?: 'minimal' | 'header' | 'detailed';
}

/**
 * Self-contained golden VyapYantra logo.
 * No CSS dependencies, always golden, works on any background.
 */
export const VyapYantraLogo: React.FC<VyapYantraLogoProps> = ({
  size = 40,
  variant = 'header',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    aria-label="VyapYantra Logo"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      display: 'block',
      minWidth: size,
      minHeight: size,
      background: 'none',
      borderRadius: '50%',
    }}
  >
    <defs>
      <radialGradient id="vyapyantra-bg" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor="#fffbe7" />
        <stop offset="62%" stopColor="#fff3b0" />
        <stop offset="100%" stopColor="#fcd34d" />
      </radialGradient>
      <linearGradient id="vyapyantra-gold" x1="0%" y1="10%" x2="100%" y2="90%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="65%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      <linearGradient id="vyapyantra-dark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#b45309" />
        <stop offset="90%" stopColor="#92400e" />
      </linearGradient>
    </defs>
    {/* Outer frame */}
    <circle
      cx="32"
      cy="32"
      r="30"
      fill="url(#vyapyantra-bg)"
      stroke="url(#vyapyantra-gold)"
      strokeWidth="3"
    />
    {/* Chakra mark (sunburst rays, except minimal) */}
    {variant !== 'minimal' && (
      <>
        {[...Array(8)].map((_, i) => (
          <rect
            key={i}
            x="30"
            y="8"
            rx="1.8"
            width="4"
            height="16"
            fill="url(#vyapyantra-gold)"
            opacity={0.74}
            transform={`rotate(${i * 45} 32 32)`}
          />
        ))}
        <circle
          cx="32"
          cy="32"
          r="11"
          fill="url(#vyapyantra-gold)"
          stroke="url(#vyapyantra-dark)"
          strokeWidth="1.7"
        />
      </>
    )}
    {/* Always present central dot */}
    <circle
      cx="32"
      cy="32"
      r="4"
      fill="#fffbe7"
      stroke="url(#vyapyantra-gold)"
      strokeWidth="1.1"
    />
  </svg>
);
