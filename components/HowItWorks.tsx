'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Upload, 
  Brain, 
  Sparkles, 
  Share2,
  Camera,
  Zap,
  Shield,
  CheckCircle
} from 'lucide-react'

const steps = [
  {
    icon: Upload,
    title: "Upload Your Photo",
    description: "Simply upload a clear selfie or photo. Our AI works best with front-facing photos in good lighting.",
    gradient: "beauty-gradient",
    details: [
      "Supports JPG, PNG, WebP formats",
      "Works with any device camera",
      "No account required for basic analysis"
    ]
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Our advanced AI analyzes 68 facial landmarks, skin texture, symmetry, and cultural beauty standards.",
    gradient: "ai-gradient",
    details: [
      "68-point facial landmark detection",
      "Multi-cultural beauty analysis",
      "Bias detection algorithms"
    ]
  },
  {
    icon: Sparkles,
    title: "Get Your Results",
    description: "Receive comprehensive results including beauty score, celebrity matches, and cultural insights.",
    gradient: "beauty-gradient",
    details: [
      "Beauty score (0-100)",
      "Celebrity lookalike matches",
      "Personality trait analysis"
    ]
  },
  {
    icon: Share2,
    title: "Share & Compare",
    description: "Optionally share your results on the leaderboard and compare with others worldwide.",
    gradient: "ai-gradient",
    details: [
      "Global leaderboard ranking",
      "Social media sharing",
      "Community comparisons"
    ]
  }
]

const benefits = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get results in under 30 seconds"
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your images are never stored permanently"
  },
  {
    icon: CheckCircle,
    title: "Accurate Results",
    description: "95% accuracy rate with advanced AI"
  }
]

export default function HowItWorks() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How It Works in
            <span className="gradient-text"> 4 Simple Steps</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our revolutionary AI technology makes facial analysis accessible, accurate, and insightful for everyone.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-beauty-600 border-2 border-beauty-200">
                {index + 1}
              </div>

              <div className="card-hover glass-effect rounded-2xl p-6 h-full">
                {/* Icon */}
                <div className={`w-16 h-16 ${step.gradient} rounded-xl flex items-center justify-center mb-4`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {step.description}
                </p>

                {/* Details */}
                <ul className="space-y-2">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-ai-500 mr-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-beauty-400 to-ai-400 transform -translate-y-1/2"></div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {benefits.map((benefit, index) => (
            <div key={benefit.title} className="text-center">
              <div className="w-16 h-16 beauty-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Demo Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 text-center"
        >
          <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Camera className="w-8 h-8 text-beauty-500 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">
                See It In Action
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Watch how our AI analyzes faces in real-time and provides instant insights.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="beauty-gradient text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Watch Demo Video
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 