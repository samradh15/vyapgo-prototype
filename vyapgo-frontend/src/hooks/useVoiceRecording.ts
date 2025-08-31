'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { VoiceRecorder, VoiceRecognitionResult, VoiceRecorderCallbacks } from '@/components/Voice/VoiceRecorder';

export interface VoiceRecordingState {
  isRecording: boolean;
  isProcessing: boolean;
  hasError: boolean;
  errorMessage: string;
  transcript: string;
  confidence: number;
  language: 'hi' | 'en' | 'mixed' | null;
  isSupported: boolean;
  noSpeechDetected: boolean;
}

export interface UseVoiceRecordingOptions {
  onComplete?: (transcript: string, language: 'hi' | 'en' | 'mixed') => void;
  onError?: (error: string) => void;
}

export const useVoiceRecording = (options: UseVoiceRecordingOptions = {}) => {
  const [state, setState] = useState<VoiceRecordingState>({
    isRecording: false,
    isProcessing: false,
    hasError: false,
    errorMessage: '',
    transcript: '',
    confidence: 0,
    language: null,
    isSupported: false,
    noSpeechDetected: false
  });

  const voiceRecorderRef = useRef<VoiceRecorder | null>(null);
  const finalTranscript = useRef<string>('');

  // Check browser support on mount
  useEffect(() => {
    const isSupported = 
      typeof window !== 'undefined' && 
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    
    setState(prev => ({ ...prev, isSupported }));
  }, []);

  const initializeRecorder = useCallback(() => {
    if (voiceRecorderRef.current) {
      voiceRecorderRef.current.destroy();
    }

    const callbacks: VoiceRecorderCallbacks = {
      onStart: () => {
        setState(prev => ({
          ...prev,
          isRecording: true,
          isProcessing: false,
          hasError: false,
          errorMessage: '',
          transcript: '',
          confidence: 0,
          noSpeechDetected: false
        }));
        finalTranscript.current = '';
      },

      onSpeechDetected: () => {
        setState(prev => ({
          ...prev,
          isProcessing: true
        }));
      },

      onResult: (result: VoiceRecognitionResult) => {
        // Always show the latest transcript (interim or final)
        setState(prev => ({
          ...prev,
          transcript: result.transcript,
          confidence: result.confidence,
          language: result.language,
          isProcessing: !result.isFinal
        }));

        // Store final transcript
        if (result.isFinal) {
          finalTranscript.current = result.transcript;
        }
      },

      onNoSpeech: () => {
        setState(prev => ({
          ...prev,
          isRecording: false,
          isProcessing: false,
          noSpeechDetected: true,
          hasError: true,
          errorMessage: 'No voice detected'
        }));
        options.onError?.('No voice detected');
      },

      onError: (error: string) => {
        setState(prev => ({
          ...prev,
          isRecording: false,
          isProcessing: false,
          hasError: true,
          errorMessage: error
        }));
        options.onError?.(error);
      },

      onEnd: () => {
        const transcript = finalTranscript.current.trim();
        
        setState(prev => ({
          ...prev,
          isRecording: false,
          isProcessing: false,
          transcript: transcript || prev.transcript
        }));

        if (transcript) {
          const language = state.language || 'en';
          options.onComplete?.(transcript, language);
        }
      }
    };

    voiceRecorderRef.current = new VoiceRecorder(callbacks);
  }, [options, state.language]);

  const startRecording = useCallback(async (preferredLanguage: 'hi' | 'en' = 'en') => {
    if (!state.isSupported) {
      options.onError?.('Speech recognition is not supported in this browser');
      return;
    }

    try {
      initializeRecorder();
      await voiceRecorderRef.current?.start(preferredLanguage);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start recording';
      setState(prev => ({
        ...prev,
        hasError: true,
        errorMessage
      }));
      options.onError?.(errorMessage);
    }
  }, [state.isSupported, initializeRecorder, options]);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      hasError: false,
      errorMessage: '',
      noSpeechDetected: false
    }));
  }, []);

  const resetTranscript = useCallback(() => {
    finalTranscript.current = '';
    setState(prev => ({
      ...prev,
      transcript: '',
      confidence: 0,
      language: null,
      noSpeechDetected: false
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      voiceRecorderRef.current?.destroy();
    };
  }, []);

  return {
    ...state,
    startRecording,
    clearError,
    resetTranscript
  };
};
