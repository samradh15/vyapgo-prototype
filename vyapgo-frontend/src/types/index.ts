// Core application types
export interface BusinessIdea {
    id: string;
    description: string;
    category: string;
    language: 'en' | 'hi' | 'mixed';
    timestamp: Date;
  }
  
  export interface VoiceRecordingState {
    isRecording: boolean;
    isProcessing: boolean;
    error: string | null;
    transcription: string;
  }
  
  export interface StudioSession {
    businessIdea: string;
    chatHistory: ChatMessage[];
    appBuildingProgress: number;
    currentStep: string;
  }
  
  export interface ChatMessage {
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
  }
  