'use client';

import React from 'react';

interface MicrophoneIconProps {
  className?: string;
  size?: number;
  state?: 'idle' | 'recording' | 'processing' | 'error';
}

export const MicrophoneIcon: React.FC<MicrophoneIconProps> = ({ 
  className = '', 
  size = 24,
  state = 'idle'
}) => {
  const getStateColor = () => {
    switch (state) {
      case 'recording':
        return '#ef4444'; // Red
      case 'processing':
        return '#3b82f6'; // Blue
      case 'error':
        return '#f87171'; // Light red
      default:
        return 'currentColor'; // Default
    }
  };

  const getAnimation = () => {
    switch (state) {
      case 'recording':
        return 'vyap-mic-pulse 1.5s ease-in-out infinite';
      case 'processing':
        return 'vyap-mic-spin 1s linear infinite';
      case 'error':
        return 'vyap-mic-shake 0.5s ease-in-out';
      default:
        return 'none';
    }
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`vyap-mic-icon ${className}`}
      role="img"
      aria-label={`Microphone ${state}`}
      style={{ 
        color: getStateColor(),
        animation: getAnimation()
      }}
    >
      <defs>
        <linearGradient id="micGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      
      {/* Microphone Body */}
      <path 
        d="M12 1a4 4 0 0 0-4 4v6a4 4 0 0 0 8 0V5a4 4 0 0 0-4-4z" 
        fill="url(#micGradient)"
        stroke="currentColor" 
        strokeWidth="0.5" 
      />
      
      {/* Microphone Stand/Base */}
      <path 
        d="M19 10v1a7 7 0 0 1-14 0v-1" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Base Lines */}
      <line 
        x1="12" y1="19" x2="12" y2="23" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
      <line 
        x1="8" y1="23" x2="16" y2="23" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
      
      {/* State-specific elements */}
      {state === 'recording' && (
        <circle cx="12" cy="6" r="2" fill="#ef4444" opacity="0.8" className="vyap-rec-indicator" />
      )}
      
      {state === 'processing' && (
        <g>
          <circle cx="12" cy="6" r="3" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
          <circle cx="12" cy="6" r="1" fill="#3b82f6" opacity="0.8" />
        </g>
      )}
    </svg>
  );
};
