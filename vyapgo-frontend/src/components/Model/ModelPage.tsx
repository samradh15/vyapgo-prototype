'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import VoiceTextInput from './VoiceTextInput';
import AgentTheater from './AgentTheater';
import CodePreview from './CodePreview';
import ProcessingStages from './ProcessingStages';
import FeatureHighlights from './FeatureHighlights';

export default function ModelPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [businessData, setBusinessData] = useState(null);

  const handleInputSubmit = async (input: string, type: 'voice' | 'text') => {
    setIsProcessing(true);
    setCurrentStage('Analyzing your business requirements...');
    
    // Simulate processing stages
    const stages = [
      'Analyzing your business requirements...',
      'Voice Parser Agent extracting business data...',
      'Business Analyst Agent recommending features...',
      'Database Agent designing schema...',
      'UI Designer Agent creating mockups...',
      'Code Generator Agent writing React Native code...',
      'Review Agent checking quality...',
      'App ready for download!'
    ];

    for (let i = 0; i < stages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStage(stages[i]);
      
      if (i === 6) {
        // Simulate code generation
        setGeneratedCode(`
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default function ${input.includes('electronics') ? 'Electronics' : 'Business'}App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Products" component={ProductsScreen} />
        <Tab.Screen name="Orders" component={OrdersScreen} />
        <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
        `);
      }
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="relative z-10 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <motion.h1 
            className="text-5xl lg:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            VyapGo AI Model
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Experience the future of app development. Speak or type your business idea 
            and watch our AI agents create your mobile app in real-time.
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 pb-20">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Side - Input & Features */}
          <div className="lg:col-span-5 space-y-8">
            <VoiceTextInput onSubmit={handleInputSubmit} isProcessing={isProcessing} />
            <FeatureHighlights />
          </div>
          
          {/* Right Side - Agent Theater */}
          <div className="lg:col-span-7">
            <AgentTheater 
              isProcessing={isProcessing} 
              currentStage={currentStage}
              businessData={businessData}
            />
          </div>
        </div>
        
        {/* Processing Stages */}
        {isProcessing && (
          <div className="mt-12">
            <ProcessingStages currentStage={currentStage} />
          </div>
        )}
        
        {/* Code + Preview Section */}
        {generatedCode && (
          <div className="mt-12">
            <CodePreview code={generatedCode} />
          </div>
        )}
      </div>
    </div>
  );
}
