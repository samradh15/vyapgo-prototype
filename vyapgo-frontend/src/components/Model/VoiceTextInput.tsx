'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface VoiceTextInputProps {
  onSubmit: (input: string, type: 'voice' | 'text') => void;
  isProcessing: boolean;
}

export default function VoiceTextInput({ onSubmit, isProcessing }: VoiceTextInputProps) {
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [textInput, setTextInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsVoiceEnabled(true);
    }
  }, []);

  const startVoiceRecognition = () => {
    if (!isVoiceEnabled) return;
    
    setIsListening(true);
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const voiceText = event.results[0][0].transcript;
      setTranscript(voiceText);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSubmit = () => {
    const input = inputMode === 'voice' ? transcript : textInput;
    if (input.trim()) {
      onSubmit(input, inputMode);
    }
  };

  return (
    <motion.div 
      className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      {/* Mode Toggle */}
      <div className="flex items-center justify-center mb-8">
        <div className="bg-white/10 rounded-2xl p-2 flex">
          <button
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              inputMode === 'voice' 
                ? 'bg-orange-500 text-white shadow-lg' 
                : 'text-white/70 hover:text-white'
            }`}
            onClick={() => setInputMode('voice')}
          >
            Voice Input
          </button>
          <button
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              inputMode === 'text' 
                ? 'bg-orange-500 text-white shadow-lg' 
                : 'text-white/70 hover:text-white'
            }`}
            onClick={() => setInputMode('text')}
          >
            Text Input
          </button>
        </div>
      </div>

      {/* Voice Input Mode */}
      {inputMode === 'voice' && (
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-bold text-white mb-4">
            बोलकर अपना बिज़नेस बताएं
          </h3>
          <p className="text-white/70 mb-6">
            Describe your business in Hindi or English
          </p>
          
          {/* Voice Visualizer */}
          <div className="flex items-center justify-center mb-6">
            <motion.button
              className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-all duration-300 ${
                isListening 
                  ? 'bg-red-500 shadow-2xl' 
                  : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:shadow-xl'
              }`}
              onClick={startVoiceRecognition}
              disabled={!isVoiceEnabled || isProcessing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isListening ? (
                <div className="w-8 h-8 bg-white rounded-sm" />
              ) : (
                <div className="w-0 h-0 border-l-8 border-l-white border-t-6 border-t-transparent border-b-6 border-b-transparent ml-1" />
              )}
            </motion.button>
          </div>

          {isListening && (
            <motion.div
              className="text-orange-400 font-medium"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Listening... Speak now
            </motion.div>
          )}

          {transcript && (
            <div className="bg-white/10 rounded-xl p-4 mt-4">
              <p className="text-white font-medium">"{transcript}"</p>
            </div>
          )}
        </div>
      )}

      {/* Text Input Mode */}
      {inputMode === 'text' && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white text-center mb-4">
            Describe Your Business
          </h3>
          <textarea
            className="w-full h-32 bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="e.g., I run an electronics shop in Mumbai selling mobiles, laptops, and accessories..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
        </div>
      )}

      {/* Language Support */}
      <div className="flex items-center justify-center space-x-4 mt-6 text-white/60 text-sm">
        <span>🇮🇳 Hindi</span>
        <span>•</span>
        <span>🇬🇧 English</span>
        <span>•</span>
        <span>⚡ AI Powered</span>
      </div>

      {/* Submit Button */}
      <motion.button
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg mt-8 hover:shadow-xl transition-all duration-300 disabled:opacity-50"
        onClick={handleSubmit}
        disabled={isProcessing || (!transcript && !textInput.trim())}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isProcessing ? 'Creating Your App...' : 'Generate My App'}
      </motion.button>
    </motion.div>
  );
}
