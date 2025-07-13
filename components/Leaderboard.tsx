'use client'

import { motion } from 'framer-motion'
import { Trophy, Crown, Medal, Star, Share2, Users, TrendingUp, Globe } from 'lucide-react'

interface LeaderboardProps {
  beautyScore: number
}

export default function Leaderboard({ beautyScore }: LeaderboardProps) {
  // Mock leaderboard data
  const leaderboardData = [
    { rank: 1, name: "Sarah Kim", score: 98, country: "🇰🇷", avatar: "SK" },
    { rank: 2, name: "Emma Wilson", score: 96, country: "🇺🇸", avatar: "EW" },
    { rank: 3, name: "Yuki Tanaka", score: 95, country: "🇯🇵", avatar: "YT" },
    { rank: 4, name: "Maria Garcia", score: 93, country: "🇪🇸", avatar: "MG" },
    { rank: 5, name: "Alex Chen", score: 92, country: "🇨🇦", avatar: "AC" },
    { rank: 6, name: "Lisa Park", score: 91, country: "🇰🇷", avatar: "LP" },
    { rank: 7, name: "David Brown", score: 90, country: "🇬🇧", avatar: "DB" },
    { rank: 8, name: "Sophie Martin", score: 89, country: "🇫🇷", avatar: "SM" },
    { rank: 9, name: "Carlos Silva", score: 88, country: "🇧🇷", avatar: "CS" },
    { rank: 10, name: "Anna Kowalski", score: 87, country: "🇵🇱", avatar: "AK" }
  ]

  const getUserRank = () => {
    const userRank = leaderboardData.findIndex(item => item.score <= beautyScore) + 1
    return userRank > 10 ? userRank : null
  }

  const getScoreOutOf10 = (score: number) => {
    return Math.round(score / 10)
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-gray-600">#{rank}</span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500'
      case 3:
        return 'bg-gradient-to-r from-amber-500 to-amber-700'
      default:
        return 'bg-white'
    }
  }

  const userRank = getUserRank()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
          Global Leaderboard
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          See how you rank among users worldwide! Share your results and compete for the top spots 
          in our global beauty analysis leaderboard.
        </p>
      </div>

      {/* User's Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-r from-beauty-50 to-ai-50 rounded-xl p-6 border-2 border-beauty-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 beauty-gradient rounded-full flex items-center justify-center text-white font-bold text-xl">
                YOU
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Your Score</h3>
                <p className="text-gray-600">Global Ranking</p>
              </div>
            </div>
                          <div className="text-right">
                <div className="text-3xl font-bold text-beauty-600 mb-1">
                  {getScoreOutOf10(beautyScore)}/10
                </div>
                <div className="text-sm text-gray-600">
                  ({beautyScore}/100) • {userRank ? `Rank #${userRank}` : 'Top 10!'}
                </div>
              </div>
          </div>
          
          <div className="mt-4 flex items-center justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 beauty-gradient text-white rounded-lg font-semibold"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Results</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              <span>View Full Ranking</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Top 10 Leaderboard */}
      <div className="space-y-3 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Crown className="w-5 h-5 text-yellow-500 mr-2" />
          Top 10 Global Rankings
        </h3>
        
        {leaderboardData.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center justify-between p-4 rounded-xl border ${
              item.rank <= 3 ? 'shadow-lg' : 'bg-white'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                item.rank <= 3 ? getRankColor(item.rank) : 'bg-gray-100'
              }`}>
                {getRankIcon(item.rank)}
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-gray-600">{item.avatar}</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900">{item.name}</div>
                <div className="text-sm text-gray-600 flex items-center space-x-2">
                  <span>{item.country}</span>
                  <span>•</span>
                  <span>Rank #{item.rank}</span>
                </div>
              </div>
            </div>
                         <div className="text-right">
               <div className="text-xl font-bold text-gray-900">{getScoreOutOf10(item.score)}/10</div>
               <div className="text-sm text-gray-600">({item.score}/100)</div>
             </div>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center p-4 bg-white rounded-xl border"
        >
          <Users className="w-8 h-8 text-beauty-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 mb-1">10,000+</div>
          <div className="text-sm text-gray-600">Active Users</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center p-4 bg-white rounded-xl border"
        >
          <Globe className="w-8 h-8 text-ai-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 mb-1">50+</div>
          <div className="text-sm text-gray-600">Countries</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center p-4 bg-white rounded-xl border"
        >
          <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 mb-1">4.9/5</div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Join the Competition!
        </h3>
        <p className="text-gray-600 mb-4">
          Share your results with friends and see how you compare to users worldwide. 
          The leaderboard updates in real-time!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="beauty-gradient text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Share My Results
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-gray-300 text-gray-700 px-6 py-2 rounded-full font-semibold hover:border-beauty-300 hover:text-beauty-600 transition-all duration-300"
          >
            View Full Leaderboard
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
} 