import React, { useState } from 'react';

export const SimpleVoiceTest: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    console.log('Button clicked!'); // This should appear in console
    
    try {
      setError(null);
      
      if (!isListening) {
        console.log('Starting to listen...');
        setIsListening(true);
        
        // Test microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('Microphone access granted:', stream);
        
        // Stop after 3 seconds for testing
        setTimeout(() => {
          console.log('Stopping test recording');
          stream.getTracks().forEach(track => track.stop());
          setIsListening(false);
        }, 3000);
        
      } else {
        console.log('Stopping listening...');
        setIsListening(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-8">
      <button
        onClick={handleClick}
        className={`
          w-24 h-24 rounded-full text-white font-bold text-lg
          transition-all duration-300 transform hover:scale-105
          ${isListening 
            ? 'bg-red-500 animate-pulse' 
            : 'bg-blue-500 hover:bg-blue-600'
          }
        `}
        style={{ cursor: 'pointer' }} // Force cursor pointer
      >
        {isListening ? 'Stop' : 'Start'}
      </button>
      
      <p className="text-center">
        Status: {isListening ? 'Listening...' : 'Ready to listen'}
      </p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      )}
    </div>
  );
};
