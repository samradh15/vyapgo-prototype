'use client';

import React from 'react';

interface StudioLayoutProps {
  children: React.ReactNode;
}

export const StudioLayout: React.FC<StudioLayoutProps> = ({ children }) => {
  return (
    <div className="vyap-studio-layout">
      {/* HEADER SECTION REMOVED */}

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
