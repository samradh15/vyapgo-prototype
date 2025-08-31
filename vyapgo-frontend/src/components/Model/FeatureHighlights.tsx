'use client';

import { motion } from 'framer-motion';

const features = [
  {
    icon: '🎤',
    title: 'Voice First',
    description: 'Speak in Hindi or English to describe your business naturally'
  },
  {
    icon: '🤖',
    title: 'AI Agents',
    description: 'Multiple specialized AI agents work together to build your app'
  },
  {
    icon: '📱',
    title: 'Complete Ownership',
    description: 'Get full source code and APK file, not just a rental'
  },
  {
    icon: '🏪',
    title: 'VyapMandi Ready',
    description: 'Instantly list your products on our marketplace'
  },
  {
    icon: '⚡',
    title: '5 Min Generation',
    description: 'From voice input to working app in just 5 minutes'
  },
  {
    icon: '🇮🇳',
    title: 'Made for India',
    description: 'Built specifically for Indian businesses and culture'
  }
];

export default function FeatureHighlights() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
    >
      <h3 className="text-2xl font-bold text-white text-center mb-8">
        Why VyapGo is Revolutionary
      </h3>

      <div className="grid grid-cols-1 gap-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-start space-x-4">
              <div className="text-3xl">{feature.icon}</div>
              <div>
                <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trust Indicators */}
      <div className="bg-gradient-to-r from-orange-500/20 to-green-500/20 rounded-2xl p-6 border border-orange-500/30">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">50K+</div>
            <div className="text-white/70 text-sm">Shopkeepers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">98.5%</div>
            <div className="text-white/70 text-sm">Success Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">5 Min</div>
            <div className="text-white/70 text-sm">Generation</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

