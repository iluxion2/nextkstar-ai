'use client'

import { motion } from 'framer-motion'
import { Sparkles, Camera, Brain, TrendingUp, ArrowRight } from 'lucide-react'
import { getTranslation } from '../app/utils/translations'

interface HeroSectionProps {
  onGetStarted: () => void
  language?: string
}

export default function HeroSection({ onGetStarted, language = 'en' }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 beauty-gradient rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 ai-gradient rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-beauty-200 rounded-full px-4 py-2 mb-8"
        >
          <Sparkles className="w-4 h-4 text-beauty-500" />
          <span className="text-sm font-medium text-gray-700">
            {getTranslation('Revolutionary AI-Powered Face Analysis', language)}
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
        >
          <span className="gradient-text">{getTranslation('Sociotechnical Mirror', language)}</span>
          <br />
          <span className="text-gray-800">{getTranslation('for the Digital Age', language)}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed"
        >
          {getTranslation('Explore beauty bias, digital identity, and media influence through our revolutionary AI-powered facial analysis platform. Get your beauty score, celebrity lookalikes, and bias analysis.', language)}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetStarted}
            className="group beauty-gradient text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
          >
            <span>{getTranslation('Start Your Analysis', language)}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:border-beauty-300 hover:text-beauty-600 transition-all duration-300 flex items-center space-x-2"
          >
            <Camera className="w-5 h-5" />
            <span>{getTranslation('Watch Demo', language)}</span>
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">10K+</div>
            <div className="text-gray-600">{getTranslation('Faces Analyzed', language)}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">95%</div>
            <div className="text-gray-600">{getTranslation('Accuracy Rate', language)}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">50+</div>
            <div className="text-gray-600">{getTranslation('Celebrity Matches', language)}</div>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <div className="flex items-center space-x-3 p-4 glass-effect rounded-xl">
            <div className="w-10 h-10 beauty-gradient rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{getTranslation('AI Beauty Score', language)}</div>
              <div className="text-sm text-gray-600">{getTranslation('Advanced facial analysis', language)}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 glass-effect rounded-xl">
            <div className="w-10 h-10 ai-gradient rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{getTranslation('Bias Analysis', language)}</div>
              <div className="text-sm text-gray-600">{getTranslation('Cultural perception insights', language)}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 glass-effect rounded-xl">
            <div className="w-10 h-10 beauty-gradient rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{getTranslation('Celebrity Match', language)}</div>
              <div className="text-sm text-gray-600">{getTranslation('Find your lookalikes', language)}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 