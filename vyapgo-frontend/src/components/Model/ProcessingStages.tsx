'use client';

import { motion } from 'framer-motion';

interface ProcessingStagesProps {
  currentStage: string;
}

const stages = [
  { name: 'Voice Analysis', icon: '🎤', description: 'Processing your business description' },
  { name: 'Business Intelligence', icon: '🧠', description: 'Understanding your requirements' },
  { name: 'Architecture Design', icon: '🏗️', description: 'Planning your app structure' },
  { name: 'Code Generation', icon: '⚡', description: 'Writing React Native code' },
  { name: 'Quality Review', icon: '🔍', description: 'Ensuring app quality' },
  { name: 'Ready to Deploy', icon: '🚀', description: 'Your app is ready!' }
];

export default function ProcessingStages({ currentStage }: ProcessingStagesProps) {
  const getCurrentStageIndex = () => {
    if (currentStage.includes('Analyzing')) return 0;
    if (currentStage.includes('Business Analyst')) return 1;
    if (currentStage.includes('designing') || currentStage.includes('UI Designer')) return 2;
    if (currentStage.includes('Code Generator')) return 3;
    if (currentStage.includes('Review')) return 4;
    if (currentStage.includes('ready')) return 5;
    return 0;
  };

  const currentIndex = getCurrentStageIndex();

  return (
    <motion.div
      className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h3 className="text-2xl font-bold text-white text-center mb-8">
        App Generation Pipeline
      </h3>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-8 left-0 right-0 h-1 bg-white/20 rounded-full">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-green-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentIndex + 1) / stages.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Stages */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.name}
              className={`relative text-center p-4 rounded-2xl transition-all duration-500 ${
                index <= currentIndex
                  ? 'bg-gradient-to-b from-orange-500/20 to-green-500/20 border border-orange-500/30'
                  : 'bg-white/5 border border-white/10'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Stage Icon */}
              <div className={`text-4xl mb-3 ${index <= currentIndex ? 'animate-bounce' : ''}`}>
                {stage.icon}
              </div>

              {/* Stage Name */}
              <h4 className={`font-semibold mb-2 ${
                index <= currentIndex ? 'text-white' : 'text-white/60'
              }`}>
                {stage.name}
              </h4>

              {/* Stage Description */}
              <p className={`text-xs ${
                index <= currentIndex ? 'text-white/80' : 'text-white/40'
              }`}>
                {stage.description}
              </p>

              {/* Active Indicator */}
              {index === currentIndex && (
                <motion.div
                  className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Current Status */}
      <div className="mt-8 text-center">
        <motion.p
          className="text-white/80 text-lg"
          key={currentStage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentStage}
        </motion.p>
      </div>
    </motion.div>
  );
}
