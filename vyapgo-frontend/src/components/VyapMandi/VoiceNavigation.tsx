'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface VoiceNavigationProps {
  onCategorySelect: (category: string) => void;
  selectedCategory: string;
}

export default function VoiceNavigation({ onCategorySelect, selectedCategory }: VoiceNavigationProps) {
  const [isListening, setIsListening] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState('');

  const categories = [
    { id: 'all', name: 'All Categories', icon: 'grid' },
    { id: 'electronics', name: 'Electronics', icon: 'device' },
    { id: 'grocery', name: 'Grocery', icon: 'shopping' },
    { id: 'clothing', name: 'Clothing', icon: 'shirt' },
    { id: 'pharmacy', name: 'Pharmacy', icon: 'medical' },
    { id: 'home', name: 'Home & Garden', icon: 'home' }
  ];

  const startVoiceNavigation = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice navigation not supported in this browser');
      return;
    }

    setIsListening(true);
    
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript.toLowerCase();
      setVoiceCommand(result);
      
      // Process voice command
      if (result.includes('electronics') || result.includes('इलेक्ट्रॉनिक्स')) {
        onCategorySelect('electronics');
      } else if (result.includes('grocery') || result.includes('किराना')) {
        onCategorySelect('grocery');
      } else if (result.includes('clothing') || result.includes('कपड़े')) {
        onCategorySelect('clothing');
      } else if (result.includes('pharmacy') || result.includes('दवा')) {
        onCategorySelect('pharmacy');
      } else if (result.includes('home') || result.includes('घर')) {
        onCategorySelect('home');
      } else if (result.includes('all') || result.includes('सभी')) {
        onCategorySelect('all');
      }
      
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  }, [onCategorySelect]);

  const getIcon = (iconType: string) => {
    const icons = {
      grid: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
      device: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
      shopping: "M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01",
      shirt: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      medical: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      home: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    };
    return icons[iconType as keyof typeof icons] || icons.grid;
  };

  return (
    <section className="py-12 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Browse Categories</h2>
          
          {/* Voice Navigation Button */}
          <button
            onClick={startVoiceNavigation}
            disabled={isListening}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isListening
                ? 'bg-red-500 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2s-2-.9-2-2V4c0-1.1.9-2 2-2z"/>
            </svg>
            <span>{isListening ? 'Listening...' : 'Voice Navigate'}</span>
          </button>
        </div>

        {/* Voice Command Display */}
        {voiceCommand && (
          <motion.div
            className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-green-800 text-sm">
              <span className="font-medium">Voice Command:</span> "{voiceCommand}"
            </p>
          </motion.div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`p-6 rounded-xl text-center transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg 
                className={`w-8 h-8 mx-auto mb-3 ${
                  selectedCategory === category.id ? 'text-white' : 'text-gray-600'
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIcon(category.icon)} />
              </svg>
              <span className="font-medium text-sm">{category.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Voice Instructions */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Voice Navigation Commands</h3>
          <div className="grid md:grid-cols-2 gap-2 text-sm text-blue-800">
            <div>• "Electronics" or "इलेक्ट्रॉनिक्स"</div>
            <div>• "Grocery" or "किराना"</div>
            <div>• "Clothing" or "कपड़े"</div>
            <div>• "Pharmacy" or "दवा"</div>
            <div>• "Home" or "घर"</div>
            <div>• "All" or "सभी"</div>
          </div>
        </div>
      </div>
    </section>
  );
}
