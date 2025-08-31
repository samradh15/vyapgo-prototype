'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

interface CodeBlock {
  id: number;
  content: string;
  type: 'import' | 'function' | 'component' | 'export' | 'comment';
  indent: number;
}

export default function AppCreationPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeBlock, setActiveBlock] = useState(0);
  const [completedBlocks, setCompletedBlocks] = useState<number[]>([]);
  const [particleKey, setParticleKey] = useState(0);
  const [animationCycle, setAnimationCycle] = useState(0); // Track animation cycles

  // Updated business app code blocks
  const codeBlocks: CodeBlock[] = [
    { id: 1, content: "// VyapGO Business App - Auto Generated", type: 'comment', indent: 0 },
    { id: 2, content: "import React, { useState, useEffect } from 'react';", type: 'import', indent: 0 },
    { id: 3, content: "import { View, Text, TouchableOpacity, FlatList } from 'react-native';", type: 'import', indent: 0 },
    { id: 4, content: "import { InventoryAPI, SalesAPI, CustomerAPI } from '@vyapgo/api';", type: 'import', indent: 0 },
    { id: 5, content: "", type: 'comment', indent: 0 },
    { id: 6, content: "export default function BusinessDashboard() {", type: 'export', indent: 0 },
    { id: 7, content: "const [inventory, setInventory] = useState([]);", type: 'function', indent: 1 },
    { id: 8, content: "const [todaySales, setTodaySales] = useState(0);", type: 'function', indent: 1 },
    { id: 9, content: "const [lowStockItems, setLowStockItems] = useState([]);", type: 'function', indent: 1 },
    { id: 10, content: "", type: 'comment', indent: 0 },
    { id: 11, content: "useEffect(() => {", type: 'function', indent: 1 },
    { id: 12, content: "InventoryAPI.getStock().then(setInventory);", type: 'function', indent: 2 },
    { id: 13, content: "SalesAPI.getTodayTotal().then(setTodaySales);", type: 'function', indent: 2 },
    { id: 14, content: "InventoryAPI.getLowStock().then(setLowStockItems);", type: 'function', indent: 2 },
    { id: 15, content: "}, []);", type: 'function', indent: 1 },
    { id: 16, content: "", type: 'comment', indent: 0 },
    { id: 17, content: "return (", type: 'function', indent: 1 },
    { id: 18, content: "<View style={styles.dashboard}>", type: 'component', indent: 2 },
    { id: 19, content: "<Text style={styles.title}>आज का बिज़नेस</Text>", type: 'component', indent: 3 },
    { id: 20, content: "<View style={styles.salesCard}>", type: 'component', indent: 3 },
    { id: 21, content: "<Text>Today's Sales: ₹{todaySales}</Text>", type: 'component', indent: 4 },
    { id: 22, content: "</View>", type: 'component', indent: 3 },
    { id: 23, content: "<TouchableOpacity onPress={addNewSale}>", type: 'component', indent: 3 },
    { id: 24, content: "<Text>Add New Sale</Text>", type: 'component', indent: 4 },
    { id: 25, content: "</TouchableOpacity>", type: 'component', indent: 3 },
    { id: 26, content: "</View>", type: 'component', indent: 2 },
    { id: 27, content: ");", type: 'function', indent: 1 },
    { id: 28, content: "}", type: 'export', indent: 0 }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'import': return '#f97316'; // VyapGo orange
      case 'function': return '#22c55e'; // VyapGo green
      case 'component': return '#fbbf24'; // VyapGo yellow
      case 'export': return '#f97316'; // VyapGo orange
      case 'comment': return '#6b7280'; // Gray
      default: return '#ffffff';
    }
  };

  // Modified useEffect for auto-restart animation
  useEffect(() => {
    if (!isInView) return;

    // If animation is complete, wait 5 seconds then restart
    if (activeBlock >= codeBlocks.length) {
      const restartTimer = setTimeout(() => {
        setActiveBlock(0);
        setCompletedBlocks([]);
        setAnimationCycle(prev => prev + 1);
        setParticleKey(prev => prev + 1);
      }, 5000); // 5 second delay before restart

      return () => clearTimeout(restartTimer);
    }

    // Continue normal animation
    if (activeBlock < codeBlocks.length) {
      const timer = setTimeout(() => {
        setCompletedBlocks(prev => [...prev, activeBlock]);
        setActiveBlock(prev => prev + 1);
        setParticleKey(prev => prev + 1);
      }, 600); // Slightly faster animation

      return () => clearTimeout(timer);
    }
  }, [isInView, activeBlock, codeBlocks.length, animationCycle]);

  const handleCreateApp = () => {
    window.location.href = '/create-app';
  };

  return (
    <section ref={ref} className="py-32 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Custom VyapGo Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
          <defs>
            <pattern id="vyapgo-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="#f97316" opacity="0.3">
                <animate attributeName="r" values="2;4;2" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="5" cy="5" r="1" fill="#22c55e" opacity="0.2">
                <animate attributeName="r" values="1;2;1" dur="3s" repeatCount="indefinite" />
              </circle>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#vyapgo-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Side - Content */}
          <motion.div
            className="space-y-12"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Watch Your Business App
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
                    Come to Life
                  </span>
                </h2>
              </motion.div>
              
              <motion.p
                className="text-xl text-gray-600 leading-relaxed max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                See how VyapYantra creates a complete business management app with inventory tracking, 
                sales management, and customer analytics - all in real-time.
              </motion.p>
            </div>

            {/* Custom Progress Visualization */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  {[0, 1, 2, 3, 4].map((step) => (
                    <motion.div
                      key={step}
                      className={`w-3 h-3 rounded-full transition-all duration-500 ${
                        step <= Math.floor(activeBlock / 6) 
                          ? 'bg-gradient-to-r from-orange-500 to-yellow-500' 
                          : 'bg-gray-200'
                      }`}
                      animate={step === Math.floor(activeBlock / 6) ? {
                        scale: [1, 1.3, 1],
                        boxShadow: ['0 0 0 0 rgba(249, 115, 22, 0.7)', '0 0 0 10px rgba(249, 115, 22, 0)', '0 0 0 0 rgba(249, 115, 22, 0)']
                      } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {activeBlock >= codeBlocks.length ? 'Complete - Restarting...' : `${Math.round((activeBlock / codeBlocks.length) * 100)}% Complete`}
                </span>
              </div>
              
              <div className="relative">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-500 via-yellow-500 to-green-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: activeBlock >= codeBlocks.length ? '100%' : `${(activeBlock / codeBlocks.length) * 100}%` 
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                {/* Flowing particles along progress bar */}
                <motion.div
                  key={particleKey}
                  className="absolute top-0 left-0 w-2 h-2 bg-white rounded-full shadow-lg"
                  initial={{ x: 0, opacity: 1 }}
                  animate={{ 
                    x: activeBlock >= codeBlocks.length ? '100%' : `${(activeBlock / codeBlocks.length) * 100}%`,
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>

              {/* Animation Cycle Counter */}
              
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <button
                onClick={handleCreateApp}
                className="group relative bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 overflow-hidden"
              >
                <span className="relative z-10">Build Your Business App</span>
                {/* Custom hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </button>
            </motion.div>
          </motion.div>

          {/* Right Side - Custom VyapGo Code Animation */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            {/* Custom VyapGo Code Container */}
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-700 overflow-hidden">
              
              {/* VyapGo Brand Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full animate-pulse" />
                  <span className="text-orange-400 font-semibold">VyapYantra App Generator</span>
                </div>
                <div className="text-xs text-gray-400 font-mono">
                  {activeBlock}/{codeBlocks.length} blocks
                </div>
              </div>

              {/* Custom Code Animation */}
              <div className="space-y-1 font-mono text-sm h-96 overflow-hidden relative">
                {codeBlocks.map((block, index) => (
                  <motion.div
                    key={`${block.id}-${animationCycle}`} // Key includes cycle for proper re-animation
                    className="flex items-start relative"
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={index < activeBlock ? { 
                      opacity: 1, 
                      x: 0, 
                      scale: 1,
                      color: getTypeColor(block.type)
                    } : {}}
                    transition={{ 
                      duration: 0.4, 
                      ease: "easeOut",
                      delay: index === activeBlock - 1 ? 0.1 : 0
                    }}
                    style={{ paddingLeft: `${block.indent * 16}px` }}
                  >
                    {/* Line number */}
                    <span className="text-gray-500 w-8 text-right mr-4 select-none">
                      {block.content ? block.id : ''}
                    </span>
                    
                    {/* Code content with custom glow */}
                    <span 
                      className="relative"
                      style={{ 
                        color: getTypeColor(block.type),
                        textShadow: index === activeBlock - 1 ? `0 0 10px ${getTypeColor(block.type)}40` : 'none'
                      }}
                    >
                      {block.content}
                      
                      {/* Custom VyapGo spark effect */}
                      {index === activeBlock - 1 && (
                        <motion.div
                          className="absolute -top-1 -left-2 w-1 h-6"
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ 
                            opacity: [0, 1, 0], 
                            scaleY: [0, 1, 0],
                            background: [
                              `linear-gradient(to bottom, ${getTypeColor(block.type)}, transparent)`,
                              `linear-gradient(to bottom, #fbbf24, transparent)`,
                              `linear-gradient(to bottom, ${getTypeColor(block.type)}, transparent)`
                            ]
                          }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      )}
                    </span>
                  </motion.div>
                ))}
                
                {/* VyapGo Custom Cursor */}
                {activeBlock < codeBlocks.length && (
                  <motion.div
                    className="flex items-start"
                    style={{ paddingLeft: `${codeBlocks[activeBlock]?.indent * 16 || 0}px` }}
                  >
                    <span className="text-gray-500 w-8 text-right mr-4 select-none">
                      {codeBlocks[activeBlock]?.id}
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

              {/* VyapGo Signature Background Flow */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 w-full h-full opacity-10"
                  animate={{
                    background: [
                      'radial-gradient(circle at 20% 50%, #f97316 0%, transparent 50%)',
                      'radial-gradient(circle at 80% 50%, #22c55e 0%, transparent 50%)',
                      'radial-gradient(circle at 50% 20%, #fbbf24 0%, transparent 50%)',
                      'radial-gradient(circle at 20% 50%, #f97316 0%, transparent 50%)'
                    ]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </div>

            {/* VyapGo Floating Status Indicators */}
            <motion.div
              className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 shadow-lg"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <div className="flex items-center space-x-2">
                <motion.div 
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-white text-sm font-medium">
                  {activeBlock >= codeBlocks.length ? 'Complete' : 'Generating'}
                </span>
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-4 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl p-4 shadow-lg"
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {activeBlock >= codeBlocks.length ? '100' : Math.round((activeBlock / codeBlocks.length) * 100)}%
                </div>
                <div className="text-xs text-orange-100">
                  {activeBlock >= codeBlocks.length ? 'Ready' : 'Generated'}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
