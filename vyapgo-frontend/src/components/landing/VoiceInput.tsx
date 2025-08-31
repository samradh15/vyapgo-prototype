'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MicrophoneIcon } from '@/components/icons/MicrophoneIcon';
import { Button } from '@/components/ui/Button';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';

export const VoiceInput: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  // Voice recording with Hindi preference
  const voice = useVoiceRecording({
    onComplete: (transcript, language) => {
      // Add voice transcript to existing input
      const currentValue = inputValue.trim();
      const newValue = currentValue ? `${currentValue} ${transcript}` : transcript;
      setInputValue(newValue);
      autoResize();
      console.log(`Voice completed (${language}):`, transcript);
    },
    onError: (error) => {
      console.error('Voice recording error:', error);
    }
  });

  // Smooth entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Auto-resize textarea
  const autoResize = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 180);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    autoResize();
  }, [autoResize]);

  // Smart language detection for voice input
  const handleVoiceClick = useCallback(async () => {
    if (voice.isRecording) return;
    
    voice.clearError();
    voice.resetTranscript();
    
    // Detect language preference from existing input
    const hindiPattern = /[\u0900-\u097F]/;
    const englishPattern = /[a-zA-Z]/;
    
    let preferredLanguage: 'hi' | 'en' = 'hi'; // Default to Hindi
    
    if (inputValue.trim()) {
      const hasHindi = hindiPattern.test(inputValue);
      const hasEnglish = englishPattern.test(inputValue);
      
      // If user has typed English without Hindi, prefer English
      if (hasEnglish && !hasHindi) {
        preferredLanguage = 'en';
      }
      // Otherwise default to Hindi (includes mixed case)
    }
    
    console.log(`Starting voice recognition with language: ${preferredLanguage}`);
    await voice.startRecording(preferredLanguage);
  }, [voice, inputValue]);

  const handleSubmit = useCallback(() => {
    const finalText = inputValue.trim();
    if (!finalText) return;
    
    // Store business idea for studio
    sessionStorage.setItem('businessIdea', finalText);
    
    // Detect language for storage
    const hindiPattern = /[\u0900-\u097F]/;
    const detectedLanguage = hindiPattern.test(finalText) ? 'hindi' : 'english';
    sessionStorage.setItem('inputLanguage', detectedLanguage);
    
    // Navigate to studio
    router.push('/studio');
  }, [inputValue, router]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  // Get microphone button state
  const getMicState = () => {
    if (voice.noSpeechDetected) return 'error';
    if (voice.hasError) return 'error';
    if (voice.isProcessing) return 'processing';
    if (voice.isRecording) return 'recording';
    return 'idle';
  };

  // Show current voice transcript in real-time
  const displayValue = voice.isRecording || voice.isProcessing ? 
    (inputValue + (voice.transcript ? (inputValue ? ' ' : '') + voice.transcript : '')).trim() : 
    inputValue;

  const hasContent = inputValue.trim().length > 0;

  return (
    <section className={`vyap-voice-section ${isVisible ? 'vyap-visible' : ''}`}>
      <div className="vyap-input-wrapper">
        {/* Glass-Morphism Container */}
        <div className="vyap-glass-container">
          <div className="vyap-input-inner">
            {/* Main Input Area */}
            <div className="vyap-textarea-container">
              <textarea
                ref={textareaRef}
                value={displayValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Describe your business idea or share your vision..."
                className={`vyap-textarea-premium ${voice.transcript ? 'vyap-voice-transcript' : ''}`}
                rows={3}
                maxLength={1000}
                disabled={voice.isRecording || voice.isProcessing}
              />
              
              {/* Character Counter */}
              <div className="vyap-char-counter">
                {displayValue.length}/1000
                {voice.language && (
                  <span className="vyap-language-indicator">
                    {voice.language === 'hi' ? 'हिं' : voice.language === 'en' ? 'EN' : 'MIX'}
                  </span>
                )}
              </div>
            </div>
            
            {/* Voice Button */}
            <div className="vyap-mic-container">
              {!voice.isSupported ? (
                <div className="vyap-mic-unsupported">
                  <span className="vyap-mic-unsupported-text">Voice not supported</span>
                </div>
              ) : (
                <button
                  onClick={handleVoiceClick}
                  disabled={voice.isRecording || voice.isProcessing}
                  className={`vyap-mic-button-premium ${
                    getMicState() === 'recording' ? 'vyap-recording' : 
                    getMicState() === 'processing' ? 'vyap-processing' : 
                    getMicState() === 'error' ? 'vyap-error' : ''
                  }`}
                  aria-label={
                    voice.isRecording ? 'Recording...' :
                    voice.isProcessing ? 'Processing...' : 
                    voice.hasError ? voice.errorMessage :
                    'Click to speak (Hindi/English)'
                  }
                >
                  <MicrophoneIcon size={24} className="vyap-mic-icon" state={getMicState()} />
                </button>
              )}
            </div>
          </div>
          
          {/* Status Indicator */}
          {(voice.isRecording || voice.isProcessing || voice.hasError) && (
            <div className="vyap-status-container">
              <div className="vyap-status-indicator">
                {voice.isRecording && (
                  <div className="vyap-recording-status">
                    <div className="vyap-pulse-dot"></div>
                    <span>हिंदी या English में बोलें... / Speak in Hindi or English...</span>
                  </div>
                )}
                {voice.isProcessing && (
                  <div className="vyap-processing-status">
                    <div className="vyap-spinner"></div>
                    <span>आपकी बात समझ रहे हैं... / Understanding your speech...</span>
                  </div>
                )}
                {voice.hasError && (
                  <div className="vyap-error-status">
                    {voice.noSpeechDetected ? (
                      <span>❌ कोई आवाज़ नहीं मिली / No voice detected</span>
                    ) : (
                      <span>{voice.errorMessage}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        {hasContent && (
          <div className="vyap-submit-container">
            <Button
              onClick={handleSubmit}
              className="vyap-submit-button-premium"
              size="lg"
            >
              <span className="vyap-button-text">
                अपना ऐप बनाएं / Create My App
              </span>
            </Button>
          </div>
        )}
      </div>
      
      {/* Helper Text */}
      <div className="vyap-helper-container">
        <p className="vyap-helper-main">
          Type or speak your business idea in Hindi or English
        </p>
        <p className="vyap-helper-sub">
          Voice input: Defaults to Hindi • Auto-detects English • 3-second window
        </p>
      </div>
    </section>
  );
};
