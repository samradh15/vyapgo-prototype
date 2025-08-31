'use client';

import React from 'react';

interface AppPreviewProps {
  currentStage: 'analyzing' | 'planning' | 'building' | 'complete';
  progress: number;
}

export const AppPreview: React.FC<AppPreviewProps> = ({
  currentStage,
  progress
}) => {
  return (
    <div className="app-preview">
      <div className="preview-header">
        <h3>App Preview</h3>
        <div className="preview-status">
          {currentStage} - {progress}%
        </div>
      </div>
      <div className="preview-content">
        <div className="preview-placeholder">
          {currentStage === 'analyzing' && 'Analyzing requirements...'}
          {currentStage === 'planning' && 'Planning architecture...'}
          {currentStage === 'building' && 'Building application...'}
          {currentStage === 'complete' && 'App ready for preview'}
        </div>
      </div>
    </div>
  );
};
