'use client'

import { motion } from 'framer-motion'
import { Eye, Globe, TrendingUp, AlertTriangle, Info } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface BiasAnalysisProps {
  biasData: {
    korean: number
    western: number
    global: number
    anime: number
  }
}

export default function BiasAnalysis({ biasData }: BiasAnalysisProps) {
  const chartData = {
    labels: ['Korean Standards', 'Western Standards', 'Global Standards', 'Anime Aesthetics'],
    datasets: [
      {
        label: 'Beauty Score',
        data: [biasData.korean, biasData.western, biasData.global, biasData.anime],
        backgroundColor: [
          'rgba(236, 72, 153, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(147, 51, 234, 0.8)'
        ],
        borderColor: [
          'rgba(236, 72, 153, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(147, 51, 234, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8,
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Score: ${context.parsed.y}/100`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20
        }
      }
    }
  }

  const getHighestScore = () => {
    const scores = [biasData.korean, biasData.western, biasData.global, biasData.anime]
    const maxScore = Math.max(...scores)
    const labels = ['Korean', 'Western', 'Global', 'Anime']
    return {
      label: labels[scores.indexOf(maxScore)],
      score: maxScore
    }
  }

  const getLowestScore = () => {
    const scores = [biasData.korean, biasData.western, biasData.global, biasData.anime]
    const minScore = Math.min(...scores)
    const labels = ['Korean', 'Western', 'Global', 'Anime']
    return {
      label: labels[scores.indexOf(minScore)],
      score: minScore
    }
  }

  const highest = getHighestScore()
  const lowest = getLowestScore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <Eye className="w-8 h-8 text-ai-500 mr-3" />
          Bias Analysis
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Discover how AI perceives beauty across different cultural standards. This analysis reveals 
          the fascinating variations in beauty ideals and helps us understand algorithmic bias in facial recognition.
        </p>
      </div>

      {/* Chart */}
      <div className="mb-8">
        <div className="h-80">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Highest Score</h3>
              <p className="text-sm text-gray-600">{highest.label} Standards</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {highest.score}/100
          </div>
          <p className="text-sm text-gray-600">
            Your facial features align most closely with {highest.label.toLowerCase()} beauty ideals.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Lowest Score</h3>
              <p className="text-sm text-gray-600">{lowest.label} Standards</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-yellow-600 mb-2">
            {lowest.score}/100
          </div>
          <p className="text-sm text-gray-600">
            Your features differ most from {lowest.label.toLowerCase()} beauty standards.
          </p>
        </motion.div>
      </div>

      {/* Cultural Standards Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center p-4 bg-beauty-50 rounded-xl"
        >
          <div className="w-12 h-12 beauty-gradient rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold">한</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Korean</h4>
          <div className="text-2xl font-bold text-beauty-600 mb-1">
            {biasData.korean}%
          </div>
          <p className="text-xs text-gray-600">
            V-line jaw, clear skin, large eyes
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center p-4 bg-blue-50 rounded-xl"
        >
          <div className="w-12 h-12 ai-gradient rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold">W</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Western</h4>
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {biasData.western}%
          </div>
          <p className="text-xs text-gray-600">
            Defined features, symmetry, confidence
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center p-4 bg-green-50 rounded-xl"
        >
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Global</h4>
          <div className="text-2xl font-bold text-green-600 mb-1">
            {biasData.global}%
          </div>
          <p className="text-xs text-gray-600">
            Universal beauty standards
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center p-4 bg-purple-50 rounded-xl"
        >
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold">ア</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Anime</h4>
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {biasData.anime}%
          </div>
          <p className="text-xs text-gray-600">
            Exaggerated features, kawaii style
          </p>
        </motion.div>
      </div>

      {/* Educational Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-ai-50 to-beauty-50 rounded-xl p-6"
      >
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-ai-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-ai-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Understanding AI Bias
            </h3>
            <p className="text-gray-600 mb-4">
              This analysis reveals how artificial intelligence systems can reflect and perpetuate 
              cultural biases in beauty standards. The variations you see demonstrate that "beauty" 
              is not universal but culturally constructed.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Why This Matters:</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• AI systems learn from biased data</li>
                  <li>• Cultural standards vary widely</li>
                  <li>• Beauty is subjective, not objective</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Our Approach:</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Transparent bias analysis</li>
                  <li>• Multiple cultural perspectives</li>
                  <li>• Educational awareness</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-8"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Learn More About AI Bias
        </h3>
        <p className="text-gray-600 mb-4">
          Explore our research on algorithmic bias and beauty standards across cultures.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="ai-gradient text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Read Research Paper
        </motion.button>
      </motion.div>
    </motion.div>
  )
} 