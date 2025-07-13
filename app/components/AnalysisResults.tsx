'use client'

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
  language: string
}

export default function AnalysisResults({ result, language }: AnalysisResultsProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-3 mb-3 mx-auto" style={{ maxWidth: '725px', marginLeft: 'calc(50% - 362.5px + 4px)' }}>
      <h2 className="text-lg font-bold mb-2">Analysis Results</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Beauty Score */}
        <div className="text-center">
          <div className="text-3xl font-bold text-beauty-600 mb-1">
            {result.beautyScore}/100
          </div>
          <div className="text-gray-600 text-sm">Beauty Score</div>
        </div>

        {/* Facial Features */}
        <div>
          <h3 className="text-base font-semibold mb-2">Facial Features</h3>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm">Symmetry</span>
              <span className="font-semibold text-sm">{result.facialFeatures.symmetry}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Skin Clarity</span>
              <span className="font-semibold text-sm">{result.facialFeatures.skinClarity}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Proportions</span>
              <span className="font-semibold text-sm">{result.facialFeatures.proportions}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Expression</span>
              <span className="font-semibold text-sm">{result.facialFeatures.expression}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 