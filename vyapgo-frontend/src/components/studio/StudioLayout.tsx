'use client';

import React from 'react';
import { VyapYantraLogo } from '@/components/icons/VyapYantraLogo';
import { ArrowIcon } from '@/components/icons/ArrowIcon';
import Link from 'next/link';

interface StudioLayoutProps {
  children: React.ReactNode;
}

export const StudioLayout: React.FC<StudioLayoutProps> = ({ children }) => {
  return (
    <div className="vyap-studio-layout">
      {/* Professional Header */}
      <header className="vyap-studio-header">
        <div className="vyap-studio-header-content">
          {/* Logo Section */}
          <div className="vyap-studio-header-left">
            <Link href="/" className="vyap-studio-logo-link">
              <VyapYantraLogo variant="header" size={32} />
              <span className="vyap-studio-logo-text">VyapYantra Studio</span>
            </Link>
            <div className="vyap-studio-beta-badge">AI Beta</div>
          </div>

          {/* Navigation Actions */}
          <div className="vyap-studio-header-right">
            <button className="vyap-studio-header-btn vyap-secondary">
              <span>Save Progress</span>
            </button>
            <button className="vyap-studio-header-btn vyap-primary">
              <span>Export App</span>
              <ArrowIcon size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Content */}
      <main className="vyap-studio-content">
        {children}
      </main>

      {/* Professional Footer */}
      <footer className="vyap-studio-footer">
        <div className="vyap-studio-footer-content">
          <span className="vyap-studio-footer-text">
            Powered by VyapYantra AI • Creating the future of app development
          </span>
          <div className="vyap-studio-footer-status">
            <div className="vyap-studio-status-dot vyap-online"></div>
            <span>AI Assistant Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
