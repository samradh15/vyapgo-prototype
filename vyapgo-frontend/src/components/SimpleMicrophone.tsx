import React, { useState, useRef, useCallback } from 'react';

interface SimpleMicrophoneProps {
  onAudioRecorded: (audioBlob: Blob) => void;
  onError?: (error: string) => void;
}

export const SimpleMicrophone: React.FC<SimpleMicrophoneProps> = ({
  onAudioRecorded,
  onError
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [status, setStatus] = useState('Ready to record');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = useCallback(() => {
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Stop recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    // Stop stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Reset refs
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }, []);

  const startRecording = async () => {
    console.log('🎙️ Starting recording...');
    
    try {
      setStatus('Requesting microphone access...');
      
      // Request microphone with explicit settings
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      console.log('✅ Microphone access granted');
      streamRef.current = stream;
      
      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      // Handle data
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Handle stop
      mediaRecorder.onstop = () => {
        console.log('🛑 Recording stopped');
        
        const audioBlob = new Blob(chunksRef.current, { 
          type: 'audio/webm;codecs=opus' 
        });
        
        console.log('📦 Audio blob created:', {
          size: audioBlob.size,
          type: audioBlob.type
        });
        
        onAudioRecorded(audioBlob);
        setStatus('Recording complete!');
        
        cleanup();
      };

      // Handle errors
      mediaRecorder.onerror = (event) => {
        console.error('❌ MediaRecorder error:', event);
        const error = 'Recording failed';
        setStatus(error);
        onError?.(error);
        cleanup();
      };

      // Start recording
      mediaRecorder.start(100);
      setIsRecording(true);
      setDuration(0);
      setStatus('Recording... Click Stop when finished');

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      console.log('🟢 Recording started successfully');

    } catch (err) {
      console.error('❌ Failed to start recording:', err);
      
      let errorMessage = 'Microphone access failed';
      
      if (err instanceof Error) {
        switch (err.name) {
          case 'NotAllowedError':
            errorMessage = 'Microphone permission denied. Please allow access and try again.';
            break;
          case 'NotFoundError':
            errorMessage = 'No microphone found. Please connect a microphone.';
            break;
          case 'NotReadableError':
            errorMessage = 'Microphone is being used by another application.';
            break;
          case 'SecurityError':
            errorMessage = 'Security error. Please ensure you are using HTTPS.';
            break;
          default:
            errorMessage = `Error: ${err.message}`;
        }
      }
      
      setStatus(errorMessage);
      onError?.(errorMessage);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    console.log('🛑 Stopping recording...');
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setStatus('Processing...');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Voice Recording
        </h3>
        <p className="text-gray-600">{status}</p>
        
        {isRecording && (
          <div className="mt-2 text-lg font-mono text-blue-600">
            {formatTime(duration)}
          </div>
        )}
      </div>

      <div className="flex space-x-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🎙️ Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-red-600 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 shadow-lg animate-pulse"
          >
            ⏹️ Stop Recording
          </button>
        )}
      </div>

      {/* Recording indicator */}
      {isRecording && (
        <div className="flex items-center space-x-2 text-red-600">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Recording in progress...</span>
        </div>
      )}
    </div>
  );
};
