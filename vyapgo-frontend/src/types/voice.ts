export interface VoiceRecordingResult {
    success: boolean;
    transcript: string;
    confidence: number;
    audioBlob?: Blob;
    error?: string;
  }
  
  export interface VoiceRecordingOptions {
    maxDuration?: number;
    language?: string;
    autoStop?: boolean;
  }
  