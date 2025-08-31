'use client';

import React from 'react';
import { VyapYantraLogo } from '@/components/icons/VyapYantraLogo';

interface StudioSidebarProps {
  currentStep: 'ideaReview' | 'chatting' | 'appBuilding' | 'completed';
  onStepChange: (step: 'ideaReview' | 'chatting' | 'appBuilding' | 'completed') => void;
  businessIdea: string;
  language: 'hindi' | 'english';
}

export const StudioSidebar: React.FC<StudioSidebarProps> = ({ 
  currentStep, 
  onStepChange, 
  businessIdea, 
  language 
}) => {
  const steps = [
    {
      id: 'ideaReview',
      title: 'Idea Review',
      titleHindi: 'विचार समीक्षा',
      description: 'Review your business concept',
      icon: '💡'
    },
    {
      id: 'chatting',
      title: 'AI Consultation',
      titleHindi: 'AI सलाह',
      description: 'Chat with AI assistant',
      icon: '🤖'
    },
    {
      id: 'appBuilding',
      title: 'App Building',
      titleHindi: 'ऐप निर्माण',
      description: 'Generating your app',
      icon: '⚡'
    },
    {
      id: 'completed',
      title: 'Completed',
      titleHindi: 'पूर्ण',
      description: 'Ready for export',
      icon: '✅'
    }
  ] as const;

  const getStepStatus = (stepId: string) => {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="vyap-studio-sidebar">
      {/* Sidebar Header */}
      <div className="vyap-sidebar-header">
        <VyapYantraLogo variant="minimal" size={24} />
        <div className="vyap-sidebar-title">
          <h3>App Builder</h3>
          <p>AI-Powered Studio</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="vyap-progress-section">
        <h4 className="vyap-progress-title">
          {language === 'hindi' ? 'प्रगति' : 'Progress'}
        </h4>
        <div className="vyap-progress-steps">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`vyap-progress-step ${getStepStatus(step.id)}`}
              onClick={() => onStepChange(step.id as any)}
            >
              <div className="vyap-step-indicator">
                <div className="vyap-step-icon">
                  {getStepStatus(step.id) === 'completed' ? '✓' : step.icon}
                </div>
                <div className="vyap-step-line"></div>
              </div>
              <div className="vyap-step-content">
                <h5>{language === 'hindi' ? step.titleHindi : step.title}</h5>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Business Overview */}
      <div className="vyap-business-overview">
        <h4>
          {language === 'hindi' ? 'व्यावसायिक अवलोकन' : 'Business Overview'}
        </h4>
        <div className="vyap-business-summary">
          <div className="vyap-business-text">
            {businessIdea.substring(0, 100)}
            {businessIdea.length > 100 && '...'}
          </div>
          <div className="vyap-business-stats">
            <div className="vyap-stat">
              <span className="vyap-stat-label">Language:</span>
              <span className="vyap-stat-value">
                {language === 'hindi' ? 'हिंदी' : 'English'}
              </span>
            </div>
            <div className="vyap-stat">
              <span className="vyap-stat-label">Mode:</span>
              <span className="vyap-stat-value">AI-Assisted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="vyap-quick-actions">
        <button className="vyap-quick-action">
          <span className="vyap-action-icon">💾</span>
          <span>Save Progress</span>
        </button>
        <button className="vyap-quick-action">
          <span className="vyap-action-icon">📤</span>
          <span>Export</span>
        </button>
        <button className="vyap-quick-action vyap-action-danger">
          <span className="vyap-action-icon">🔄</span>
          <span>Start Over</span>
        </button>
      </div>
    </div>
  );
};
