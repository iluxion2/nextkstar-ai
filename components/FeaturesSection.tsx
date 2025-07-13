'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Brain, 
  Eye, 
  TrendingUp, 
  Sparkles, 
  Shield, 
  Users,
  Camera,
  Zap,
  Heart,
  Target,
  Globe,
  BarChart3,
  Palette,
  Smartphone
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: "AI Beauty Score",
    description: "Advanced facial analysis using state-of-the-art machine learning algorithms to evaluate facial symmetry, skin clarity, and proportions.",
    gradient: "beauty-gradient",
    category: "Core Analysis"
  },
  {
    icon: Eye,
    title: "Bias Analysis Mode",
    description: "Discover how AI perceives your face across different cultural standards and beauty norms. Understand the impact of algorithmic bias.",
    gradient: "ai-gradient",
    category: "Research"
  },
  {
    icon: Sparkles,
    title: "Celebrity Lookalike",
    description: "Find your celebrity doppelgängers from K-pop idols to Hollywood stars. See who you resemble most with percentage matches.",
    gradient: "beauty-gradient",
    category: "Entertainment"
  },
  {
    icon: TrendingUp,
    title: "Physiognomy Insights",
    description: "Korean-style face reading that predicts personality traits, luck, and life aspects based on facial features and expressions.",
    gradient: "ai-gradient",
    category: "Cultural"
  },
  {
    icon: Palette,
    title: "Digital Doppelgänger",
    description: "Generate AI-morphed versions of yourself as different cultural archetypes - from Korean idols to anime characters.",
    gradient: "beauty-gradient",
    category: "Creative"
  },
  {
    icon: BarChart3,
    title: "Visual Analytics",
    description: "Comprehensive radar charts and graphs showing your facial strengths, personality traits, and attractiveness metrics.",
    gradient: "ai-gradient",
    category: "Analytics"
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your images are processed securely and deleted immediately unless you choose to share them publicly.",
    gradient: "beauty-gradient",
    category: "Security"
  },
  {
    icon: Users,
    title: "Social Leaderboard",
    description: "Optional public leaderboard where you can share your results and compare with others worldwide.",
    gradient: "ai-gradient",
    category: "Social"
  },
  {
    icon: Camera,
    title: "Live Camera Mode",
    description: "Real-time facial analysis using your webcam with instant feedback on mood, lookalikes, and bias detection.",
    gradient: "beauty-gradient",
    category: "Real-time"
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get comprehensive analysis results in under 30 seconds with detailed breakdowns and actionable insights.",
    gradient: "ai-gradient",
    category: "Performance"
  },
  {
    icon: Globe,
    title: "Cultural Lens",
    description: "Explore how beauty standards vary across cultures and see yourself through different global perspectives.",
    gradient: "beauty-gradient",
    category: "Global"
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Perfect experience on all devices with responsive design and touch-optimized interface for selfie uploads.",
    gradient: "ai-gradient",
    category: "Accessibility"
  }
]

export default function FeaturesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <section id="features" className="py-20 bg-white">
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
            Revolutionary Features for the
            <span className="gradient-text"> Digital Age</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform combines cutting-edge AI technology with social science research 
            to provide insights into beauty bias, digital identity, and media influence.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="card-hover glass-effect rounded-2xl p-6 h-full">
                {/* Icon */}
                <div className={`w-12 h-12 ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                {/* Category Badge */}
                <div className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full mb-3">
                  {feature.category}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-beauty-600 transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Explore Your Digital Identity?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of users discovering beauty bias, celebrity matches, and cultural insights through AI.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="beauty-gradient text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Your Analysis Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 