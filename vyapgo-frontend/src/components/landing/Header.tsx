'use client';

import React from 'react';
import { VyapYantraLogo } from '@/components/icons/VyapYantraLogo';

export const Header: React.FC = () => {
  return (
    <header className="absolute top-6 left-6 z-20">
      <div className="flex items-center space-x-3">
        <VyapYantraLogo size={32} />
        <h1 className="text-2xl font-bold tracking-wide vyap-header-text text-amber-400">
          VyapYantra
        </h1>
      </div>
    </header>
  );
};
