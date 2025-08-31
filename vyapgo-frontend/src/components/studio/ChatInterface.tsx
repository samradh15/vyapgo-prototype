'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/components/studio/ChatMessage';
import { ChatInput } from '@/components/studio/ChatInput';
import { TypingIndicator } from '@/components/studio/TypingIndicator';
import { useAIChat } from '@/hooks/useAIChat';
import { LoadingSpinner } from '@/components/icons/LoadingSpinner';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  language?: 'hindi' | 'english' | 'mixed';
  appFeatures?: string[];
  isThinking?: boolean;
}

interface ChatInterfaceProps {
  businessIdea: string;
  language: 'hindi' | 'english';
  onStepChange: (step: 'ideaReview' | 'chatting' | 'appBuilding' | 'completed') => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  businessIdea, 
  language, 
  onStepChange 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // AI Chat Integration
  const aiChat = useAIChat({
    onMessage: (content: string, features?: string[]) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content,
        timestamp: new Date(),
        appFeatures: features
      };
      setMessages(prev => [...prev, newMessage]);
    },
    onError: (error: string) => {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'system',
        content: `Error: ${error}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    },
    onAppBuildingStart: () => {
      onStepChange('appBuilding');
    }
  });

  // Initialize chat with welcome message
  useEffect(() => {
    if (!isInitialized) {
      const welcomeMessage = language === 'hindi' 
        ? `नमस्कार! मैं आपका AI सहायक हूं। आपका व्यावसायिक विचार बहुत दिलचस्प है। आइए इसे एक शानदार मोबाइल ऐप में बदलते हैं!\n\nपहले मुझे बताएं कि आपके ऐप के मुख्य उपयोगकर्ता कौन होंगे?`
        : `Hello! I'm your AI assistant. Your business idea is fascinating. Let's transform it into an amazing mobile app!\n\nFirst, tell me who will be the main users of your app?`;

      const initialMessage: Message = {
        id: 'welcome',
        type: 'ai',
        content: welcomeMessage,
        timestamp: new Date()
      };

      const businessSummary: Message = {
        id: 'business-summary',
        type: 'system',
        content: `Business Idea: "${businessIdea}"`,
        timestamp: new Date()
      };

      setMessages([businessSummary, initialMessage]);
      setIsInitialized(true);
    }
  }, [businessIdea, language, isInitialized]);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
      language: content.match(/[\u0900-\u097F]/) ? 'hindi' : 'english'
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Send to AI with business context
    await aiChat.sendMessage(content, {
      businessIdea,
      language,
      previousMessages: messages.slice(-5) // Last 5 messages for context
    });
  }, [aiChat, businessIdea, language, messages]);

  return (
    <div className="vyap-chat-interface">
      {/* Chat Header */}
      <div className="vyap-chat-header">
        <div className="vyap-chat-ai-info">
          <div className="vyap-ai-avatar">
            <div className="vyap-ai-logo">🤖</div>
          </div>
          <div className="vyap-ai-details">
            <h3>VyapYantra AI Assistant</h3>
            <p className="vyap-ai-status">
              <span className="vyap-status-dot vyap-online"></span>
              {language === 'hindi' ? 'ऑनलाइन और तैयार' : 'Online and Ready'}
            </p>
          </div>
        </div>
        
        <div className="vyap-chat-actions">
          <button className="vyap-chat-action" title="Clear Chat">
            🗑️
          </button>
          <button className="vyap-chat-action" title="Export Chat">
            📤
          </button>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="vyap-chat-container" ref={chatContainerRef}>
        <div className="vyap-chat-messages">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              language={language}
            />
          ))}
          
          {aiChat.isTyping && (
            <TypingIndicator language={language} />
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <div className="vyap-chat-input-container">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={aiChat.isLoading}
          language={language}
          placeholder={
            language === 'hindi'
              ? 'अपना जवाब यहाँ टाइप करें...'
              : 'Type your answer here...'
          }
        />
      </div>

      {/* Chat Progress Indicator */}
      {messages.length > 2 && (
        <div className="vyap-chat-progress">
          <div className="vyap-progress-bar">
            <div 
              className="vyap-progress-fill"
              style={{ width: `${Math.min((messages.length - 2) * 10, 100)}%` }}
            />
          </div>
          <span className="vyap-progress-text">
            {language === 'hindi' 
              ? `ऐप डिज़ाइन ${Math.min((messages.length - 2) * 10, 100)}% पूर्ण`
              : `App design ${Math.min((messages.length - 2) * 10, 100)}% complete`
            }
          </span>
        </div>
      )}
    </div>
  );
};
