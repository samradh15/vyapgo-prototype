import { useState, useRef, useCallback, useEffect } from 'react';

// Types for the voice recording functionality
export interface VoiceRecordingState {
  isListening: boolean;
  isProcessing: boolean;
  audioBlob: Blob | null;
  error: string | null;
  duration: number;
  audioLevel: number;
  status: 'idle' | 'listening' | 'processing' | 'complete' | 'error';
  statusMessage: string;
}

export interface VoiceRecordingOptions {
  silenceThreshold?: number;      // Voice detection sensitivity (0-1)
  silenceDuration?: number;       // Seconds of silence before auto-stop
  maxDuration?: number;           // Maximum recording duration
  onRecordingStart?: () => void;
  onRecordingComplete?: (blob: Blob) => void;
  onError?: (error: string) => void;
  onStatusChange?: (status: string) => void;
}

export const useAdvancedVoiceRecording = (options: VoiceRecordingOptions = {}) => {
  const {
    silenceThreshold = 0.015,
    silenceDuration = 2.0,
    maxDuration = 60,
    onRecordingStart,
    onRecordingComplete,
    onError,
    onStatusChange
  } = options;

  // Component state
  const [state, setState] = useState<VoiceRecordingState>({
    isListening: false,
    isProcessing: false,
    audioBlob: null,
    error: null,
    duration: 0,
    audioLevel: 0,
    status: 'idle',
    statusMessage: 'Tap to start speaking'
  });

  // Refs for audio processing
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Timing and detection refs
  const animationFrameRef = useRef<number | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxDurationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Voice detection state
  const silenceCountRef = useRef<number>(0);
  const hasDetectedVoiceRef = useRef<boolean>(false);

  // Update status with callback
  const updateStatus = useCallback((newStatus: VoiceRecordingState['status'], message: string) => {
    setState(prev => ({
      ...prev,
      status: newStatus,
      statusMessage: message
    }));
    onStatusChange?.(message);
  }, [onStatusChange]);

  // Voice level monitoring with animation frame
  const monitorAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calculate average volume
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    const normalizedLevel = average / 255;
    
    setState(prev => ({ ...prev, audioLevel: normalizedLevel }));

    // Voice activity detection
    const isVoiceActive = normalizedLevel > silenceThreshold;
    
    if (isVoiceActive) {
      silenceCountRef.current = 0;
      if (!hasDetectedVoiceRef.current) {
        hasDetectedVoiceRef.current = true;
        updateStatus('listening', 'Listening... Keep speaking');
        console.log('🎤 Voice detected, continuing recording');
      }
    } else {
      silenceCountRef.current += 1;
      
      // Auto-stop after silence duration (60fps = 60 frames per second)
      if (hasDetectedVoiceRef.current && silenceCountRef.current > (silenceDuration * 60)) {
        console.log(`🔇 ${silenceDuration}s silence detected, stopping recording`);
        stopRecording();
        return;
      }
    }

    animationFrameRef.current = requestAnimationFrame(monitorAudioLevel);
  }, [silenceThreshold, silenceDuration, updateStatus]);

  // Setup audio context and analyser
  const setupAudioAnalysis = useCallback(async (stream: MediaStream) => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 512;
      analyserRef.current.smoothingTimeConstant = 0.8;
      
      console.log('✅ Audio analysis setup complete');
      return true;
    } catch (error) {
      console.error('❌ Audio analysis setup failed:', error);
      return false;
    }
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    console.log('🧹 Cleaning up voice recording resources...');
    
    // Stop animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Clear all timeouts
    [durationIntervalRef, silenceTimeoutRef, maxDurationTimeoutRef].forEach(ref => {
      if (ref.current) {
        clearInterval(ref.current);
        clearTimeout(ref.current);
        ref.current = null;
      }
    });

    // Stop MediaRecorder safely
    if (mediaRecorderRef.current) {
      try {
        if (mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      } catch (error) {
        console.warn('MediaRecorder stop warning:', error);
      }
      mediaRecorderRef.current = null;
    }

    // Stop audio stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.warn);
      audioContextRef.current = null;
    }

    // Reset detection state
    silenceCountRef.current = 0;
    hasDetectedVoiceRef.current = false;
    audioChunksRef.current = [];
  }, []);

  // Start recording function
  const startRecording = useCallback(async () => {
    try {
      console.log('🎙️ Starting advanced voice recording...');
      
      // Reset state
      setState(prev => ({
        ...prev,
        isListening: false,
        isProcessing: true,
        audioBlob: null,
        error: null,
        duration: 0,
        audioLevel: 0
      }));
      
      updateStatus('processing', 'Initializing microphone...');

      // Request microphone access with optimal settings
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          channelCount: 1
        }
      });

      streamRef.current = stream;
      
      // Setup audio analysis
      const analysisReady = await setupAudioAnalysis(stream);
      if (!analysisReady) {
        throw new Error('Failed to setup audio analysis');
      }

      // Create MediaRecorder with optimal settings
      const mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        throw new Error('Browser does not support WebM audio recording');
      }

      const recorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000
      });

      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      silenceCountRef.current = 0;
      hasDetectedVoiceRef.current = false;

      // Setup recorder event handlers
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        console.log('⏹️ Recording stopped, processing audio...');
        
        updateStatus('processing', 'Processing your voice...');
        
        setTimeout(() => {
          if (audioChunksRef.current.length === 0) {
            const error = 'No audio data recorded. Please try again.';
            setState(prev => ({ ...prev, error, isProcessing: false }));
            updateStatus('error', error);
            onError?.(error);
            cleanup();
            return;
          }

          // Create final audio blob
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          
          console.log('🔊 Audio processing complete:', {
            size: `${(audioBlob.size / 1024).toFixed(1)}KB`,
            duration: `${state.duration}s`,
            chunks: audioChunksRef.current.length
          });

          setState(prev => ({
            ...prev,
            audioBlob,
            isListening: false,
            isProcessing: false
          }));
          
          updateStatus('complete', 'Voice recorded successfully!');
          
          // Auto-submit after brief delay
          setTimeout(() => {
            onRecordingComplete?.(audioBlob);
          }, 500);
          
          cleanup();
        }, 300);
      };

      recorder.onerror = (event) => {
        console.error('❌ MediaRecorder error:', event);
        const error = `Recording failed: ${(event as any).error?.message || 'Unknown error'}`;
        setState(prev => ({ ...prev, error, isListening: false, isProcessing: false }));
        updateStatus('error', error);
        onError?.(error);
        cleanup();
      };

      // Start recording
      recorder.start(100); // Collect data every 100ms
      
      setState(prev => ({ ...prev, isListening: true, isProcessing: false }));
      updateStatus('listening', 'Listening... Start speaking now');
      
      // Start monitoring
      monitorAudioLevel();
      
      // Duration counter
      let duration = 0;
      durationIntervalRef.current = setInterval(() => {
        duration += 1;
        setState(prev => ({ ...prev, duration }));
      }, 1000);

      // Maximum duration timeout
      maxDurationTimeoutRef.current = setTimeout(() => {
        console.log(`⏰ Max duration (${maxDuration}s) reached`);
        stopRecording();
      }, maxDuration * 1000);

      onRecordingStart?.();

    } catch (error) {
      console.error('❌ Failed to start recording:', error);
      
      let errorMessage = 'Failed to access microphone';
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Microphone access denied. Please allow microphone permissions and try again.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No microphone found. Please connect a microphone and try again.';
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'Microphone is already in use. Please close other applications using the microphone.';
        } else {
          errorMessage = error.message;
        }
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        isListening: false,
        isProcessing: false
      }));
      
      updateStatus('error', errorMessage);
      onError?.(errorMessage);
      cleanup();
    }
  }, [setupAudioAnalysis, monitorAudioLevel, maxDuration, updateStatus, onRecordingStart, onRecordingComplete, onError, cleanup, state.duration]);

  // Stop recording function
  const stopRecording = useCallback(() => {
    console.log('🛑 Manually stopping recording...');
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  // Reset function
  const resetRecording = useCallback(() => {
    console.log('🔄 Resetting voice recording...');
    cleanup();
    setState({
      isListening: false,
      isProcessing: false,
      audioBlob: null,
      error: null,
      duration: 0,
      audioLevel: 0,
      status: 'idle',
      statusMessage: 'Tap to start speaking'
    });
  }, [cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    ...state,
    startRecording,
    stopRecording,
    resetRecording,
    canRecord: !state.isListening && !state.isProcessing,
    progress: Math.min((state.duration / maxDuration) * 100, 100)
  };
};
