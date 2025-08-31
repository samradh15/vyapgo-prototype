'use client';

import { SpeechRecognition, SpeechRecognitionErrorEvent, SpeechRecognitionEvent } from "@/types/speech";

export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  language: 'hi' | 'en' | 'mixed';
  isFinal: boolean;
}

export interface VoiceRecorderCallbacks {
  onStart?: () => void;
  onResult?: (result: VoiceRecognitionResult) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
  onNoSpeech?: () => void;
  onSpeechDetected?: () => void;
}

export class VoiceRecorder {
  private recognition: SpeechRecognition | null = null;
  private isRecording = false;
  private noSpeechTimer: NodeJS.Timeout | null = null;
  private speechDetected = false;
  private callbacks: VoiceRecorderCallbacks;
  private preferredLanguage: 'hi' | 'en' = 'hi'; // Default to Hindi

  constructor(callbacks: VoiceRecorderCallbacks = {}) {
    this.callbacks = callbacks;
    this.initializeRecognition();
  }

  private initializeRecognition(): void {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionAPI = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      this.callbacks.onError?.('Speech recognition not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognitionAPI();
    this.setupRecognitionConfig();
    this.setupEventHandlers();
  }

  private setupRecognitionConfig(): void {
    if (!this.recognition) return;

    // Set up multi-language recognition - Hindi first, then English
    if (this.preferredLanguage === 'hi') {
      this.recognition.lang = 'hi-IN';
    } else {
      this.recognition.lang = 'en-US';
    }
    
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
  }

  private setupEventHandlers(): void {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.isRecording = true;
      this.speechDetected = false;
      this.startNoSpeechTimer();
      this.callbacks.onStart?.();
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (!this.speechDetected) {
        this.speechDetected = true;
        this.clearNoSpeechTimer();
        this.callbacks.onSpeechDetected?.();
      }

      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript.trim();
      const confidence = result[0].confidence || 0;
      
      if (transcript) {
        // Detect language based on the recognition language setting and script
        const detectedLanguage = this.detectActualLanguage(transcript);
        
        const voiceResult: VoiceRecognitionResult = {
          transcript,
          confidence,
          language: detectedLanguage,
          isFinal: result.isFinal
        };
        
        this.callbacks.onResult?.(voiceResult);

        // If final result, stop after brief pause
        if (result.isFinal) {
          setTimeout(() => {
            this.stop();
          }, 1000);
        }
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      let errorMessage = 'Voice recognition error occurred';
      
      switch (event.error) {
        case 'network':
          errorMessage = 'Network error occurred';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access denied';
          break;
        case 'no-speech':
          errorMessage = 'No voice detected';
          break;
        case 'audio-capture':
          errorMessage = 'Audio capture failed';
          break;
        default:
          errorMessage = `Voice error: ${event.error}`;
      }
      
      this.callbacks.onError?.(errorMessage);
      this.stop();
    };

    this.recognition.onend = () => {
      this.isRecording = false;
      this.clearNoSpeechTimer();
      this.callbacks.onEnd?.();
    };
  }

  private detectActualLanguage(text: string): 'hi' | 'en' | 'mixed' {
    // Check for Devanagari script (Hindi)
    const hindiPattern = /[\u0900-\u097F]/;
    // Check for Latin script (English)
    const englishPattern = /[a-zA-Z]/;
    
    const hasHindi = hindiPattern.test(text);
    const hasEnglish = englishPattern.test(text);
    
    // If recognition was set to Hindi and we got Hindi script, it's Hindi
    if (this.recognition?.lang === 'hi-IN' && hasHindi) {
      return 'hi';
    }
    
    // If recognition was set to English and we got English script, it's English  
    if (this.recognition?.lang === 'en-US' && hasEnglish && !hasHindi) {
      return 'en';
    }
    
    // Mixed case
    if (hasHindi && hasEnglish) {
      return 'mixed';
    }
    
    // Default based on script
    if (hasHindi) return 'hi';
    if (hasEnglish) return 'en';
    
    // Fallback to recognition language
    return this.recognition?.lang === 'hi-IN' ? 'hi' : 'en';
  }

  private startNoSpeechTimer(): void {
    this.noSpeechTimer = setTimeout(() => {
      if (!this.speechDetected) {
        this.callbacks.onNoSpeech?.();
        this.stop();
      }
    }, 3000);
  }

  private clearNoSpeechTimer(): void {
    if (this.noSpeechTimer) {
      clearTimeout(this.noSpeechTimer);
      this.noSpeechTimer = null;
    }
  }

  public async start(preferredLanguage: 'hi' | 'en' = 'hi'): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not initialized');
    }

    if (this.isRecording) {
      return;
    }

    try {
      // Set preferred language
      this.preferredLanguage = preferredLanguage;
      this.setupRecognitionConfig();

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      
      this.recognition.start();
    } catch (error) {
      if (error instanceof Error) {
        this.callbacks.onError?.(
          error instanceof Error ? error.message : 'Failed to start voice recording'
        );
      } else {
        this.callbacks.onError?.('Failed to start voice recording');
      }
    }
  }

  public stop(): void {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
    }
  }

  public isActive(): boolean {
    return this.isRecording;
  }

  public destroy(): void {
    this.stop();
    this.clearNoSpeechTimer();
    this.recognition = null;
  }
}
