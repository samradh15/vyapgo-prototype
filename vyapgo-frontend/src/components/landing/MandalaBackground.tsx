'use client';

import React from 'react';

export const MandalaBackground: React.FC = () => {
  // Pre-calculate all coordinates to avoid server-client mismatch
  const petalCoordinates = React.useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i * 30) * (Math.PI / 180);
      const x1 = Math.round(Math.cos(angle) * 240 * 1000) / 1000; // Round to 3 decimal places
      const y1 = Math.round(Math.sin(angle) * 240 * 1000) / 1000;
      const x2 = Math.round(Math.cos(angle) * 360 * 1000) / 1000;
      const y2 = Math.round(Math.sin(angle) * 360 * 1000) / 1000;
      
      return { x1, y1, x2, y2 };
    });
  }, []);

  return (
    <>
      {/* Bigger Simple Clean Golden Rotating Chakra */}
      <div className="chakra-full-center">
        <svg width="100vw" height="100vh" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="simpleGold" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>
          </defs>
          
          <g transform="translate(500, 500)">
            {/* Bigger Outer Circles */}
            <circle cx="0" cy="0" r="456" fill="none" stroke="url(#simpleGold)" strokeWidth="3" opacity="0.25" />
            <circle cx="0" cy="0" r="384" fill="none" stroke="url(#simpleGold)" strokeWidth="2" opacity="0.3" />
            
            {/* 12 Bigger Petals - Using pre-calculated coordinates */}
            {petalCoordinates.map((coords, i) => (
              <g key={`petal-${i}`}>
                <line 
                  x1={coords.x1} 
                  y1={coords.y1} 
                  x2={coords.x2} 
                  y2={coords.y2} 
                  stroke="url(#simpleGold)" 
                  strokeWidth="3" 
                  opacity="0.35"
                />
                <circle cx={coords.x2} cy={coords.y2} r="6" fill="url(#simpleGold)" opacity="0.3" />
              </g>
            ))}
            
            {/* Bigger Inner Circle */}
            <circle cx="0" cy="0" r="180" fill="none" stroke="url(#simpleGold)" strokeWidth="2" opacity="0.4" />
            
            {/* Bigger Sacred Triangles - Fixed coordinates */}
            <polygon 
              points="0,-96 82.276,48 -82.276,48" 
              fill="none" 
              stroke="url(#simpleGold)" 
              strokeWidth="2" 
              opacity="0.35" 
            />
            <polygon 
              points="0,96 -82.276,-48 82.276,-48" 
              fill="none" 
              stroke="url(#simpleGold)" 
              strokeWidth="2" 
              opacity="0.35" 
            />
            
            {/* Bigger Central Bindu */}
            <circle cx="0" cy="0" r="24" fill="url(#simpleGold)" opacity="0.4" />
            <circle cx="0" cy="0" r="12" fill="#fbbf24" opacity="0.5" />
          </g>
        </svg>
      </div>
    </>
  );
};
