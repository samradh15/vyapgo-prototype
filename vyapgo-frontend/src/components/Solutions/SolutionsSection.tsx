'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

const solutions = [
  {
    id: 'copilot',
    name: 'VyapSathi',
    description: 'AI-powered business assistant that handles daily operations, customer queries, and provides intelligent insights.',
    icon: '/images/copilot.png',
    features: ['Voice Commands', 'Smart Automation', '24/7 Support'],
    href: '/copilot'
  },
  {
    id: 'vyapmandi',
    name: 'VyapMandi',
    description: "India's First Quality Assured Market place which provide both B2B and B2C services all together.",
    icon: '/images/mandi.png',
    features: ['Inventory Tracking', 'Order Management', 'Supplier Network'],
    href: '/marketplace'
  },
  {
    id: 'vyapyantra',
    name: 'VyapYantra',
    description: 'AI-powered platform that understands your business and creates intelligent, personalized applications for optimal growth.',
    icon: '/images/yantra.png',
    features: ['Business Analytics', 'Performance Tracking', 'Growth Tools'],
    href: '/platform'
  }
];

export default function SolutionsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div
          className="absolute bottom-32 right-16 w-16 h-16 bg-green-200 rounded-xl opacity-25"
          animate={{ 
            rotate: [0, 15, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            variants={cardVariants as any}
          >
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-yellow-600 to-green-600">Solution Your Business Need</span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            variants={cardVariants as any}
          >
            Comprehensive AI-powered tools designed specifically for Indian businesses. 
            Transform your operations with intelligent automation and insights.
          </motion.p>
        </motion.div>

        {/* Solutions Grid - Optimized for 3 Items */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.id}
              className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              variants={cardVariants as any}
              whileHover={{ 
                scale: 1.02,
                y: -2,
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Logo Image */}
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto relative">
                  <Image
                    src={solution.icon}
                    alt={`${solution.name} logo`}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                  {solution.name}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {solution.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6 justify-center">
                  {solution.features.map((feature, i) => (
                    <span 
                      key={i} 
                      className="text-xs px-3 py-1 bg-orange-50 text-orange-700 rounded-full border border-orange-100"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Learn More Arrow - Subtle */}
                <div className="flex items-center justify-center text-orange-600 font-medium group-hover:text-orange-500 transition-colors duration-300">
                  <span className="mr-2">Learn More</span>
                  <motion.svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                    className="transform group-hover:translate-x-1 transition-transform duration-300"
                  >
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </motion.svg>
                </div>
              </div>

              {/* Subtle Hover Effect - Much Less Bright */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-100 via-yellow-100 to-green-100 opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          variants={cardVariants as any}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-orange-500 via-yellow-500 to-green-500 hover:from-orange-600 hover:via-yellow-600 hover:to-green-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore All Solutions
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
