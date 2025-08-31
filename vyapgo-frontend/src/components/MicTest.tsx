import React, { useState } from 'react';

export const MicTest: React.FC = () => {
  const [status, setStatus] = useState('Ready');
  const [error, setError] = useState<string | null>(null);

  const testMicrophone = async () => {
    console.log('🔴 Button clicked!'); // Should appear in console
    setStatus('Requesting microphone...');
    setError(null);

    try {
      console.log('🔴 About to request getUserMedia...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true 
      });
      
      console.log('🟢 Microphone access granted!', stream);
      setStatus('Microphone active!');
      
      // Test for 3 seconds then stop
      setTimeout(() => {
        stream.getTracks().forEach(track => {
          track.stop();
          console.log('🔴 Stopped track:', track);
        });
        setStatus('Test complete');
      }, 3000);
      
    } catch (err) {
      console.error('🔴 Microphone error:', err);
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setStatus('Failed');
    }
  };

  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl mb-4">Microphone Test</h2>
      
      <button
        onClick={testMicrophone}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Test Microphone
      </button>
      
      <p className="mt-4 text-lg">Status: {status}</p>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
    </div>
  );
};
