'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface CodePreviewProps {
  code: string;
}

export default function CodePreview({ code }: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');

  return (
    <motion.div
      className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <h3 className="text-xl font-bold text-white">Generated App</h3>
        <div className="flex bg-white/10 rounded-xl p-1">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'code'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'text-white/70 hover:text-white'
            }`}
            onClick={() => setActiveTab('code')}
          >
            Code
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'preview'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'text-white/70 hover:text-white'
            }`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 h-96">
        {/* Code Section */}
        <div className={`${activeTab === 'code' ? 'lg:col-span-1' : 'hidden lg:block lg:col-span-1'}`}>
          <div className="h-full overflow-auto p-6">
            <pre className="text-sm text-green-400 font-mono leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        </div>

        {/* Preview Section */}
        <div className={`${activeTab === 'preview' ? 'lg:col-span-1' : 'hidden lg:block lg:col-span-1'} bg-white/5 border-l border-white/10`}>
          <div className="h-full flex items-center justify-center p-6">
            <div className="bg-gray-900 rounded-3xl p-6 w-64 h-80 shadow-2xl">
              <div className="bg-white rounded-2xl h-full p-4 flex flex-col">
                <div className="text-center mb-4">
                  <h4 className="font-bold text-gray-800">Your Business App</h4>
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="bg-orange-100 rounded-lg p-3">
                    <div className="text-sm font-medium text-gray-800">Home</div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="text-sm font-medium text-gray-600">Products</div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="text-sm font-medium text-gray-600">Orders</div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="text-sm font-medium text-gray-600">Analytics</div>
                  </div>
                </div>

                <div className="mt-4 bg-orange-500 text-white text-center py-2 rounded-lg text-sm font-medium">
                  Download APK
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div className="p-6 border-t border-white/10 bg-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-semibold">Ready to Download</h4>
            <p className="text-white/60 text-sm">Your app is ready with source code and APK file</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300">
              Download APK
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300">
              Get Source Code
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
