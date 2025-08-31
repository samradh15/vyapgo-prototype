import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdvancedVoiceRecording } from '../hooks/useAdvancedVoiceRecording';

interface AdvancedVoiceInputProps {
  onVoiceSubmit: (audioBlob: Blob) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
}

export const AdvancedVoiceInput: React.FC<AdvancedVoiceInputProps> = ({
  onVoiceSubmit,
  onError,
  disabled = false,
  className = ''
}) => {
  const voiceRecording = useAdvancedVoiceRecording({
    silenceThreshold: 0.015,
    silenceDuration: 2.0,
    maxDuration: 60,
    onRecordingComplete: onVoiceSubmit,
    onError,
    onStatusChange: (status) => {
      console.log('Voice status:', status);
    }
  });

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !disabled && voiceRecording.canRecord) {
        event.preventDefault();
        voiceRecording.startRecording();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [disabled, voiceRecording]);

  // Button colors based on state
  const getButtonColors = () => {
    if (disabled) {
      return 'from-gray-400 to-gray-500';
    }
    
    switch (voiceRecording.status) {
      case 'listening':
        return 'from-green-400 via-emerald-500 to-teal-500';
      case 'processing':
        return 'from-blue-400 via-purple-500 to-indigo-500';
      case 'error':
        return 'from-red-400 via-rose-500 to-pink-500';
      case 'complete':
        return 'from-green-400 via-emerald-500 to-green-600';
      default:
        return 'from-orange-400 via-amber-500 to-yellow-500';
    }
  };

  // Button scale based on state
  const getButtonScale = () => {
    if (voiceRecording.isListening) {
      return 1.1 + (voiceRecording.audioLevel * 0.3);
    }
    return 1;
  };

  // Status icon
  const getStatusIcon = () => {
    switch (voiceRecording.status) {
      case 'listening':
        return (
          <motion.svg
            className="w-16 h-16 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <path d="M12 2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2s-2-.9-2-2V4c0-1.1.9-2 2-2zm5.3 6.7c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4-1.2 1.2-2.6 2.1-4.2 2.6v1.9c2.8-.5 5-2.9 5-5.8 0-.6.4-1 1-1s1 .4 1 1c0 4.1-3.1 7.5-7 7.9V19h3c.6 0 1 .4 1 1s-.4 1-1 1H8c-.6 0-1-.4-1-1s.4-1 1-1h3v-2.1c-3.9-.4-7-3.8-7-7.9 0-.6.4-1 1-1s1 .4 1 1c0 2.9 2.2 5.3 5 5.8v-1.9c-1.6-.5-3-1.4-4.2-2.6-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0C8.3 9.3 10.1 10 12 10s3.7-.7 4.3-1.3z"/>
          </motion.svg>
        );
      
      case 'processing':
        return (
          <motion.div
            className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        );
      
      case 'complete':
        return (
          <motion.svg
            className="w-16 h-16 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
          </motion.svg>
        );
      
      case 'error':
        return (
          <motion.svg
            className="w-16 h-16 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
          </motion.svg>
        );
      
      default:
        return (
          <motion.svg
            className="w-16 h-16 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <path d="M12 2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2s-2-.9-2-2V4c0-1.1.9-2 2-2zm5.3 6.7c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4-1.2 1.2-2.6 2.1-4.2 2.6v1.9c2.8-.5 5-2.9 5-5.8 0-.6.4-1 1-1s1 .4 1 1c0 4.1-3.1 7.5-7 7.9V19h3c.6 0 1 .4 1 1s-.4 1-1 1H8c-.6 0-1-.4-1-1s.4-1 1-1h3v-2.1c-3.9-.4-7-3.8-7-7.9 0-.6.4-1 1-1s1 .4 1 1c0 2.9 2.2 5.3 5 5.8v-1.9c-1.6-.5-3-1.4-4.2-2.6-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0C8.3 9.3 10.1 10 12 10s3.7-.7 4.3-1.3z"/>
          </motion.svg>
        );
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-8 ${className}`}>
      {/* Main Voice Button */}
      <div className="relative">
        <motion.button
          onClick={voiceRecording.canRecord ? voiceRecording.startRecording : undefined}
          disabled={disabled || !voiceRecording.canRecord}
          className={`
            relative w-40 h-40 rounded-full flex items-center justify-center
            bg-gradient-to-br ${getButtonColors()}
            shadow-2xl transition-all duration-300
            ${disabled || !voiceRecording.canRecord ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:shadow-3xl'}
          `}
          whileHover={voiceRecording.canRecord ? { scale: 1.05 } : {}}
          whileTap={voiceRecording.canRecord ? { scale: 0.95 } : {}}
          animate={{
            scale: getButtonScale(),
            boxShadow: voiceRecording.isListening 
              ? `0 0 ${30 + voiceRecording.audioLevel * 50}px rgba(34, 197, 94, 0.4)`
              : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          aria-label={voiceRecording.statusMessage}
          role="button"
          tabIndex={0}
        >
          {getStatusIcon()}

          {/* Listening Animation Rings */}
          <AnimatePresence>
            {voiceRecording.isListening && (
              <>
                {/* Inner ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-white/30"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ 
                    scale: [1, 1.2, 1], 
                    opacity: [0.8, 0.4, 0.8] 
                  }}
                  exit={{ scale: 1, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                
                {/* Outer ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-white/20"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ 
                    scale: [1, 1.4, 1], 
                    opacity: [0.6, 0.2, 0.6] 
                  }}
                  exit={{ scale: 1, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Stop Button (appears during recording) */}
        <AnimatePresence>
          {voiceRecording.isListening && (
            <motion.button
              onClick={voiceRecording.stopRecording}
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full shadow-lg transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Stop Recording
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Status Display */}
      <div className="text-center max-w-md">
        <motion.h3 
          className="text-2xl font-bold text-gray-800 mb-2"
          key={voiceRecording.statusMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {voiceRecording.statusMessage}
        </motion.h3>
        
        {/* Duration and Audio Level */}
        {voiceRecording.isListening && (
          <motion.div 
            className="flex items-center justify-center space-x-4 text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-lg font-mono">
              {Math.floor(voiceRecording.duration / 60)}:{(voiceRecording.duration % 60).toString().padStart(2, '0')}
            </span>
            <div className="flex items-center space-x-1">
              <div className="text-sm">Audio:</div>
              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                  style={{ width: `${Math.min(voiceRecording.audioLevel * 100 * 5, 100)}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Keyboard Hint */}
        {voiceRecording.canRecord && (
          <p className="text-sm text-gray-500 mt-2">
            Click the button or press <kbd className="px-2 py-1 bg-gray-100 rounded">Space</kbd> to start
          </p>
        )}
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {voiceRecording.error && (
          <motion.div
            className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <p className="text-red-800 text-sm mb-3">{voiceRecording.error}</p>
            <button
              onClick={voiceRecording.resetRecording}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
