'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import VoiceSearchHero from './VoiceSearchHero';
import FeaturedSellers from './FeaturedSellers';
import ProductGrid from './ProductGrid';
import VoiceNavigation from './VoiceNavigation';

// Custom VyapMandi Logo Component
const VyapMandiLogo = ({ size = 32, className = "" }) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 48 48" 
        className="relative"
      >
        <defs>
          <linearGradient id="vyapmandi-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#f97316" stopOpacity={0.2} />
          </radialGradient>
        </defs>
        
        {/* Outer marketplace ring */}
        <circle 
          cx="24" 
          cy="24" 
          r="22" 
          fill="none" 
          stroke="url(#vyapmandi-gradient)" 
          strokeWidth="2"
        />
        
        {/* Central marketplace hub */}
        <circle 
          cx="24" 
          cy="24" 
          r="8" 
          fill="url(#center-glow)"
        />
        
        {/* Connecting commerce lines */}
        <path 
          d="M24 8 L24 16 M40 24 L32 24 M24 40 L24 32 M8 24 L16 24" 
          stroke="#22c55e" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        
        {/* Corner commerce nodes */}
        <circle cx="35" cy="13" r="3" fill="#f97316" />
        <circle cx="35" cy="35" r="3" fill="#22c55e" />
        <circle cx="13" cy="35" r="3" fill="#3b82f6" />
        <circle cx="13" cy="13" r="3" fill="#fbbf24" />
      </svg>
      
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-gray-900 tracking-tight">
          VyapMandi
        </span>
        <span className="text-xs text-gray-600 font-medium tracking-wider">
          Voice Commerce Hub
        </span>
      </div>
    </div>
  );
};

interface Product {
  id: string;
  name: string;
  price: number;
  seller: string;
  category: string;
  image: string;
  rating: number;
  inStock: boolean;
}

interface Seller {
  id: string;
  name: string;
  businessName: string;
  location: string;
  rating: number;
  totalProducts: number;
  joinedDate: string;
  story: string;
}

export default function VyapMandiPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isVoiceSearchActive, setIsVoiceSearchActive] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredSellers, setFeaturedSellers] = useState<Seller[]>([]);

  // Mock data initialization
  useEffect(() => {
    setProducts([
      {
        id: '1',
        name: 'Samsung Galaxy S24',
        price: 79999,
        seller: 'TechHub Pro',
        category: 'Electronics',
        image: '/api/placeholder/300/300',
        rating: 4.8,
        inStock: true
      },
      {
        id: '2',
        name: 'Organic Basmati Rice 5kg',
        price: 899,
        seller: 'Fresh Grocers',
        category: 'Grocery',
        image: '/api/placeholder/300/300',
        rating: 4.6,
        inStock: true
      },
      {
        id: '3',
        name: 'Cotton Kurta Set',
        price: 1299,
        seller: 'Ethnic Wear House',
        category: 'Clothing',
        image: '/api/placeholder/300/300',
        rating: 4.7,
        inStock: true
      }
    ]);

    setFeaturedSellers([
      {
        id: '1',
        name: 'Rajesh Kumar',
        businessName: 'TechHub Pro',
        location: 'Mumbai, Maharashtra',
        rating: 4.9,
        totalProducts: 156,
        joinedDate: '2024-01-15',
        story: 'From a small electronics shop to serving customers across India with VyapGo technology'
      },
      {
        id: '2',
        name: 'Priya Sharma',
        businessName: 'Fresh Grocers',
        location: 'Delhi, NCR',
        rating: 4.8,
        totalProducts: 89,
        joinedDate: '2024-02-20',
        story: 'Bringing fresh, organic produce from farm to your doorstep through digital innovation'
      }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <VyapMandiLogo size={40} />
            
            <nav className="hidden md:flex items-center space-x-8">
              <button className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                Categories
              </button>
              <button className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                Sellers
              </button>
              <button className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                Voice Search
              </button>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Sell on VyapMandi
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Voice Search Hero */}
      <VoiceSearchHero 
        onSearch={setSearchQuery}
        isVoiceActive={isVoiceSearchActive}
        setIsVoiceActive={setIsVoiceSearchActive}
      />

      {/* Featured Sellers */}
      <FeaturedSellers sellers={featuredSellers} />

      {/* Voice Navigation */}
      <VoiceNavigation 
        onCategorySelect={setSelectedCategory}
        selectedCategory={selectedCategory}
      />

      {/* Product Grid */}
      <ProductGrid 
        products={products}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <VyapMandiLogo size={36} className="mb-6" />
              <p className="text-gray-400 leading-relaxed">
                India's first voice-powered marketplace connecting shopkeepers 
                with customers through revolutionary technology.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">For Buyers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Voice Search</li>
                <li>Local Sellers</li>
                <li>Quality Products</li>
                <li>Fast Delivery</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">For Sellers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Join VyapMandi</li>
                <li>Seller Dashboard</li>
                <li>VyapGo Integration</li>
                <li>Growth Analytics</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Seller Support</li>
                <li>Voice Guide</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 VyapMandi. Powered by VyapGo Technology. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
