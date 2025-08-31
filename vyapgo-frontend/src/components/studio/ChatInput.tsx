'use client';

import React, { useState, useRef, useCallback, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { MicrophoneIcon } from '@/components/icons/MicrophoneIcon';
import { ArrowIcon } from '@/components/icons/ArrowIcon';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  language: 'hindi' | 'english';
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  language,
  placeholder = 'Type your message...'
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Voice input integration
  const voice = useVoiceRecording({
    onComplete: (transcript) => {
      const currentValue = message.trim();
      const newValue = currentValue ? `${currentValue} ${transcript}` : transcript;
      setMessage(newValue);
      autoResize();
    },
    onError: (error) => {
      console.error('Voice input error:', error);
    }
  });

  // Auto-resize textarea
  const autoResize = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    autoResize();
  }, [autoResize]);

  const handleSendMessage = useCallback(() => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading) return;

    onSendMessage(trimmedMessage);
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [message, isLoading, onSendMessage]);

  const handleKeyPress = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleVoiceClick = useCallback(async () => {
    if (voice.isRecording) return;
    
    voice.clearError();
    voice.resetTranscript();
    
    // Detect language preference
    const hindiPattern = /[\u0900-\u097F]/;
    const preferredLanguage = hindiPattern.test(message) ? 'hi' : 
      (language === 'hindi' ? 'hi' : 'en');
    
    await voice.startRecording(preferredLanguage);
  }, [voice, message, language]);

  // Combine message and voice transcript
  const displayValue = voice.isRecording || voice.isProcessing ? 
    (message + (voice.transcript ? (message ? ' ' : '') + voice.transcript : '')).trim() : 
    message;

  return (
    <div className="vyap-chat-input">
      <div className="vyap-input-container">
        {/* Main Input */}
        <div className="vyap-input-wrapper">
          <textarea
            ref={textareaRef}
            value={displayValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="vyap-chat-textarea"
            rows={1}
            maxLength={2000}
            disabled={isLoading || voice.isRecording || voice.isProcessing}
          />
          
          {/* Character Counter */}
          <div className="vyap-char-counter">
            {displayValue.length}/2000
          </div>
        </div>

        {/* Voice Input Button */}
        {voice.isSupported && (
          <button
            onClick={handleVoiceClick}
            disabled={voice.isRecording || voice.isProcessing || isLoading}
            className={`vyap-chat-mic ${
              voice.isRecording ? 'vyap-recording' : 
              voice.isProcessing ? 'vyap-processing' : 
              voice.hasError ? 'vyap-error' : ''
            }`}
            title={
              voice.isRecording ? 'Recording...' :
              voice.isProcessing ? 'Processing...' : 
              'Click to speak'
            }
          >
            <MicrophoneIcon 
              size={20} 
              state={
                voice.hasError ? 'error' :
                voice.isProcessing ? 'processing' :
                voice.isRecording ? 'recording' : 'idle'
              } 
            />
          </button>
        )}

        {/* Send Button */}
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim() || isLoading}
          variant="primary"
          size="md"
          className="vyap-send-button"
          loading={isLoading}
          rightIcon={<ArrowIcon size={16} />}
        >
          {isLoading 
            ? (language === 'hindi' ? 'भेजा जा रहा...' : 'Sending...') 
            : (language === 'hindi' ? 'भेजें' : 'Send')
          }
        </Button>
      </div>

      {/* Voice Status */}
      {(voice.isRecording || voice.isProcessing || voice.hasError) && (
        <div className="vyap-voice-status">
          {voice.isRecording && (
            <div className="vyap-voice-recording">
              <div className="vyap-pulse-dot"></div>
              <span>
                {language === 'hindi' 
                  ? 'सुन रहे हैं...' 
                  : 'Listening...'
                }
              </span>
            </div>
          )}
          {voice.isProcessing && (
            <div className="vyap-voice-processing">
              <div className="vyap-spinner-small"></div>
              <span>
                {language === 'hindi' 
                  ? 'प्रोसेसिंग...' 
                  : 'Processing...'
                }
              </span>
            </div>
          )}
          {voice.hasError && (
            <div className="vyap-voice-error">
              <span>❌ {voice.errorMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* Input Suggestions */}
      <div className="vyap-input-suggestions">
        <div className="vyap-suggestion-chips">
          <button 
            className="vyap-suggestion-chip"
            onClick={() => setMessage(language === 'hindi' ? 'मुझे मदद चाहिए' : 'I need help')}
          >
            {language === 'hindi' ? 'मुझे मदद चाहिए' : 'I need help'}
          </button>
          <button 
            className="vyap-suggestion-chip"
            onClick={() => setMessage(language === 'hindi' ? 'अगला कदम?' : 'Next step?')}
          >
            {language === 'hindi' ? 'अगला कदम?' : 'Next step?'}
          </button>
          <button 
            className="vyap-suggestion-chip"
            onClick={() => setMessage(language === 'hindi' ? 'फीचर्स दिखाएं' : 'Show features')}
          >
            {language === 'hindi' ? 'फीचर्स दिखाएं' : 'Show features'}
          </button>
        </div>
      </div>
    </div>
  );
};
