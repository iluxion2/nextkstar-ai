'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { collection, query, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore'
import { db } from '../firebase'

interface LeaderboardProps {
  language: string
}

interface AnalysisData {
  id: string
  userId: string
  userEmail: string | null
  userDisplayName: string | null
  isGuest: boolean
  beautyScore: number
  imageData: string | null
  createdAt: Timestamp
}

const awardImages = [
  '/images/1.png',
  '/images/2.png',
  '/images/3.png',
]

const periods = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'entire', label: 'Entire' },
]

export default function Leaderboard({ language }: LeaderboardProps) {
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'entire'>('today')
  const [data, setData] = useState<AnalysisData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboardData()
  }, [period])

  const fetchLeaderboardData = async () => {
    setLoading(true)
    try {
      const now = new Date()
      let startDate: Date

      switch (period) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case 'entire':
          startDate = new Date(0) // Beginning of time
          break
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      }

      const analysesRef = collection(db, 'Leaderboard')
      let q = query(
        analysesRef,
        orderBy('beautyScore', 'desc'),
        limit(50)
      )

      // Add date filter for periods other than 'entire'
      if (period !== 'entire') {
        q = query(
          analysesRef,
          where('createdAt', '>=', Timestamp.fromDate(startDate)),
          orderBy('beautyScore', 'desc'),
          limit(50)
        )
      }

      const querySnapshot = await getDocs(q)
      const analyses: AnalysisData[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        analyses.push({
          id: doc.id,
          userId: data.userId,
          userEmail: data.userEmail,
          userDisplayName: data.userDisplayName,
          isGuest: data.isGuest,
          beautyScore: data.beautyScore,
          imageData: data.imageData,
          createdAt: data.createdAt
        })
      })

      analyses.sort((a, b) => b.beautyScore - a.beautyScore)
      console.log('Fetched leaderboard data:', analyses)
      setData(analyses)
    } catch (error) {
      console.error('Error fetching leaderboard data:', error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const getUserDisplayName = (analysis: AnalysisData) => {
    if (analysis.userDisplayName) {
      return analysis.userDisplayName
    }
    if (analysis.userEmail) {
      return analysis.userEmail.split('@')[0]
    }
    return analysis.isGuest ? `Guest ${analysis.userId.slice(-4)}` : 'Anonymous'
  }

  const getImageSrc = (analysis: AnalysisData) => {
    if (analysis.imageData && analysis.imageData.startsWith('data:image')) {
      return analysis.imageData
    }
    // Fallback to a default avatar
    return '/images/profile1.png'
  }

  if (loading) {
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
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

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
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No analyses found for this period
          </div>
        ) : (
          data.map((analysis, index) => (
            <div key={analysis.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3 min-w-0">
                {index < 3 ? (
                <div className="w-8 h-8 flex-shrink-0">
                    <Image src={awardImages[index]} alt={`award-${index + 1}`} width={32} height={32} className="object-contain w-full h-full" />
                </div>
              ) : (
                  <span className="font-bold text-gray-500 text-lg w-8 text-center flex-shrink-0">#{index + 1}</span>
              )}
              <div className="w-10 h-10 flex-shrink-0">
                  <img 
                    src={getImageSrc(analysis)} 
                    alt={getUserDisplayName(analysis)} 
                    className="rounded-full bg-gray-200 object-cover w-full h-full"
                    onError={(e) => {
                      e.currentTarget.src = '/images/profile1.png'
                    }}
                  />
                </div>
                <span className="font-semibold truncate max-w-[120px]">{getUserDisplayName(analysis)}</span>
              </div>
              <span className="font-bold text-green-500 text-lg">{analysis.beautyScore}/100</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
} 