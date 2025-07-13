'use client'

import { motion } from 'framer-motion'
import { Star, Sparkles, Crown, Heart, Zap } from 'lucide-react'

interface CelebrityMatch {
  name: string
  image: string
  similarity: number
  category: string
}

interface CelebrityMatchProps {
  matches: CelebrityMatch[]
}

export default function CelebrityMatch({ matches }: CelebrityMatchProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'K-pop Idol':
        return <Sparkles className="w-4 h-4" />
      case 'Hollywood Actress':
        return <Crown className="w-4 h-4" />
      case 'Anime Character':
        return <Zap className="w-4 h-4" />
      default:
        return <Star className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'K-pop Idol':
        return 'bg-beauty-100 text-beauty-600'
      case 'Hollywood Actress':
        return 'bg-blue-100 text-blue-600'
      case 'Anime Character':
        return 'bg-purple-100 text-purple-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 9) return 'text-green-600'
    if (similarity >= 8) return 'text-blue-600'
    if (similarity >= 7) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const getSimilarityOutOf10 = (similarity: number) => {
    return Math.round(similarity / 10)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-beauty-500 mr-3" />
          Celebrity Lookalikes
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover which celebrities and characters you resemble most! Our AI analyzes facial features 
          across different cultural standards to find your perfect matches.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match, index) => (
          <motion.div
            key={match.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="card-hover glass-effect rounded-xl p-6 text-center relative overflow-hidden">
              {/* Similarity Badge */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold">
                <span className={getSimilarityColor(match.similarity)}>
                  {match.similarity}%
                </span>
              </div>

              {/* Category Badge */}
              <div className={`absolute top-4 left-4 ${getCategoryColor(match.category)} rounded-full px-3 py-1 text-xs font-medium flex items-center space-x-1`}>
                {getCategoryIcon(match.category)}
                <span>{match.category}</span>
              </div>

              {/* Celebrity Image */}
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-500">
                    {match.name.charAt(0)}
                  </span>
                </div>
                {/* Similarity Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-transparent" 
                     style={{
                       background: `conic-gradient(${match.similarity >= 90 ? '#10b981' : match.similarity >= 80 ? '#3b82f6' : '#f59e0b'} ${match.similarity * 3.6}deg, #e5e7eb ${match.similarity * 3.6}deg)`,
                       mask: 'radial-gradient(circle at center, transparent 60%, black 60%)'
                     }}>
                </div>
              </div>

              {/* Celebrity Name */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-beauty-600 transition-colors">
                {match.name}
              </h3>

              {/* Similarity Score */}
              <div className="flex items-center justify-center space-x-2 mb-3">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(match.similarity / 20) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Similarity Description */}
              <p className="text-sm text-gray-600 mb-4">
                {match.similarity >= 90 
                  ? "Incredible resemblance! You could be twins!"
                  : match.similarity >= 80
                  ? "Strong similarity in facial features"
                  : match.similarity >= 70
                  ? "Notable resemblance in certain features"
                  : "Some similar characteristics"
                }
              </p>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-beauty-50 text-beauty-600 rounded-lg hover:bg-beauty-100 transition-colors text-sm font-medium"
                >
                  <Heart className="w-4 h-4" />
                  <span>Like</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Share</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center p-4 bg-beauty-50 rounded-xl"
        >
          <Sparkles className="w-8 h-8 text-beauty-500 mx-auto mb-2" />
          <h4 className="font-semibold text-gray-900 mb-1">K-pop Standards</h4>
          <p className="text-sm text-gray-600">
            Korean beauty ideals and facial features
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center p-4 bg-blue-50 rounded-xl"
        >
          <Crown className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <h4 className="font-semibold text-gray-900 mb-1">Hollywood Glamour</h4>
          <p className="text-sm text-gray-600">
            Western beauty standards and features
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center p-4 bg-purple-50 rounded-xl"
        >
          <Zap className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <h4 className="font-semibold text-gray-900 mb-1">Anime Aesthetics</h4>
          <p className="text-sm text-gray-600">
            Japanese animation style features
          </p>
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center mt-8 p-6 bg-gradient-to-r from-beauty-50 to-ai-50 rounded-xl"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Want More Matches?
        </h3>
        <p className="text-gray-600 mb-4">
          Try different photos or angles to discover more celebrity lookalikes!
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="beauty-gradient text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Find More Matches
        </motion.button>
      </motion.div>
    </motion.div>
  )
} 