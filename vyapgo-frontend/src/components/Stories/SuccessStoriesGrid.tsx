'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';

interface ShopkeeperStory {
  id: string;
  name: string;
  business: string;
  location: string;
  hindiQuote: string;
  englishQuote: string;
  revenueIncrease: string;
  timeToCreate: string;
  imageUrl: string;
  audioUrl: string;
  businessType: 'grocery' | 'electronics' | 'clothing' | 'pharmacy' | 'restaurant';
  region: 'north' | 'south' | 'east' | 'west';
}

const shopkeeperStories: ShopkeeperStory[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    business: 'Saree Shop',
    location: 'Bangalore, Karnataka',
    hindiQuote: 'ग्राहक मेरे ब्रांडेड ऐप से खुश हैं',
    englishQuote: 'Customers love my branded app',
    revenueIncrease: '₹45,000',
    timeToCreate: '4 min',
    imageUrl: '/images/shopkeepers/priya-saree-bangalore.jpg',
    audioUrl: '/audio/testimonials/priya-testimonial.mp3',
    businessType: 'clothing',
    region: 'south'
  },
  {
    id: '2',
    name: 'Suresh Patel',
    business: 'Medical Store',
    location: 'Pune, Maharashtra',
    hindiQuote: 'अब गलत बिल नहीं बनता',
    englishQuote: 'No more billing mistakes',
    revenueIncrease: '₹32,000',
    timeToCreate: '3 min',
    imageUrl: '/images/shopkeepers/suresh-medical-pune.jpg',
    audioUrl: '/audio/testimonials/suresh-testimonial.mp3',
    businessType: 'pharmacy',
    region: 'west'
  },
  {
    id: '3',
    name: 'Rajesh Kumar',
    business: 'Electronics Shop',
    location: 'Kanpur, Uttar Pradesh',
    hindiQuote: '30 साल बाद मेरा अपना ऐप!',
    englishQuote: 'My own app after 30 years!',
    revenueIncrease: '₹58,000',
    timeToCreate: '5 min',
    imageUrl: '/images/shopkeepers/rajesh-electronics-kanpur.jpg',
    audioUrl: '/audio/testimonials/rajesh-testimonial.mp3',
    businessType: 'electronics',
    region: 'north'
  },
  {
    id: '4',
    name: 'Meera Devi',
    business: 'Grocery Store',
    location: 'Kolkata, West Bengal',
    hindiQuote: 'रोज़ाना 2 घंटे बचता है',
    englishQuote: 'Saves 2 hours daily',
    revenueIncrease: '₹28,000',
    timeToCreate: '3 min',
    imageUrl: '/images/shopkeepers/meera-grocery-kolkata.jpg',
    audioUrl: '/audio/testimonials/meera-testimonial.mp3',
    businessType: 'grocery',
    region: 'east'
  },
  {
    id: '5',
    name: 'Arjun Singh',
    business: 'Restaurant',
    location: 'Jaipur, Rajasthan',
    hindiQuote: 'ऑर्डर मैनेजमेंट बहुत आसान',
    englishQuote: 'Order management is so easy',
    revenueIncrease: '₹67,000',
    timeToCreate: '6 min',
    imageUrl: '/images/shopkeepers/arjun-restaurant-jaipur.jpg',
    audioUrl: '/audio/testimonials/arjun-testimonial.mp3',
    businessType: 'restaurant',
    region: 'north'
  },
  {
    id: '6',
    name: 'Lakshmi Reddy',
    business: 'Textile Shop',
    location: 'Chennai, Tamil Nadu',
    hindiQuote: 'ग्राहक अब ऑनलाइन ऑर्डर करते हैं',
    englishQuote: 'Customers now order online',
    revenueIncrease: '₹41,000',
    timeToCreate: '4 min',
    imageUrl: '/images/shopkeepers/lakshmi-textile-chennai.jpg',
    audioUrl: '/audio/testimonials/lakshmi-testimonial.mp3',
    businessType: 'clothing',
    region: 'south'
  }
];

const businessTypeColors = {
  grocery: 'from-green-50 to-emerald-50 border-green-200',
  electronics: 'from-blue-50 to-indigo-50 border-blue-200',
  clothing: 'from-purple-50 to-pink-50 border-purple-200',
  pharmacy: 'from-red-50 to-rose-50 border-red-200',
  restaurant: 'from-orange-50 to-yellow-50 border-orange-200'
};

const businessTypeIcons = {
  grocery: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
    </svg>
  ),
  electronics: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h3l-1 1v2h12v-2l-1-1h3c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H4V5h16v11z"/>
    </svg>
  ),
  clothing: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9l-5 4.87L18.18 22 12 18.77 5.82 22 7 13.87 2 9l6.91-.74L12 2z"/>
    </svg>
  ),
  pharmacy: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 6h5v2h2V6h1V4H4v2zm0 5v8c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-8H4z"/>
    </svg>
  ),
  restaurant: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-.78-.78-2.05-.78-2.83 0-.78.78-.78 2.05 0 2.83l7.02 7.01zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
    </svg>
  )
};

export default function SuccessStoriesGrid() {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [audioElements, setAudioElements] = useState<{ [key: string]: HTMLAudioElement }>({});

  const handleAudioToggle = useCallback((storyId: string, audioUrl: string) => {
    if (playingAudio === storyId) {
      audioElements[storyId]?.pause();
      setPlayingAudio(null);
    } else {
      if (playingAudio && audioElements[playingAudio]) {
        audioElements[playingAudio].pause();
      }

      let audio = audioElements[storyId];
      if (!audio) {
        audio = new Audio(audioUrl);
        audio.onended = () => setPlayingAudio(null);
        setAudioElements(prev => ({ ...prev, [storyId]: audio }));
      }

      audio.play();
      setPlayingAudio(storyId);
    }
  }, [playingAudio, audioElements]);

  const handleCreateApp = useCallback(() => {
    window.location.href = '/model';
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-orange-600">50,000+</span> दुकानदारों का भरोसा
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real shopkeepers from across India who transformed their businesses with VyapGo. 
            Hear their authentic stories in their own voices.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shopkeeperStories.map((story, index) => (
            <motion.div
              key={story.id}
              className={`bg-gradient-to-br ${businessTypeColors[story.businessType]} rounded-2xl border-2 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="text-gray-600">
                    {businessTypeIcons[story.businessType]}
                  </div>
                  <span className="text-sm font-medium text-gray-600 capitalize">
                    {story.businessType}
                  </span>
                </div>
                <div className="text-xs text-gray-500">{story.region.toUpperCase()}</div>
              </div>

              <div className="relative mb-6">
                <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl h-48 flex items-center justify-center overflow-hidden">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-orange-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <svg className="w-10 h-10 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <div className="text-sm text-gray-600">
                      Authentic photo will be added
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleAudioToggle(story.id, story.audioUrl)}
                  className="absolute bottom-3 right-3 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 group-hover:scale-110"
                  aria-label={`Play ${story.name}'s testimonial`}
                >
                  {playingAudio === story.id ? (
                    <PauseIcon className="w-5 h-5 text-orange-600" />
                  ) : (
                    <PlayIcon className="w-5 h-5 text-orange-600" />
                  )}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{story.name}</h3>
                  <p className="text-gray-600">{story.business}, {story.location}</p>
                </div>

                <blockquote className="space-y-2">
                  <p className="text-orange-700 font-medium italic">"{story.hindiQuote}"</p>
                  <p className="text-gray-600 text-sm">"{story.englishQuote}"</p>
                </blockquote>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">{story.revenueIncrease}</div>
                    <div className="text-xs text-gray-600">Extra Monthly</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-700">{story.timeToCreate}</div>
                    <div className="text-xs text-gray-600">Creation Time</div>
                  </div>
                </div>
              </div>

              {playingAudio === story.id && (
                <div className="mt-4 flex items-center space-x-2 text-sm text-orange-600">
                  <div className="flex space-x-1">
                    <div className="w-1 h-4 bg-orange-600 rounded animate-pulse"></div>
                    <div className="w-1 h-4 bg-orange-600 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-4 bg-orange-600 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span>Playing testimonial...</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-gray-600 mb-6">
            Join thousands of successful shopkeepers across India
          </p>
          <button 
            onClick={handleCreateApp}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            अपना ऐप बनाएं - Create Your App
          </button>
        </motion.div>
      </div>
    </section>
  );
}
