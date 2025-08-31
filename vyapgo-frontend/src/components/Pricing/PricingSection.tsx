'use client';

import { motion } from 'framer-motion';

export default function PricingSection() {
  const plans = [
    {
      name: 'Shuruat',
      hindi: 'शुरुआत',
      subtitle: 'The Beginning',
      description: 'Perfect for starting your digital journey',
      color: 'orange',
      features: [
        'Complete mobile app for your business',
        'Free VyapMandi marketplace registration',
        'Basic features: Billing, Inventory, Customer management',
        'Full source code ownership',
        'AI Services: Pay-per-use '
      ],
      popular: false
    },
    {
      name: 'Pragati',
      hindi: 'प्रगति',
      subtitle: 'The Progress',
      description: 'For growing businesses wanting reliability',
      color: 'green',
      features: [
        'Everything in Shuruat plan',
        'Weekly app maintenance & updates',
        'Bug fixes and feature improvements',
        'Priority customer support',
        'AI Services: Discounted rates ',
        '5 free AI analyses per month included'
      ],
      popular: true
    },
    {
      name: 'Samriddhi',
      hindi: 'समृद्धि',
      subtitle: 'The Prosperity',
      description: 'Complete automation for ambitious shopkeepers',
      color: 'blue',
      features: [
        'Everything in Pragati plan',
        'AI Business Analyst integration',
        'AI Data Scientist for sales optimization',
        'Automated accounting & GST filing',
        'Future sales prediction & inventory planning',
        'AI Services: Best rates ',
        '20 free AI analyses per month included'
      ],
      popular: false
    }
  ];

  const getColorClasses = (color: string, type: 'text' | 'bg' | 'border' | 'button') => {
    const colors = {
      orange: {
        text: 'text-orange-600',
        bg: 'from-orange-500 to-yellow-500',
        border: 'border-orange-200',
        button: 'from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600'
      },
      green: {
        text: 'text-green-600',
        bg: 'from-green-500 to-emerald-500',
        border: 'border-green-200',
        button: 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
      },
      blue: {
        text: 'text-blue-600',
        bg: 'from-blue-500 to-indigo-500',
        border: 'border-blue-200',
        button: 'from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
      }
    };
    return colors[color as keyof typeof colors][type];
  };

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <pattern id="pricing-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="#f97316" opacity="0.3" />
              <circle cx="5" cy="15" r="0.5" fill="#22c55e" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pricing-pattern)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            VyapGo <span className="text-orange-600">Plans</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose the perfect plan to grow your business from Shuruat to Samriddhi. 
            Every plan includes free access to VyapMandi marketplace.
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative bg-white rounded-3xl shadow-xl border-2 ${getColorClasses(plan.color, 'border')} p-8 lg:p-10 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                plan.popular ? 'scale-105 ring-4 ring-green-200' : ''
              }`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className={`text-3xl font-bold ${getColorClasses(plan.color, 'text')} mb-2`}>
                  {plan.name}
                </h3>
                <p className="text-2xl text-gray-700 font-medium mb-2">
                  {plan.hindi}
                </p>
                <p className="text-lg text-gray-600 italic mb-4">
                  {plan.subtitle}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              {/* Price Placeholder */}
              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  ___
                </div>
                <p className="text-gray-500 text-sm">
                  Pricing coming soon
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-10">
                {plan.features.map((feature, featureIndex) => (
                  <motion.div
                    key={featureIndex}
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: featureIndex * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${getColorClasses(plan.color, 'bg')} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 leading-relaxed">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <button className={`w-full bg-gradient-to-r ${getColorClasses(plan.color, 'button')} text-white py-4 px-6 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1`}>
                Choose {plan.name}
              </button>
            </motion.div>
          ))}
        </div>

        {/* VyapMandi Highlight */}
        <motion.div
          className="mt-20 text-center bg-gradient-to-r from-orange-50 via-yellow-50 to-green-50 rounded-3xl p-10 border border-orange-200"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Free VyapMandi Marketplace Access
          </h3>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Every plan includes free registration to VyapMandi - India's premier B2B+B2C marketplace 
            where shopkeepers connect, trade, and grow together.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">B2B Trading</h4>
                <p className="text-gray-600">Wholesale between shopkeepers</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">B2C Sales</h4>
                <p className="text-gray-600">Direct customer reach</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
