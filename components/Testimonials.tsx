'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: "Sarah Kim",
    role: "University Student",
    avatar: "SK",
    rating: 5,
    content: "This platform completely changed how I think about beauty standards. The bias analysis feature opened my eyes to how AI can reflect cultural biases. It's not just fun - it's educational!",
    category: "Research"
  },
  {
    name: "Alex Chen",
    role: "Tech Enthusiast",
    avatar: "AC",
    rating: 5,
    content: "The celebrity matching feature is incredible! I found out I look like a K-pop idol and it was so accurate. The whole experience is smooth and the results are detailed.",
    category: "Entertainment"
  },
  {
    name: "Maria Rodriguez",
    role: "Social Media Influencer",
    avatar: "MR",
    rating: 5,
    content: "As someone who works in social media, understanding beauty bias is crucial. This tool helps me create more inclusive content and understand different cultural perspectives.",
    category: "Professional"
  },
  {
    name: "David Park",
    role: "AI Researcher",
    avatar: "DP",
    rating: 5,
    content: "The technical implementation is impressive. The facial landmark detection is precise and the bias analysis provides valuable insights for AI ethics research.",
    category: "Academic"
  },
  {
    name: "Emma Thompson",
    role: "Beauty Blogger",
    avatar: "ET",
    rating: 5,
    content: "I love how this platform combines entertainment with education. The physiognomy insights are fascinating and the visual analytics are beautiful to look at.",
    category: "Lifestyle"
  },
  {
    name: "James Wilson",
    role: "Digital Artist",
    avatar: "JW",
    rating: 5,
    content: "The digital doppelgänger feature is mind-blowing! I can see myself as different cultural archetypes. It's perfect for character design inspiration.",
    category: "Creative"
  }
]

const stats = [
  { number: "10,000+", label: "Faces Analyzed" },
  { number: "95%", label: "User Satisfaction" },
  { number: "50+", label: "Countries Reached" },
  { number: "4.9/5", label: "Average Rating" }
]

export default function Testimonials() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <section className="py-20 bg-white">
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
            Loved by Users
            <span className="gradient-text"> Worldwide</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of users who have discovered beauty bias, celebrity matches, and cultural insights through our platform.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="card-hover glass-effect rounded-2xl p-6 h-full relative">
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-beauty-200 absolute top-4 right-4" />
                
                {/* Category Badge */}
                <div className="inline-block bg-beauty-100 text-beauty-600 text-xs font-medium px-2 py-1 rounded-full mb-4">
                  {testimonial.category}
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center">
                  <div className="w-10 h-10 beauty-gradient rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
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
              Join Our Growing Community
            </h3>
            <p className="text-gray-600 mb-6">
              Experience the future of AI-powered facial analysis and discover insights about beauty bias, digital identity, and cultural perception.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="beauty-gradient text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Your Analysis Today
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 