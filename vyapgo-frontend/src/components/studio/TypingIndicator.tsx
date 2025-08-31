'use client';

import React from 'react';
import { VyapYantraLogo } from '@/components/icons/VyapYantraLogo';

interface TypingIndicatorProps {
  language: 'hindi' | 'english';
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ language }) => {
  return (
    <div className="vyap-message vyap-ai-message vyap-typing-message">
      {/* AI Avatar */}
      <div className="vyap-message-avatar">
        <div className="vyap-ai-avatar">
          <VyapYantraLogo variant="minimal" size={24} />
        </div>
      </div>

      {/* Typing Content */}
      <div className="vyap-message-wrapper">
        <div className="vyap-message-header">
          <span className="vyap-message-sender">VyapYantra AI</span>
          <span className="vyap-typing-status">
            {language === 'hindi' ? 'सोच रहा है...' : 'Thinking...'}
          </span>
        </div>

        <div className="vyap-typing-indicator">
          <div className="vyap-typing-dots">
            <div className="vyap-typing-dot"></div>
            <div className="vyap-typing-dot"></div>
            <div className="vyap-typing-dot"></div>
          </div>
          <span className="vyap-typing-text">
            {language === 'hindi' 
              ? 'AI आपके ऐप के लिए सुझाव तैयार कर रहा है...'
              : 'AI is preparing suggestions for your app...'
            }
          </span>
        </div>
      </div>
    </div>
  );
};
