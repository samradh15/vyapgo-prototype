'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text3D, Sphere } from '@react-three/drei';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import * as THREE from 'three';

interface BusinessAnalysis {
  businessType: string;
  businessName: string;
  features: string[];
  confidence: number;
  isComplete: boolean;
}

interface VoiceOrbProps {
  isListening: boolean;
  audioData: number[];
  businessType: string;
}

function VoiceOrb({ isListening, audioData, businessType }: VoiceOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const breathingScale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      const audioScale = isListening ? 1 + (audioData.reduce((a, b) => a + b, 0) / audioData.length) * 0.5 : 1;
      
      meshRef.current.scale.setScalar(breathingScale * audioScale);
      meshRef.current.rotation.y += 0.01;
    }
  });

  const getOrbColor = () => {
    switch (businessType) {
      case 'grocery': return '#22c55e';
      case 'electronics': return '#3b82f6';
      case 'clothing': return '#a855f7';
      case 'pharmacy': return '#ef4444';
      case 'restaurant': return '#f97316';
      default: return '#f97316';
    }
  };

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color={getOrbColor()}
          emissive={getOrbColor()}
          emissiveIntensity={isListening ? 0.3 : 0.1}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

function AudioParticles({ audioData, isListening }: { audioData: number[]; isListening: boolean }) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 100;

  useFrame(() => {
    if (particlesRef.current && isListening) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const audioValue = audioData[i % audioData.length] || 0;
        
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 2 + audioValue * 3;
        
        positions[i3] = Math.cos(angle) * radius;
        positions[i3 + 1] = Math.sin(angle) * radius;
        positions[i3 + 2] = Math.sin(angle * 3) * audioValue;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const angle = (i / particleCount) * Math.PI * 2;
    positions[i3] = Math.cos(angle) * 2;
    positions[i3 + 1] = Math.sin(angle) * 2;
    positions[i3 + 2] = 0;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={particleCount}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#f97316" />
    </points>
  );
}

export default function VoiceInterfaceRoom() {
  const [businessAnalysis, setBusinessAnalysis] = useState<BusinessAnalysis>({
    businessType: '',
    businessName: '',
    features: [],
    confidence: 0,
    isComplete: false
  });
  
  const [audioData, setAudioData] = useState<number[]>(new Array(50).fill(0));
  const [currentStep, setCurrentStep] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const {
    isSupported,
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition({
    continuous: true,
    interimResults: true,
    lang: 'hi-IN',
    onResult: (transcript, isFinal) => {
      if (isFinal) {
        analyzeBusinessDescription(transcript);
      }
    },
    onStart: () => {
      initializeAudioVisualization();
    }
  });

  const initializeAudioVisualization = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateAudioData = () => {
        if (analyserRef.current && isListening) {
          analyserRef.current.getByteFrequencyData(dataArray);
          setAudioData(Array.from(dataArray).map(value => value / 255));
          requestAnimationFrame(updateAudioData);
        }
      };
      
      updateAudioData();
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  }, [isListening]);

  const analyzeBusinessDescription = useCallback(async (text: string) => {
    const businessTypes = ['grocery', 'electronics', 'clothing', 'pharmacy', 'restaurant'];
    const detectedType = businessTypes.find(type => 
      text.toLowerCase().includes(type) || 
      text.includes('दुकान') || 
      text.includes('shop')
    ) || 'grocery';

    const nameMatch = text.match(/मेरा नाम (.+?) है|my name is (.+?)[\s,.]|(.+?) shop|(.+?) store/i);
    const businessName = nameMatch ? nameMatch[1] || nameMatch[2] || nameMatch[3] || nameMatch[4] : 'My Shop';

    setBusinessAnalysis({
      businessType: detectedType,
      businessName: businessName.trim(),
      features: ['billing', 'inventory', 'customer_management'],
      confidence: 0.85,
      isComplete: true
    });

    setCurrentStep(prev => Math.min(prev + 1, 3));
  }, []);

  const handleVoiceToggle = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setBusinessAnalysis(prev => ({ ...prev, isComplete: false }));
      setCurrentStep(0);
      startListening();
    }
  }, [isListening, startListening, stopListening, resetTranscript]);

  const handleCreateApp = useCallback(() => {
    window.location.href = '/create-app';
  }, []);

  const steps = [
    {
      title: 'अपने बिजनेस के बारे में बताएं',
      subtitle: 'Tell us about your business',
      prompt: 'Say: "मैं एक किराना दुकान चलाता हूं" or "I run a grocery store"'
    },
    {
      title: 'आपका बिजनेस समझ रहे हैं',
      subtitle: 'Understanding your business',
      prompt: 'Analyzing your requirements...'
    },
    {
      title: 'ऐप फीचर्स तैयार कर रहे हैं',
      subtitle: 'Preparing app features',
      prompt: 'Generating customized features for your business...'
    },
    {
      title: 'आपका ऐप तैयार है!',
      subtitle: 'Your app is ready!',
      prompt: 'Click below to preview your generated app'
    }
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-orange-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-green-500/10"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="min-h-screen flex items-center">
          <div className="w-full grid lg:grid-cols-2 gap-12 items-center">
            
            <div className="relative h-96 lg:h-[500px]">
              <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={0.5} />
                
                <VoiceOrb 
                  isListening={isListening}
                  audioData={audioData}
                  businessType={businessAnalysis.businessType}
                />
                
                <AudioParticles audioData={audioData} isListening={isListening} />
                
                {businessAnalysis.businessType && (
                  <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
                    <Text3D
                      font="/fonts/helvetiker_regular.typeface.json"
                      size={0.3}
                      height={0.1}
                      position={[0, 2, 0]}
                    >
                      {businessAnalysis.businessType.toUpperCase()}
                      <meshStandardMaterial color="#ffffff" />
                    </Text3D>
                  </Float>
                )}
                
                <OrbitControls enableZoom={false} enablePan={false} />
              </Canvas>
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <button
                  onClick={handleVoiceToggle}
                  disabled={!isSupported}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 shadow-lg ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                      : isSupported 
                        ? 'bg-white hover:bg-gray-100 text-gray-900' 
                        : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
                >
                  {isListening ? 'रुकें' : isSupported ? 'बोलें' : 'Voice Not Available'}
                </button>
              </div>
            </div>

            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-2">
                      {steps.map((_, index) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                            index <= currentStep ? 'bg-orange-400' : 'bg-white/30'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-white/70 text-sm">
                      Step {currentStep + 1} of {steps.length}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-white">
                      {steps[currentStep].title}
                    </h2>
                    <p className="text-xl text-orange-200">
                      {steps[currentStep].subtitle}
                    </p>
                    <p className="text-white/80">
                      {steps[currentStep].prompt}
                    </p>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {transcript && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-blue-500/20 backdrop-blur-md rounded-xl p-6 border border-blue-400/30"
                  >
                    <h3 className="text-lg font-semibold text-white mb-3">
                      आपने कहा / You said:
                    </h3>
                    <p className="text-blue-100">{transcript}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {businessAnalysis.isComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-green-500/20 backdrop-blur-md rounded-xl p-6 border border-green-400/30"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4">
                      समझा गया / Understood:
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-green-200">Business Type:</span>
                        <span className="text-white ml-2 capitalize">{businessAnalysis.businessType}</span>
                      </div>
                      <div>
                        <span className="text-green-200">Business Name:</span>
                        <span className="text-white ml-2">{businessAnalysis.businessName}</span>
                      </div>
                      <div>
                        <span className="text-green-200">Features:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {businessAnalysis.features.map((feature, index) => (
                            <span
                              key={index}
                              className="bg-green-400/20 text-green-100 px-3 py-1 rounded-full text-sm"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-200">Confidence:</span>
                        <div className="flex-1 bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-green-400 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${businessAnalysis.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-white text-sm">
                          {Math.round(businessAnalysis.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <div className="bg-red-500/20 backdrop-blur-md rounded-xl p-6 border border-red-400/30">
                  <p className="text-red-200">{error}</p>
                </div>
              )}

              {businessAnalysis.isComplete && currentStep === 3 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={handleCreateApp}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  अपना ऐप बनाएं - Create Your App Now
                </motion.button>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
