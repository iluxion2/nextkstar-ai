'use client'

interface BiasAnalysisProps {
  biasAnalysis: {
    korean: number
    western: number
    global: number
    anime: number
  }
  language: string
}

export default function BiasAnalysis({ biasAnalysis, language }: BiasAnalysisProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Bias Analysis</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{biasAnalysis.korean}%</div>
          <div className="text-sm text-gray-600">Korean</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{biasAnalysis.western}%</div>
          <div className="text-sm text-gray-600">Western</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{biasAnalysis.global}%</div>
          <div className="text-sm text-gray-600">Global</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-600">{biasAnalysis.anime}%</div>
          <div className="text-sm text-gray-600">Anime</div>
        </div>
      </div>
    </div>
  )
} 