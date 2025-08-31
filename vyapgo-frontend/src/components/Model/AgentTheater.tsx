'use client';

import { motion } from 'framer-motion';

interface AgentTheaterProps {
  isProcessing: boolean;
  currentStage: string;
  businessData: any;
}

const agents = [
  { name: 'Voice Parser', avatar: '🎤', color: 'from-blue-500 to-cyan-500', status: 'idle' },
  { name: 'Business Analyst', avatar: '📊', color: 'from-green-500 to-emerald-500', status: 'idle' },
  { name: 'Database Agent', avatar: '🗄️', color: 'from-purple-500 to-violet-500', status: 'idle' },
  { name: 'UI Designer', avatar: '🎨', color: 'from-pink-500 to-rose-500', status: 'idle' },
  { name: 'Code Generator', avatar: '⚡', color: 'from-yellow-500 to-orange-500', status: 'idle' },
  { name: 'Review Agent', avatar: '🔍', color: 'from-indigo-500 to-blue-500', status: 'idle' }
];

export default function AgentTheater({ isProcessing, currentStage, businessData }: AgentTheaterProps) {
  const getActiveAgent = () => {
    if (currentStage.includes('Voice Parser')) return 0;
    if (currentStage.includes('Business Analyst')) return 1;
    if (currentStage.includes('Database')) return 2;
    if (currentStage.includes('UI Designer')) return 3;
    if (currentStage.includes('Code Generator')) return 4;
    if (currentStage.includes('Review')) return 5;
    return -1;
  };

  const activeAgentIndex = getActiveAgent();

  return (
    <motion.div 
      className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 h-full"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <h3 className="text-2xl font-bold text-white mb-8 text-center">
        AI Agent Orchestra
      </h3>

      {/* Agent Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.name}
            className={`relative p-6 rounded-2xl border transition-all duration-500 ${
              activeAgentIndex === index
                ? 'bg-gradient-to-r ' + agent.color + ' border-white/30 shadow-2xl'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
            animate={{
              scale: activeAgentIndex === index ? 1.05 : 1,
              y: activeAgentIndex === index ? -5 : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <div className="text-3xl mb-3">{agent.avatar}</div>
              <h4 className="text-white font-semibold text-sm">{agent.name}</h4>
              
              {activeAgentIndex === index && (
                <motion.div
                  className="mt-3 flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((dot) => (
                      <motion.div
                        key={dot}
                        className="w-2 h-2 bg-white rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: dot * 0.2
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Current Activity */}
      <div className="bg-white/10 rounded-2xl p-6">
        <h4 className="text-white font-semibold mb-4">Current Activity</h4>
        <div className="space-y-3">
          {isProcessing ? (
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-white/80">{currentStage}</span>
            </motion.div>
          ) : (
            <div className="text-white/60 text-center py-8">
              Ready to process your business idea...
            </div>
          )}
        </div>
      </div>

      {/* Communication Flow */}
      {isProcessing && (
        <div className="mt-6 bg-white/5 rounded-2xl p-6">
          <h4 className="text-white font-semibold mb-4">Agent Communication</h4>
          <div className="space-y-2 text-sm">
            <motion.div
              className="text-blue-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Voice Parser → Business Analyst: "Electronics shop detected"
            </motion.div>
            <motion.div
              className="text-green-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              Business Analyst → Database: "Recommend inventory features"
            </motion.div>
            <motion.div
              className="text-purple-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
            >
              Database → UI Designer: "Schema ready for products table"
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
