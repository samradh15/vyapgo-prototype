'use client';

import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section className="space-y-8 vyap-fade-in">
      {/* Hindi Text with Premium Typography */}
      <h2 className="text-5xl md:text-6xl lg:text-7xl leading-tight vyap-hindi-heading">
        आपका अपना ऐप
      </h2>
      
      {/* English Text with Premium Typography */}
      <div className="space-y-6">
        <h3 className="text-3xl md:text-4xl lg:text-5xl tracking-wide vyap-english-heading">
          Make your own app with VyapYantra
        </h3>
        
        <p className="text-lg md:text-xl max-w-2xl mx-auto vyap-description">
          Transform your business idea into a professional mobile app using the power of AI and voice technology
        </p>
      </div>
    </section>
  );
};
