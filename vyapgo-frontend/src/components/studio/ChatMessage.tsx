'use client';

import React, { useState } from 'react';
import { VyapYantraLogo } from '@/components/icons/VyapYantraLogo';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  language?: 'hindi' | 'english' | 'mixed';
  appFeatures?: string[];
  isThinking?: boolean;
}

interface ChatMessageProps {
  message: Message;
  language: 'hindi' | 'english';
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, language }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderMessageContent = () => {
    const content = message.content;
    const isLong = content.length > 300;
    const displayContent = isLong && !isExpanded 
      ? content.substring(0, 300) + '...' 
      : content;

    return (
      <div className="vyap-message-content">
        <div className="vyap-message-text">
          {displayContent.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
        
        {isLong && (
          <button 
            className="vyap-message-expand"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded 
              ? (language === 'hindi' ? 'कम दिखाएं' : 'Show Less')
              : (language === 'hindi' ? 'और दिखाएं' : 'Show More')
            }
          </button>
        )}

        {/* App Features Preview */}
        {message.appFeatures && message.appFeatures.length > 0 && (
          <div className="vyap-message-features">
            <h5>
              {language === 'hindi' ? 'सुझाए गए फीचर्स:' : 'Suggested Features:'}
            </h5>
            <div className="vyap-features-grid">
              {message.appFeatures.map((feature, index) => (
                <div key={index} className="vyap-feature-tag">
                  <span className="vyap-feature-icon">✨</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (message.type === 'system') {
    return (
      <div className="vyap-message vyap-system-message">
        <div className="vyap-system-content">
          <span className="vyap-system-icon">ℹ️</span>
          <span>{message.content}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`vyap-message ${message.type === 'user' ? 'vyap-user-message' : 'vyap-ai-message'}`}>
      {/* Avatar */}
      <div className="vyap-message-avatar">
        {message.type === 'user' ? (
          <div className="vyap-user-avatar">
            <span>👤</span>
          </div>
        ) : (
          <div className="vyap-ai-avatar">
            <VyapYantraLogo variant="minimal" size={24} />
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className="vyap-message-wrapper">
        <div className="vyap-message-header">
          <span className="vyap-message-sender">
            {message.type === 'user' 
              ? (language === 'hindi' ? 'आप' : 'You')
              : 'VyapYantra AI'
            }
          </span>
          <span className="vyap-message-time">
            {formatTime(message.timestamp)}
          </span>
          {message.language && (
            <span className="vyap-message-language">
              {message.language === 'hindi' ? 'हिं' : 'EN'}
            </span>
          )}
        </div>

        {renderMessageContent()}

        {/* Message Actions */}
        <div className="vyap-message-actions">
          <button className="vyap-message-action" title="Copy">
            📋
          </button>
          {message.type === 'ai' && (
            <>
              <button className="vyap-message-action" title="Regenerate">
                🔄
              </button>
              <button className="vyap-message-action" title="Like">
                👍
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
