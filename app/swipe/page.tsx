'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion'
import { Heart, X, Star, MessageCircle, User, Settings, ArrowLeft, Flame } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface Profile {
  id: number
  name: string
  age: number
  image: string
  bio: string
  distance: string
  mutualFriends?: number
}

const mockProfiles: Profile[] = [
  {
    id: 1,
    name: "Sarah",
    age: 24,
    image: "/images/celebrity1.jpg",
    bio: "Love traveling, coffee, and good conversations ☕️✈️",
    distance: "2 miles away",
    mutualFriends: 3
  },
  {
    id: 2,
    name: "Emma",
    age: 26,
    image: "/images/celebrity2.jpg",
    bio: "Adventure seeker | Foodie | Dog lover 🐕",
    distance: "5 miles away"
  },
  {
    id: 3,
    name: "Jessica",
    age: 23,
    image: "/images/celebrity3.jpg",
    bio: "Artist by day, dreamer by night 🎨✨",
    distance: "1 mile away",
    mutualFriends: 1
  },
  {
    id: 4,
    name: "Mia",
    age: 25,
    image: "/images/celebrity4.jpg",
    bio: "Fitness enthusiast | Nature lover 🌿💪",
    distance: "3 miles away"
  },
  {
    id: 5,
    name: "Sophie",
    age: 27,
    image: "/images/celebrity5.jpg",
    bio: "Bookworm | Tea addict | Cat person 📚🐱",
    distance: "4 miles away",
    mutualFriends: 2
  }
]

export default function SwipePage() {
  const [profiles, setProfiles] = useState<Profile[]>(mockProfiles)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showMatch, setShowMatch] = useState(false)
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null)
  const router = useRouter()

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const currentProfile = profiles[currentIndex]

  const handleDragEnd = (event: any, info: PanInfo) => {
    const swipeThreshold = 80

    if (info.offset.x > swipeThreshold) {
      // Right swipe = Like (check)
      handleLike()
    } else if (info.offset.x < -swipeThreshold) {
      // Left swipe = Pass (X)
      handlePass()
    }
  }

  const handleLike = () => {
    if (Math.random() > 0.7) {
      setMatchedProfile(currentProfile)
      setShowMatch(true)
    }
    nextProfile()
  }

  const handlePass = () => {
    nextProfile()
  }

  const handleSuperLike = () => {
    nextProfile()
  }

  const nextProfile = () => {
    setCurrentIndex(prev => prev + 1)
    x.set(0)
  }

  const resetProfiles = () => {
    setProfiles([...mockProfiles])
    setCurrentIndex(0)
    x.set(0)
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="flex min-h-screen bg-white">
        {/* Static Left Sidebar */}
        <div className="w-64 bg-white shadow-lg fixed left-0 top-0 h-full z-40">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">
              KScan
            </h1>
            
            {/* Navigation Menu */}
            <nav className="space-y-4">
              <a href="/" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-6 h-6 bg-blue-500 rounded"></div>
                <span className="font-medium text-gray-700">Home</span>
              </a>
              <a href="/analysis" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-6 h-6 bg-blue-500 rounded"></div>
                <span className="font-medium text-gray-700">KScan</span>
              </a>
              <a href="/swipe" className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 border-l-4 border-blue-500">
                <div className="w-6 h-6 bg-purple-500 rounded"></div>
                <span className="font-medium text-blue-700">Swipe</span>
              </a>
              <a href="/messages" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-6 h-6 bg-green-500 rounded"></div>
                <span className="font-medium text-gray-700">Messages</span>
              </a>
              <a href="/leaderboard" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-6 h-6 bg-yellow-500 rounded"></div>
                <span className="font-medium text-gray-700">Leaderboard</span>
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center px-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Flame size={48} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No more profiles</h2>
            <p className="text-gray-500 mb-8">Check back later for new people!</p>
            <button
              onClick={resetProfiles}
              className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white to-[#ffe0ec]">
      {/* Static Left Sidebar */}
      <div className="w-64 bg-white shadow-lg fixed left-0 top-0 h-full z-40">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">
            KScan
          </h1>
          
          {/* Navigation Menu */}
          <nav className="space-y-4">
            <a href="/analysis" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-6 h-6 bg-blue-500 rounded"></div>
              <span className="font-medium text-gray-700">KScan</span>
            </a>
            <a href="/swipe" className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 border-l-4 border-blue-500">
              <div className="w-6 h-6 bg-purple-500 rounded"></div>
              <span className="font-medium text-blue-700">Swipe</span>
            </a>
            <a href="/messages" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-6 h-6 bg-green-500 rounded"></div>
              <span className="font-medium text-gray-700">Messages</span>
            </a>
            <a href="/leaderboard" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-6 h-6 bg-yellow-500 rounded"></div>
              <span className="font-medium text-gray-700">Leaderboard</span>
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Main Swipe Area */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative flex items-center space-x-8">
            {/* Left Button */}
            <button
              onClick={handlePass}
              className="w-16 h-16 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-lg hover:scale-105"
            >
              <X size={28} className="text-gray-400" />
            </button>
            
            {/* Card Container */}
            <div className="relative w-[450px] h-[700px]">
              {/* Profile Card */}
              <motion.div
                key={currentProfile.id}
                style={{ x, rotate, opacity }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                className="absolute w-full h-[700px] bg-white rounded-2xl shadow-lg overflow-hidden cursor-grab active:cursor-grabbing border border-gray-100"
              >
                {/* Swipe Feedback Overlays */}
                <motion.div
                  style={{
                    opacity: useTransform(x, [0, 100], [0, 1]),
                    scale: useTransform(x, [0, 100], [0.8, 1])
                  }}
                  className="absolute top-8 right-8 z-20"
                >
                  <div className="bg-green-500 text-white text-6xl font-bold rounded-full w-20 h-20 flex items-center justify-center shadow-lg">
                    ✓
                  </div>
                </motion.div>
                
                <motion.div
                  style={{
                    opacity: useTransform(x, [-100, 0], [1, 0]),
                    scale: useTransform(x, [-100, 0], [1, 0.8])
                  }}
                  className="absolute top-8 left-8 z-20"
                >
                  <div className="bg-red-500 text-white text-6xl font-bold rounded-full w-20 h-20 flex items-center justify-center shadow-lg">
                    ✕
                  </div>
                </motion.div>
                {/* Profile Image */}
                <div className="relative w-full h-full">
                  <Image
                    src={currentProfile.image}
                    alt={currentProfile.name}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Profile Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-3xl font-bold">
                        {currentProfile.name}, {currentProfile.age}
                      </h2>
                      {currentProfile.mutualFriends && (
                        <div className="flex items-center space-x-1 text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          <User size={14} />
                          <span>{currentProfile.mutualFriends} mutual</span>
                        </div>
                      )}
                    </div>
                    <p className="text-base opacity-90 mb-2 leading-relaxed">{currentProfile.bio}</p>
                    <p className="text-sm opacity-75">{currentProfile.distance}</p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Right Button */}
            <button
              onClick={handleLike}
              className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center hover:from-pink-600 hover:to-red-600 transition-all shadow-lg hover:scale-105"
            >
              <Heart size={28} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Match Modal */}
      {showMatch && matchedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 text-center max-w-sm mx-4"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">It's a Match!</h2>
            <p className="text-gray-600 mb-6">
              You and {matchedProfile.name} liked each other
            </p>
            
            <div className="flex space-x-3 mb-6">
              <button className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all">
                Keep Swiping
              </button>
              <button className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-full font-semibold hover:from-pink-600 hover:to-red-600 transition-all">
                Send Message
              </button>
            </div>
            
            <button
              onClick={() => setShowMatch(false)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
} 