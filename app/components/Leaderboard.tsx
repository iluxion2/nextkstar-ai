'use client'

import { useState } from 'react'
import Image from 'next/image'

interface LeaderboardProps {
  language: string
}

const awardImages = [
  '/images/1.png',
  '/images/2.png',
  '/images/3.png',
]

const leaderboardData = {
  today: [
    { name: "User 1", score: 96, rank: 1, img: '/images/profile1.png' },
    { name: "User 2", score: 94, rank: 2, img: '/images/profile2.png' },
    { name: "User 3", score: 92, rank: 3, img: '/images/profile3.png' },
    { name: "User 4", score: 90, rank: 4, img: '/images/profile4.png' },
    { name: "User 5", score: 81, rank: 5, img: '/images/profile5.png' },
    { name: "User 6", score: 76, rank: 6, img: '/images/profile6.png' },
    { name: "User 7", score: 72, rank: 7, img: '/images/profile7.png' },
    { name: "User 8", score: 68, rank: 8, img: '/images/profile1.png' },
    { name: "User 9", score: 65, rank: 9, img: '/images/profile2.png' },
    { name: "User 10", score: 62, rank: 10, img: '/images/profile3.png' },
    { name: "User 11", score: 59, rank: 11, img: '/images/profile4.png' },
    { name: "User 12", score: 56, rank: 12, img: '/images/profile5.png' },
    { name: "User 13", score: 53, rank: 13, img: '/images/profile6.png' },
    { name: "User 14", score: 50, rank: 14, img: '/images/profile7.png' },
    { name: "User 15", score: 47, rank: 15, img: '/images/profile1.png' },
  ],
  week: [
    { name: "User 8", score: 98, rank: 1, img: '/images/profile1.png' },
    { name: "User 9", score: 95, rank: 2, img: '/images/profile2.png' },
    { name: "User 10", score: 93, rank: 3, img: '/images/profile3.png' },
    { name: "User 11", score: 89, rank: 4, img: '/images/profile4.png' },
    { name: "User 12", score: 85, rank: 5, img: '/images/profile5.png' },
    { name: "User 13", score: 82, rank: 6, img: '/images/profile6.png' },
    { name: "User 14", score: 79, rank: 7, img: '/images/profile7.png' },
    { name: "User 15", score: 76, rank: 8, img: '/images/profile1.png' },
    { name: "User 16", score: 73, rank: 9, img: '/images/profile2.png' },
    { name: "User 17", score: 70, rank: 10, img: '/images/profile3.png' },
    { name: "User 18", score: 67, rank: 11, img: '/images/profile4.png' },
    { name: "User 19", score: 64, rank: 12, img: '/images/profile5.png' },
    { name: "User 20", score: 61, rank: 13, img: '/images/profile6.png' },
  ],
  month: [
    { name: "User 13", score: 99, rank: 1, img: '/images/profile1.png' },
    { name: "User 14", score: 97, rank: 2, img: '/images/profile2.png' },
    { name: "User 15", score: 96, rank: 3, img: '/images/profile3.png' },
    { name: "User 16", score: 91, rank: 4, img: '/images/profile4.png' },
    { name: "User 17", score: 88, rank: 5, img: '/images/profile5.png' },
    { name: "User 18", score: 85, rank: 6, img: '/images/profile6.png' },
    { name: "User 19", score: 82, rank: 7, img: '/images/profile7.png' },
    { name: "User 20", score: 79, rank: 8, img: '/images/profile1.png' },
    { name: "User 21", score: 76, rank: 9, img: '/images/profile2.png' },
    { name: "User 22", score: 73, rank: 10, img: '/images/profile3.png' },
    { name: "User 23", score: 70, rank: 11, img: '/images/profile4.png' },
    { name: "User 24", score: 67, rank: 12, img: '/images/profile5.png' },
  ],
  entire: [
    { name: "User 17", score: 100, rank: 1, img: '/images/profile1.png' },
    { name: "User 18", score: 99, rank: 2, img: '/images/profile2.png' },
    { name: "User 19", score: 98, rank: 3, img: '/images/profile3.png' },
    { name: "User 20", score: 97, rank: 4, img: '/images/profile4.png' },
    { name: "User 21", score: 96, rank: 5, img: '/images/profile5.png' },
    { name: "User 22", score: 95, rank: 6, img: '/images/profile6.png' },
    { name: "User 23", score: 94, rank: 7, img: '/images/profile7.png' },
    { name: "User 24", score: 93, rank: 8, img: '/images/profile1.png' },
    { name: "User 25", score: 92, rank: 9, img: '/images/profile2.png' },
    { name: "User 26", score: 91, rank: 10, img: '/images/profile3.png' },
    { name: "User 27", score: 90, rank: 11, img: '/images/profile4.png' },
    { name: "User 28", score: 89, rank: 12, img: '/images/profile5.png' },
    { name: "User 29", score: 88, rank: 13, img: '/images/profile6.png' },
    { name: "User 30", score: 87, rank: 14, img: '/images/profile7.png' },
  ],
}

const periods = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'entire', label: 'Entire' },
]

export default function Leaderboard({ language }: LeaderboardProps) {
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'entire'>('today')
  const data = leaderboardData[period]

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 mx-auto" style={{ maxWidth: '723px' }}>
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <div className="flex space-x-2 mb-4">
        {periods.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key as any)}
            className={`px-4 py-1 rounded-full font-semibold border transition-all duration-150 ${period === p.key ? 'bg-black text-white border-black' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'}`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {data.map((user) => (
          <div key={user.rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3 min-w-0">
              {user.rank <= 3 ? (
                <div className="w-8 h-8 flex-shrink-0">
                  <Image src={awardImages[user.rank-1]} alt={`award-${user.rank}`} width={32} height={32} className="object-contain w-full h-full" />
                </div>
              ) : (
                <span className="font-bold text-gray-500 text-lg w-8 text-center flex-shrink-0">#{user.rank}</span>
              )}
              <div className="w-10 h-10 flex-shrink-0">
                <Image src={user.img} alt={user.name} width={40} height={40} className="rounded-full bg-gray-200 object-cover w-full h-full" />
              </div>
              <span className="font-semibold truncate max-w-[120px]">{user.name}</span>
            </div>
            <span className="font-bold text-green-500 text-lg">{user.score}/100</span>
          </div>
        ))}
      </div>
    </div>
  )
} 