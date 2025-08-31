'use client';

import React from 'react';

interface ChatPanelProps {
  businessIdea: string;
  currentStage: 'analyzing' | 'planning' | 'building' | 'complete';
  progress: number;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  businessIdea,
  currentStage,
  progress
}) => {
  return (
    <div className="chat-panel">
      <div className="chat-header">
        <h3>VyapYantra Assistant</h3>
        <div className="stage-indicator">
          {currentStage} - {progress}%
        </div>
      </div>
      <div className="chat-messages">
        <div className="message system">
          Analyzing your business idea: {businessIdea}
        </div>
      </div>
    </div>
  );
};
