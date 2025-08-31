import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceRecording } from '../hooks/useVoiceRecording';

interface VoiceRecordingProps {
  onVoiceSubmit: (audioBlob: Blob) => void;
  onError?: (error: string) => void;
  isProcessing?: boolean;
}

export const VoiceRecording: React.FC<VoiceRecordingProps> = ({
  onVoiceSubmit,
  onError,
  isProcessing = false
}) => {
  const voiceRecording = useVoiceRecording({
    initialListenTime: 3,
    maxDuration: 30,
    silenceThreshold: 0.01,
    silenceTimeout: 2,
    onRecordingComplete: onVoiceSubmit,
    onError,
    onNoVoiceDetected: () => {
      console.log('No voice detected - user feedback handled');
    }
  });

  // Debug logging
  useEffect(() => {
    console.log('VoiceRecording state:', {
      isListening: voiceRecording.isListening,
      isProcessing: isProcessing,
      canRecord: voiceRecording.canRecord,
      error: voiceRecording.error
    });
  }, [voiceRecording.isListening, isProcessing, voiceRecording.canRecord, voiceRecording.error]);

  const handleButtonClick = () => {
    console.log('Button clicked - state:', {
      isListening: voiceRecording.isListening,
      isProcessing: isProcessing
    });
    
    if (voiceRecording.isListening) {
      voiceRecording.stopRecording();
    } else {
      voiceRecording.startListening();
    }
  };

  const isButtonDisabled = isProcessing;

  const getButtonStyle = () => {
    if (isButtonDisabled) {
      return 'bg-gray-500 cursor-not-allowed opacity-50';
    }
    
    if (voiceRecording.isListening) {
      switch (voiceRecording.listeningPhase) {
        case 'initial':
          return 'bg-gradient-to-r from-yellow-400 to-orange-500 scale-110';
        case 'extended':
          return 'bg-gradient-to-r from-green-400 to-emerald-500 scale-125';
        case 'closing':
          return 'bg-gradient-to-r from-red-400 to-pink-500 scale-105';
        default:
          return 'bg-gradient-to-r from-yellow-400 to-orange-500 scale-110';
      }
    }
    
    return 'bg-gradient-to-r from-orange-500 via-yellow-500 to-green-500 hover:scale-110 cursor-pointer';
  };

  const getStatusMessage = () => {
    if (isProcessing) {
      return 'AI Processing Your Voice...';
    }
    
    if (voiceRecording.statusMessage) {
      return voiceRecording.statusMessage;
    }
    
    if (voiceRecording.error) {
      return voiceRecording.error;
    }
    
    return 'Click to start speaking';
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Debug Info - Remove in production */}
      <div className="text-xs text-gray-500 text-center">
        Debug: Disabled={isButtonDisabled.toString()}, 
        Listening={voiceRecording.isListening.toString()}, 
        CanRecord={voiceRecording.canRecord.toString()}
      </div>

      {/* Main Voice Button */}
      <motion.button
        onClick={handleButtonClick}
        disabled={isButtonDisabled}
        className={`
          relative w-32 h-32 rounded-full flex items-center justify-center 
          transition-all duration-500 shadow-lg
          ${getButtonStyle()}
        `}
        whileHover={!isButtonDisabled ? { scale: 1.05 } : {}}
        whileTap={!isButtonDisabled ? { scale: 0.95 } : {}}
        style={{ 
          cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
          pointerEvents: 'auto' // Force pointer events
        }}
      >
        {/* Main Icon */}
        {isProcessing ? (
          <motion.div
            className="w-8 h-8 border-4 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2s-2-.9-2-2V4c0-1.1.9-2 2-2zm5.3 6.7c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4-1.2 1.2-2.6 2.1-4.2 2.6v1.9c2.8-.5 5-2.9 5-5.8 0-.6.4-1 1-1s1 .4 1 1c0 4.1-3.1 7.5-7 7.9V19h3c.6 0 1 .4 1 1s-.4 1-1 1H8c-.6 0-1-.4-1-1s.4-1 1-1h3v-2.1c-3.9-.4-7-3.8-7-7.9 0-.6.4-1 1-1s1 .4 1 1c0 2.9 2.2 5.3 5 5.8v-1.9c-1.6-.5-3-1.4-4.2-2.6-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0C8.3 9.3 10.1 10 12 10s3.7-.7 4.3-1.3z"/>
          </svg>
        )}

        {/* Listening Animation Rings */}
        <AnimatePresence>
          {voiceRecording.isListening && (
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-white/30"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.3, 0.8] }}
              exit={{ scale: 1, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Status Text */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">
          {getStatusMessage()}
        </h3>
        
        {voiceRecording.isListening && (
          <p className="text-gray-300 text-sm">
            {voiceRecording.duration}s • {voiceRecording.voiceDetected ? '🎤 Speaking' : '👂 Listening'}
          </p>
        )}
      </div>

      {/* Error Display */}
      {voiceRecording.error && (
        <motion.div
          className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 max-w-md text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-red-400 text-sm">{voiceRecording.error}</p>
          <button
            onClick={voiceRecording.resetRecording}
            className="mt-2 px-4 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      )}
    </div>
  );
};
