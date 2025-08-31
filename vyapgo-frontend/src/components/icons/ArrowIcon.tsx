'use client';

import React from 'react';

interface ArrowIconProps {
  className?: string;
  size?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const ArrowIcon: React.FC<ArrowIconProps> = ({ 
  className = '', 
  size = 20,
  direction = 'right'
}) => {
  const getRotation = () => {
    switch (direction) {
      case 'up': return 'rotate(-90deg)';
      case 'down': return 'rotate(90deg)';
      case 'left': return 'rotate(180deg)';
      default: return 'rotate(0deg)';
    }
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 20 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`vyap-arrow-icon ${className}`}
      style={{ transform: getRotation() }}
      role="img"
      aria-label={`Arrow ${direction}`}
    >
      <path
        d="M7.5 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};
