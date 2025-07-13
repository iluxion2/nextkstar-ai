import Leaderboard from '../components/Leaderboard'

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Beauty Score Leaderboard</h1>
          <p className="text-gray-600">See how you rank against others</p>
        </div>
        <Leaderboard language="en" />
      </div>
    </div>
  )
} 