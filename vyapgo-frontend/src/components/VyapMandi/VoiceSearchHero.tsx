'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface VoiceSearchHeroProps {
  onSearch: (query: string) => void;
  isVoiceActive: boolean;
  setIsVoiceActive: (active: boolean) => void;
}

export default function VoiceSearchHero({ onSearch, isVoiceActive, setIsVoiceActive }: VoiceSearchHeroProps) {
  const [searchInput, setSearchInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startVoiceSearch = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search not supported in this browser');
      return;
    }

    setIsListening(true);
    setIsVoiceActive(true);
    
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      setSearchInput(result);
      onSearch(result);
      setIsListening(false);
      setIsVoiceActive(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setIsVoiceActive(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setIsVoiceActive(false);
    };

    recognition.start();
  }, [onSearch, setIsVoiceActive]);

  const handleTextSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  return (
    <section className="bg-gradient-to-br from-orange-50 via-white to-green-50 py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-orange-600">बोलकर</span> खरीदारी करें
          </h1>
          <p className="text-2xl text-gray-600 mb-12 leading-relaxed">
            India's first voice-powered marketplace connecting you with local shopkeepers
          </p>

          {/* Search Interface */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleTextSearch} className="relative mb-8">
              <div className="flex items-center bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search for products, sellers, or categories..."
                  className="flex-1 px-6 py-4 text-lg focus:outline-none"
                />
                <button
                  type="button"
                  onClick={startVoiceSearch}
                  disabled={isListening}
                  className={`p-4 m-2 rounded-xl transition-all duration-300 ${
                    isListening
                      ? 'bg-red-500 text-white'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2s-2-.9-2-2V4c0-1.1.9-2 2-2zm5.3 6.7c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4-1.2 1.2-2.6 2.1-4.2 2.6v1.9c2.8-.5 5-2.9 5-5.8 0-.6.4-1 1-1s1 .4 1 1c0 4.1-3.1 7.5-7 7.9V19h3c.6 0 1 .4 1 1s-.4 1-1 1H8c-.6 0-1-.4-1-1s.4-1 1-1h3v-2.1c-3.9-.4-7-3.8-7-7.9 0-.6.4-1 1-1s1 .4 1 1c0 2.9 2.2 5.3 5 5.8v-1.9c-1.6-.5-3-1.4-4.2-2.6-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0C8.3 9.3 10.1 10 12 10s3.7-.7 4.3-1.3z"/>
                  </svg>
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-4 font-medium transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Voice Status */}
            {isListening && (
              <motion.div
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-700 font-medium">
                    Listening... Speak now in Hindi or English
                  </span>
                </div>
              </motion.div>
            )}

            {/* Voice Transcript */}
            {transcript && (
              <motion.div
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-green-800">
                  <span className="font-medium">Voice Search:</span> "{transcript}"
                </p>
              </motion.div>
            )}

            {/* Quick Categories */}
            <div className="flex flex-wrap justify-center gap-3">
              {['Electronics', 'Grocery', 'Clothing', 'Pharmacy', 'Home & Garden'].map((category) => (
                <button
                  key={category}
                  onClick={() => onSearch(category)}
                  className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2s-2-.9-2-2V4c0-1.1.9-2 2-2z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Voice Search</h3>
              <p className="text-gray-600 text-sm">
                Search products using your voice in Hindi or English
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Local Sellers</h3>
              <p className="text-gray-600 text-sm">
                Connect directly with verified shopkeepers in your area
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quality Assured</h3>
              <p className="text-gray-600 text-sm">
                All products verified by our quality assurance team
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
