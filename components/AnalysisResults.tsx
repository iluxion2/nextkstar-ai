'use client'

import { motion } from 'framer-motion'
import { Star, TrendingUp, Heart, Target, Zap, Share2, Download } from 'lucide-react'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

interface AnalysisResultsProps {
  result: {
    beautyScore: number
    facialFeatures: {
      symmetry: number
      skinClarity: number
      proportions: number
      expression: number
    }
    personalityTraits: {
      confidence: number
      friendliness: number
      intelligence: number
      attractiveness: number
    }
  }
  selectedImage: string | null
}

export default function AnalysisResults({ result, selectedImage }: AnalysisResultsProps) {
  const facialFeaturesData = {
    labels: ['Symmetry', 'Skin Clarity', 'Proportions', 'Expression'],
    datasets: [
      {
        label: 'Your Score',
        data: [
          result.facialFeatures.symmetry,
          result.facialFeatures.skinClarity,
          result.facialFeatures.proportions,
          result.facialFeatures.expression
        ],
        backgroundColor: 'rgba(236, 72, 153, 0.2)',
        borderColor: 'rgba(236, 72, 153, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(236, 72, 153, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(236, 72, 153, 1)'
      }
    ]
  }

  const personalityData = {
    labels: ['Confidence', 'Friendliness', 'Intelligence', 'Attractiveness'],
    datasets: [
      {
        label: 'Your Traits',
        data: [
          result.personalityTraits.confidence,
          result.personalityTraits.friendliness,
          result.personalityTraits.intelligence,
          result.personalityTraits.attractiveness
        ],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(34, 197, 94, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(34, 197, 94, 1)'
      }
    ]
  }

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600'
    if (score >= 8) return 'text-blue-600'
    if (score >= 7) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreEmoji = (score: number) => {
    if (score >= 9) return '🌟'
    if (score >= 8) return '✨'
    if (score >= 7) return '😊'
    return '😐'
  }

  const getScoreOutOf10 = (score: number) => {
    return Math.round(score / 10)
  }

  return (
    <div className="space-y-8">
      {/* Main Beauty Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-8 text-center"
      >
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="text-6xl">{getScoreEmoji(result.beautyScore)}</div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Your Beauty Score
            </h2>
            <div className={`text-6xl font-bold ${getScoreColor(getScoreOutOf10(result.beautyScore))}`}>
              {getScoreOutOf10(result.beautyScore)}/10
            </div>
            <div className="text-gray-600">({result.beautyScore}/100)</div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 mb-6">
          {[...Array(10)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < getScoreOutOf10(result.beautyScore) 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Based on advanced AI analysis of facial symmetry, skin clarity, proportions, and expression. 
          This score reflects how your face aligns with global beauty standards on a scale of 1-10.
        </p>

        <div className="flex justify-center space-x-4 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </motion.button>
          <motion.button
            onClick={() => {
              if (selectedImage) {
                const link = document.createElement('a')
                link.href = selectedImage
                link.download = 'ai-face-analysis-result.jpg'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Image and Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Your Photo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-effect rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 text-beauty-500 mr-2" />
            Your Photo
          </h3>
          {selectedImage && (
            <div className="relative">
              <img
                src={selectedImage}
                alt="Uploaded photo"
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                AI Analyzed
              </div>
            </div>
          )}
        </motion.div>

        {/* Facial Features Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-effect rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-ai-500 mr-2" />
            Facial Features Analysis
          </h3>
          <div className="h-64">
            <Radar data={facialFeaturesData} options={{
              scales: {
                r: {
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    stepSize: 20
                  }
                }
              },
              plugins: {
                legend: {
                  display: false
                }
              }
            }} />
          </div>
        </motion.div>
      </div>

      {/* Personality Traits Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Heart className="w-5 h-5 text-beauty-500 mr-2" />
          Personality Traits
        </h3>
        <div className="h-64">
          <Radar data={personalityData} options={{
            scales: {
              r: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  stepSize: 20
                }
              }
            },
            plugins: {
              legend: {
                display: false
              }
            }
          }} />
        </div>
      </motion.div>

      {/* Feature Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-xl p-6 text-center"
        >
          <div className="w-12 h-12 beauty-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Symmetry</h4>
          <div className="text-2xl font-bold text-beauty-600">
            {result.facialFeatures.symmetry}%
          </div>
          <div className="text-sm text-gray-600 mt-1">Facial Balance</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-xl p-6 text-center"
        >
          <div className="w-12 h-12 ai-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Skin Clarity</h4>
          <div className="text-2xl font-bold text-ai-600">
            {result.facialFeatures.skinClarity}%
          </div>
          <div className="text-sm text-gray-600 mt-1">Complexion Quality</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-xl p-6 text-center"
        >
          <div className="w-12 h-12 beauty-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Proportions</h4>
          <div className="text-2xl font-bold text-beauty-600">
            {result.facialFeatures.proportions}%
          </div>
          <div className="text-sm text-gray-600 mt-1">Feature Harmony</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect rounded-xl p-6 text-center"
        >
          <div className="w-12 h-12 ai-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Expression</h4>
          <div className="text-2xl font-bold text-ai-600">
            {result.facialFeatures.expression}%
          </div>
          <div className="text-sm text-gray-600 mt-1">Emotional Appeal</div>
        </motion.div>
      </div>
    </div>
  )
} 