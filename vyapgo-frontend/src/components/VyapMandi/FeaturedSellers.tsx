'use client';

import { motion } from 'framer-motion';

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

interface FeaturedSellersProps {
  sellers: Seller[];
}

export default function FeaturedSellers({ sellers }: FeaturedSellersProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the shopkeepers who transformed their businesses with VyapGo technology 
            and are now thriving on VyapMandi
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {sellers.map((seller, index) => (
            <motion.div
              key={seller.id}
              className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {seller.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{seller.businessName}</h3>
                  <p className="text-gray-600">{seller.name}</p>
                  <p className="text-sm text-gray-500">{seller.location}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span className="font-semibold text-gray-900">{seller.rating}</span>
                  </div>
                  <p className="text-sm text-gray-500">{seller.totalProducts} products</p>
                </div>
              </div>

              <blockquote className="text-gray-700 italic leading-relaxed mb-6">
                "{seller.story}"
              </blockquote>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Joined {new Date(seller.joinedDate).toLocaleDateString('en-IN', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </span>
                <button className="text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors">
                  View Shop →
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="bg-gradient-to-r from-orange-50 to-green-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your Success Story?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of shopkeepers who have transformed their businesses with VyapGo. 
              Get your own app and start selling on VyapMandi today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Create Your App
              </button>
              <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
