'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowIcon } from '@/components/icons/ArrowIcon';

interface BusinessIdeaCardProps {
  businessIdea: string;
  language: 'hindi' | 'english';
  onStartChat: () => void;
}

export const BusinessIdeaCard: React.FC<BusinessIdeaCardProps> = ({ 
  businessIdea, 
  language, 
  onStartChat 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getGreeting = () => {
    return language === 'hindi' 
      ? 'आपका व्यावसायिक विचार'
      : 'Your Business Idea';
  };

  const getDescription = () => {
    return language === 'hindi'
      ? 'हमारे AI असिस्टेंट के साथ इस विचार को एक पूर्ण मोबाइल ऐप में बदलें।'
      : 'Transform this idea into a complete mobile app with our AI assistant.';
  };

  const getStartButtonText = () => {
    return language === 'hindi'
      ? 'AI के साथ ऐप बनाना शुरू करें'
      : 'Start Building App with AI';
  };

  return (
    <div className="vyap-business-idea-card">
      {/* Card Header */}
      <div className="vyap-idea-header">
        <div className="vyap-idea-icon">
          <div className="vyap-bulb-icon">💡</div>
        </div>
        <div className="vyap-idea-title">
          <h2>{getGreeting()}</h2>
          <p>{getDescription()}</p>
        </div>
      </div>

      {/* Business Idea Content */}
      <div className="vyap-idea-content">
        <div className={`vyap-idea-text ${isExpanded ? 'expanded' : ''}`}>
          {businessIdea}
        </div>
        
        {businessIdea.length > 200 && (
          <button 
            className="vyap-idea-expand"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        )}

        {/* Idea Metadata */}
        <div className="vyap-idea-metadata">
          <div className="vyap-metadata-item">
            <span className="vyap-metadata-label">Language:</span>
            <span className="vyap-metadata-value">
              {language === 'hindi' ? 'हिंदी' : 'English'}
            </span>
          </div>
          <div className="vyap-metadata-item">
            <span className="vyap-metadata-label">Type:</span>
            <span className="vyap-metadata-value">Business Concept</span>
          </div>
          <div className="vyap-metadata-item">
            <span className="vyap-metadata-label">Status:</span>
            <span className="vyap-metadata-value vyap-status-ready">Ready to Build</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="vyap-idea-actions">
        <Button
          variant="outline"
          size="lg"
          onClick={() => window.history.back()}
          leftIcon={<ArrowIcon direction="left" size={18} />}
        >
          {language === 'hindi' ? 'वापस जाएं' : 'Go Back'}
        </Button>
        
        <Button
          variant="primary"
          size="lg"
          onClick={onStartChat}
          rightIcon={<ArrowIcon size={18} />}
          className="vyap-start-chat-btn"
        >
          {getStartButtonText()}
        </Button>
      </div>

      {/* AI Capability Preview */}
      <div className="vyap-ai-preview">
        <div className="vyap-ai-preview-header">
          <h4>What our AI will help you build:</h4>
        </div>
        <div className="vyap-ai-features">
          <div className="vyap-ai-feature">
            <div className="vyap-feature-icon">📱</div>
            <span>Mobile App Design</span>
          </div>
          <div className="vyap-ai-feature">
            <div className="vyap-feature-icon">⚡</div>
            <span>Feature Planning</span>
          </div>
          <div className="vyap-ai-feature">
            <div className="vyap-feature-icon">🎨</div>
            <span>UI/UX Wireframes</span>
          </div>
          <div className="vyap-ai-feature">
            <div className="vyap-feature-icon">💼</div>
            <span>Business Plan</span>
          </div>
        </div>
      </div>
    </div>
  );
};
