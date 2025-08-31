export interface YantraConfiguration {
    pattern: 'shriyantra' | 'mandala' | 'lotus' | 'om' | 'chakra';
    rotation: number;
    scale: number;
    complexity: 1 | 2 | 3 | 4 | 5;
    animationSpeed: 'slow' | 'medium' | 'fast';
  }
  
  export interface SacredColorPalette {
    primary: string;
    secondary: string;
    accent: string;
    divine: string;
    grounding: string;
    gradient: string;
  }
  
  export interface BusinessSankalp {
    id: string;
    intention: string;
    category: 'dharma' | 'artha' | 'kama' | 'moksha';
    language: 'hindi' | 'english' | 'sanskrit';
    timestamp: Date;
    yantraPattern: YantraConfiguration;
    metadata: {
      wordCount: number;
      sentiment: 'positive' | 'neutral' | 'negative';
      confidence: number;
    };
  }
  
  export interface VoiceRecordingState {
    isRecording: boolean;
    isProcessing: boolean;
    isListening: boolean;
    duration: number;
    audioBlob: Blob | null;
    transcription: string;
    error: string | null;
  }
  
  export interface StudioPhase {
    current: 'sankalp' | 'vani' | 'rachana';
    progress: number;
    completedSteps: string[];
    currentStep: string;
  }
  