'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import Link from 'next/link';

interface GenerationPhase {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  progress: number;
  completed: boolean;
  codeBlocks: string[];
  duration: number;
}

interface BusinessData {
  name: string;
  type: string;
  features: string[];
  industry: string;
  scale: string;
}

export default function AppCreationStudio() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [visibleCodeLines, setVisibleCodeLines] = useState(0);
  const [businessData, setBusinessData] = useState<BusinessData>({
    name: '',
    type: '',
    features: [],
    industry: '',
    scale: ''
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const phases: GenerationPhase[] = [
    {
      id: 'analysis',
      title: 'Business Intelligence Analysis',
      subtitle: 'Understanding Your Vision',
      description: 'Deep learning algorithms analyze your business model, market position, and growth potential',
      progress: 0,
      completed: false,
      duration: 4000,
      codeBlocks: [
        '// Advanced Business Analysis Engine',
        'const businessIntelligence = {',
        `  name: "${businessData.name}",`,
        `  type: "${businessData.type}",`,
        `  industry: "${businessData.industry}",`,
        '  marketAnalysis: await analyzeMarket(),',
        '  competitorInsights: await getCompetitorData(),',
        '  growthPotential: calculateGrowthMetrics()',
        '};'
      ]
    },
    {
      id: 'architecture',
      title: 'Neural Architecture Design',
      subtitle: 'Crafting the Foundation',
      description: 'AI architects design scalable, enterprise-grade application structure optimized for your business',
      progress: 0,
      completed: false,
      duration: 5000,
      codeBlocks: [
        '// Enterprise Architecture Generation',
        'import { createAdvancedNavigation } from "@vyapgo/core";',
        'import { BusinessLogicEngine } from "@vyapgo/business";',
        'import { SecurityLayer } from "@vyapgo/security";',
        '',
        'const AppArchitecture = () => {',
        '  const navigation = createAdvancedNavigation({',
        '    businessType: businessIntelligence.type,',
        '    features: businessIntelligence.features,',
        '    scalability: "enterprise-grade"',
        '  });',
        '',
        '  return (',
        '    <SecurityLayer>',
        '      <BusinessLogicEngine>',
        '        {navigation}',
        '      </BusinessLogicEngine>',
        '    </SecurityLayer>',
        '  );',
        '};'
      ]
    },
    {
      id: 'components',
      title: 'Intelligent Component Synthesis',
      subtitle: 'Building Your Business Logic',
      description: 'Advanced AI creates sophisticated, industry-specific components tailored to your workflow',
      progress: 0,
      completed: false,
      duration: 6000,
      codeBlocks: [
        '// Intelligent Business Components',
        'const BillingSystem = () => {',
        '  const [transactions, setTransactions] = useState([]);',
        '  const [analytics, setAnalytics] = useState({});',
        '',
        '  const processPayment = useCallback(async (order) => {',
        '    const result = await PaymentProcessor.process({',
        '      amount: order.total,',
        '      currency: "INR",',
        '      method: order.paymentMethod,',
        '      gstCalculation: true,',
        '      businessType: businessIntelligence.type',
        '    });',
        '',
        '    await updateInventory(order.items);',
        '    await generateInvoice(result);',
        '    await sendNotification(order.customer);',
        '',
        '    return result;',
        '  }, []);',
        '',
        '  return (',
        '    <BillingInterface',
        '      onPayment={processPayment}',
        '      analytics={analytics}',
        '      businessData={businessIntelligence}',
        '    />',
        '  );',
        '};'
      ]
    },
    {
      id: 'optimization',
      title: 'Performance Quantum Optimization',
      subtitle: 'Maximizing Efficiency',
      description: 'Quantum-inspired algorithms optimize every aspect for lightning-fast performance and scalability',
      progress: 0,
      completed: false,
      duration: 4000,
      codeBlocks: [
        '// Quantum Performance Optimization',
        'import { QuantumOptimizer } from "@vyapgo/quantum";',
        'import { PerformanceMonitor } from "@vyapgo/analytics";',
        '',
        'const OptimizedApp = memo(() => {',
        '  const optimizedData = useMemo(() => {',
        '    return QuantumOptimizer.optimize({',
        '      businessLogic: businessIntelligence,',
        '      userPatterns: analytics.userBehavior,',
        '      performanceTargets: {',
        '        loadTime: "< 100ms",',
        '        memoryUsage: "< 50MB",',
        '        batteryEfficiency: "95%"',
        '      }',
        '    });',
        '  }, [businessIntelligence, analytics]);',
        '',
        '  return (',
        '    <PerformanceMonitor>',
        '      <OptimizedBusinessApp data={optimizedData} />',
        '    </PerformanceMonitor>',
        '  );',
        '});'
      ]
    },
    {
      id: 'deployment',
      title: 'Deployment Orchestration',
      subtitle: 'Launch Preparation',
      description: 'Automated deployment pipeline with enterprise security, monitoring, and global distribution',
      progress: 0,
      completed: false,
      duration: 3000,
      codeBlocks: [
        '// Enterprise Deployment Configuration',
        'const deploymentConfig = {',
        '  environment: "production",',
        '  security: {',
        '    encryption: "AES-256",',
        '    authentication: "OAuth2 + Biometric",',
        '    dataProtection: "GDPR + Indian Privacy Laws"',
        '  },',
        '  performance: {',
        '    cdn: "Global Edge Network",',
        '    caching: "Intelligent Multi-Layer",',
        '    monitoring: "Real-time Analytics"',
        '  },',
        '  scalability: {',
        '    autoScaling: true,',
        '    loadBalancing: "AI-Optimized",',
        '    globalDistribution: true',
        '  }',
        '};',
        '',
        '// Your app is now ready for global deployment!',
        'console.log("🚀 App successfully generated and optimized");'
      ]
    }
  ];

  const [generationPhases, setGenerationPhases] = useState(phases);

  const startVoiceRecognition = useCallback(() => {
    setIsListening(true);
    
    // Enhanced voice simulation
    setTimeout(() => {
      const enhancedTranscript = "I run a premium electronics store called TechHub Pro in Mumbai. We sell smartphones, laptops, and accessories. I need advanced billing with GST, real-time inventory tracking, customer loyalty programs, and detailed analytics dashboard.";
      setTranscript(enhancedTranscript);
      
      setBusinessData({
        name: "TechHub Pro",
        type: "Electronics Store",
        features: ["Advanced Billing", "Inventory Management", "Customer Loyalty", "Analytics Dashboard"],
        industry: "Electronics Retail",
        scale: "Premium"
      });
      
      setIsListening(false);
      
      setTimeout(() => {
        startGeneration();
      }, 2000);
    }, 4000);
  }, []);

  const startGeneration = useCallback(() => {
    setIsGenerating(true);
    setCurrentPhase(0);
    setVisibleCodeLines(0);
    
    const processPhase = (phaseIndex: number) => {
      if (phaseIndex >= generationPhases.length) {
        setIsGenerating(false);
        return;
      }

      const currentPhaseData = generationPhases[phaseIndex];
      
      // Reset phase progress
      setGenerationPhases(prev => prev.map((phase, index) => 
        index === phaseIndex ? { ...phase, progress: 0 } : phase
      ));

      // Animate phase progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 1;
        
        setGenerationPhases(prev => prev.map((phase, index) => 
          index === phaseIndex ? { ...phase, progress } : phase
        ));

        // Update code visualization
        const totalLines = currentPhaseData.codeBlocks.length;
        const linesToShow = Math.floor((progress / 100) * totalLines);
        setVisibleCodeLines(linesToShow);

        if (progress >= 100) {
          clearInterval(progressInterval);
          
          // Mark phase as completed
          setGenerationPhases(prev => prev.map((phase, index) => 
            index === phaseIndex ? { ...phase, completed: true } : phase
          ));

          // Move to next phase
          setTimeout(() => {
            setCurrentPhase(phaseIndex + 1);
            processPhase(phaseIndex + 1);
          }, 1000);
        }
      }, currentPhaseData.duration / 100);
    };

    processPhase(0);
  }, [generationPhases]);

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-900 relative overflow-hidden">
      
      {/* Simple VyapGo Logo Header */}
      <div className="relative z-20 p-6">
        <Link href="/" className="inline-flex items-center space-x-3 group">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-md"></div>
          </div>
          <span className="text-2xl font-bold text-white transition-colors duration-200 group-hover:text-orange-300">
            VyapGo
          </span>
        </Link>
      </div>

      {/* Advanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-green-500/5" />
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 80%, #f97316 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, #22c55e 0%, transparent 50%)',
              'radial-gradient(circle at 40% 40%, #fbbf24 0%, transparent 50%)',
              'radial-gradient(circle at 20% 80%, #f97316 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12">
        
        {/* Premium Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-6xl lg:text-7xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="text-white">VyapGo</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-400 to-green-400">
              Creation Studio
            </span>
          </motion.h1>
          <motion.p
            className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Experience the future of app development. Advanced AI architects craft 
            enterprise-grade applications tailored to your business vision.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Left Side - Voice Interface & Progress */}
          <div className="space-y-8">
            
            {/* Premium Voice Interface */}
            {!isGenerating && (
              <motion.div
                className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                onMouseMove={handleMouseMove}
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d"
                }}
              >
                {/* Floating Orbs */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full blur-sm animate-pulse" />
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full blur-sm animate-pulse" />
                
                <div className="text-center space-y-8">
                  <div className="relative">
                    <motion.button
                      onClick={startVoiceRecognition}
                      disabled={isListening}
                      className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isListening 
                          ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                          : 'bg-gradient-to-r from-orange-500 via-yellow-500 to-green-500 hover:scale-110'
                      }`}
                      whileHover={{ scale: isListening ? 1 : 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      animate={isListening ? {
                        boxShadow: [
                          '0 0 0 0 rgba(239, 68, 68, 0.7)',
                          '0 0 0 20px rgba(239, 68, 68, 0)',
                          '0 0 0 0 rgba(239, 68, 68, 0.7)'
                        ]
                      } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2s-2-.9-2-2V4c0-1.1.9-2 2-2zm5.3 6.7c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4-1.2 1.2-2.6 2.1-4.2 2.6v1.9c2.8-.5 5-2.9 5-5.8 0-.6.4-1 1-1s1 .4 1 1c0 4.1-3.1 7.5-7 7.9V19h3c.6 0 1 .4 1 1s-.4 1-1 1H8c-.6 0-1-.4-1-1s.4-1 1-1h3v-2.1c-3.9-.4-7-3.8-7-7.9 0-.6.4-1 1-1s1 .4 1 1c0 2.9 2.2 5.3 5 5.8v-1.9c-1.6-.5-3-1.4-4.2-2.6-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0C8.3 9.3 10.1 10 12 10s3.7-.7 4.3-1.3z"/>
                      </svg>
                      
                      {/* Listening Animation */}
                      {isListening && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-4 border-white/30"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </motion.button>
                  </div>
                  
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-4">
                      {isListening ? 'Neural Processing Active' : 'Describe Your Business Vision'}
                    </h3>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {isListening 
                        ? 'Advanced AI is analyzing your business model, market position, and growth potential in real-time'
                        : 'Share your business story, goals, and requirements. Our AI will craft the perfect application for your needs'
                      }
                    </p>
                  </div>
                </div>
                
                {transcript && (
                  <motion.div
                    className="mt-8 p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-400/30"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h4 className="font-semibold text-blue-300 mb-3 text-lg">Business Intelligence Captured:</h4>
                    <p className="text-blue-100 leading-relaxed">{transcript}</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Advanced Generation Progress */}
            {isGenerating && (
              <motion.div
                className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-3xl font-bold text-white mb-8">Neural Generation Progress</h3>
                
                <div className="space-y-8">
                  {generationPhases.map((phase, index) => (
                    <div key={phase.id} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <motion.div 
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                              phase.completed 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                                : index === currentPhase
                                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white'
                                  : 'bg-gray-700 text-gray-400'
                            }`}
                            animate={index === currentPhase ? {
                              scale: [1, 1.1, 1],
                              boxShadow: [
                                '0 0 0 0 rgba(249, 115, 22, 0.7)',
                                '0 0 0 10px rgba(249, 115, 22, 0)',
                                '0 0 0 0 rgba(249, 115, 22, 0.7)'
                              ]
                            } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {phase.completed ? '✓' : index + 1}
                          </motion.div>
                          <div>
                            <h4 className="font-bold text-white text-lg">{phase.title}</h4>
                            <p className="text-orange-300 font-medium">{phase.subtitle}</p>
                            <p className="text-gray-400 text-sm mt-1">{phase.description}</p>
                          </div>
                        </div>
                        {index === currentPhase && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-orange-400">
                              {phase.progress}%
                            </div>
                            <div className="text-xs text-gray-400">Processing</div>
                          </div>
                        )}
                      </div>
                      
                      {index === currentPhase && (
                        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-orange-500 via-yellow-500 to-green-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${phase.progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Completion Celebration */}
            {!isGenerating && currentPhase >= generationPhases.length && (
              <motion.div
                className="bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-3xl p-10 border border-green-400/30 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                >
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </motion.div>
                <h3 className="text-4xl font-bold text-white mb-4">Enterprise App Generated!</h3>
                <p className="text-xl text-gray-300 mb-8">
                  Your premium business application is ready for deployment with enterprise-grade security and performance.
                </p>
                <div className="space-y-4">
                  <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
                    Download Premium App (.apk)
                  </button>
                  <button className="w-full bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 border border-white/30">
                    Access Source Code & Documentation
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Side - Advanced Code Visualization */}
          <div className="space-y-8">
            <motion.div
              className="bg-gray-900/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-gray-700"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Premium Terminal Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-gray-300 text-sm ml-4 font-mono">VyapGo Neural Architect</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-xs text-gray-400">
                    Phase: {currentPhase + 1}/{generationPhases.length}
                  </div>
                  <motion.div 
                    className="w-2 h-2 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>
              
              {/* Advanced Code Content */}
              <div className="p-6 h-[500px] overflow-y-auto">
                <div className="space-y-1 font-mono text-sm">
                  {currentPhase < generationPhases.length && generationPhases[currentPhase]?.codeBlocks.map((line, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      animate={index < visibleCodeLines ? { 
                        opacity: 1, 
                        x: 0,
                        color: line.startsWith('//') ? '#6b7280' : 
                               line.includes('import') ? '#f97316' :
                               line.includes('const') || line.includes('function') ? '#22c55e' :
                               line.includes('<') || line.includes('/>') ? '#fbbf24' : '#ffffff'
                      } : {}}
                      transition={{ 
                        duration: 0.6, 
                        delay: index * 0.1
                      }}
                    >
                      <span className="text-gray-500 w-8 text-right mr-4 select-none">
                        {line ? index + 1 : ''}
                      </span>
                      <span className="relative">
                        {line}
                        {index === visibleCodeLines - 1 && (
                          <motion.div
                            className="absolute top-0 -left-2 w-1 h-6 bg-gradient-to-b from-orange-500 to-yellow-500 rounded-sm"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        )}
                      </span>
                    </motion.div>
                  ))}
                  
                  {/* Advanced Cursor */}
                  {isGenerating && visibleCodeLines < (generationPhases[currentPhase]?.codeBlocks.length || 0) && (
                    <motion.div className="flex items-start">
                      <span className="text-gray-500 w-8 text-right mr-4 select-none">
                        {visibleCodeLines + 1}
                      </span>
                      <motion.div
                        className="w-3 h-5 bg-gradient-to-b from-orange-500 to-yellow-500 rounded-sm"
                        animate={{ 
                          opacity: [1, 0.3, 1],
                          scaleY: [1, 0.8, 1]
                        }}
                        transition={{ 
                          duration: 1.2, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                      />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Business Intelligence Display */}
            {businessData.name && (
              <motion.div
                className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-2xl font-bold text-white mb-6">Business Intelligence Analysis</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <span className="text-gray-400 text-sm">Business Name</span>
                      <p className="text-white font-semibold text-lg">{businessData.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Industry</span>
                      <p className="text-orange-300 font-semibold">{businessData.industry}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className="text-gray-400 text-sm">Business Type</span>
                      <p className="text-white font-semibold">{businessData.type}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Scale</span>
                      <p className="text-green-300 font-semibold">{businessData.scale}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <span className="text-gray-400 text-sm">Advanced Features</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {businessData.features.map((feature, index) => (
                      <motion.span
                        key={index}
                        className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-orange-300 px-4 py-2 rounded-full text-sm font-medium border border-orange-500/30"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {feature}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
