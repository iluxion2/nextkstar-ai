'use client'

import Image from 'next/image'

interface CelebrityMatchProps {
  celebrityMatches: Array<{
    name: string
    image: string
    similarity: number
    category: string
  }>
  language: string
}

export default function CelebrityMatch({ celebrityMatches, language }: CelebrityMatchProps) {
  // Default celebrity data with specific images
  const defaultCelebrities = [
    {
      name: 'Taehyung (V)',
      image: '/images/v.png',
      similarity: 85,
      category: 'K-Pop Star'
    }
  ]

  // Use provided matches or default celebrities (only show 1)
  const displayMatches = celebrityMatches.length > 0 ? celebrityMatches.slice(0, 1) : defaultCelebrities

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">
        Celebrity Matches
      </h2>
      <div className="flex justify-center">
        {displayMatches.map((match, index) => (
          <div key={index} className="text-center group hover:scale-105 transition-transform duration-200">
            <div className="mb-4">
              <div className="w-28 h-28 rounded-full mx-auto overflow-hidden border-4 border-gradient-to-r from-purple-400 to-pink-400 shadow-lg">
                <img 
                  src={match.image} 
                  alt={match.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="font-bold text-gray-800 mb-2 text-lg">{match.name}</div>
            <div className="text-sm text-gray-500">{match.category}</div>
          </div>
        ))}
      </div>
    </div>
  )
} 