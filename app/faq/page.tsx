'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "How does the AI beauty analysis work?",
    answer: "Our AI system uses advanced deep learning algorithms to analyze facial features, symmetry, proportions, and other aesthetic characteristics. It compares your features against a diverse database of faces to provide objective beauty insights and celebrity matches."
  },
  {
    question: "Is my photo stored permanently?",
    answer: "No, we prioritize your privacy. Photos are processed temporarily for analysis and are automatically deleted after processing. We never store your images permanently without your explicit consent."
  },
  {
    question: "How accurate are the beauty scores?",
    answer: "Our beauty scores are based on objective facial analysis using advanced AI algorithms. However, beauty is subjective and varies across cultures. Our scores provide insights but should be viewed as one perspective among many."
  },
  {
    question: "What types of photos work best?",
    answer: "For best results, use clear, well-lit photos with your face clearly visible. Avoid heavily filtered images, extreme angles, or photos with multiple people. Front-facing photos with neutral expressions work best."
  },
  {
    question: "How do you ensure cultural sensitivity?",
    answer: "Our AI is trained on diverse datasets representing various ethnicities and cultures. We provide cultural bias analysis to help users understand how beauty standards vary across different cultures and regions."
  },
  {
    question: "Can I use the service without creating an account?",
    answer: "Yes! You can use our basic analysis features without creating an account. However, creating an account allows you to save your results, track your progress, and access additional features."
  },
  {
    question: "What celebrity matching criteria do you use?",
    answer: "Our celebrity matching is based on facial feature similarity, including facial structure, eye shape, nose characteristics, and overall facial proportions. The system compares your features against our celebrity database to find the closest matches."
  },
  {
    question: "Is the service free to use?",
    answer: "We offer both free and premium features. Basic beauty analysis and celebrity matching are free. Premium features include detailed facial feature breakdowns, cultural bias analysis, and result history."
  },
  {
    question: "How do you protect my privacy?",
    answer: "We implement industry-standard security measures including SSL encryption, secure data processing, and automatic image deletion. We never share your personal data with third parties without your consent."
  },
  {
    question: "What if the AI doesn't detect a face in my photo?",
    answer: "If our AI can't detect a face, it might be due to poor lighting, extreme angles, or the photo not containing a clear human face. Try uploading a clearer, front-facing photo with good lighting."
  },
  {
    question: "Can I analyze photos of children?",
    answer: "Our service is designed for adults 18 and older. We do not recommend using our service for children's photos, and we have measures in place to detect and reject such uploads."
  },
  {
    question: "How often can I get analyzed?",
    answer: "You can use our service as often as you'd like! Each analysis provides fresh insights, and you can track how your results might change over time with different photos or lighting conditions."
  }
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">
            Everything you need to know about NextKStar
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900">{item.question}</span>
                {openItems.includes(index) ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </button>
              {openItems.includes(index) && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Contact Us
            </a>
            <a
              href="/analysis"
              className="inline-block border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-all"
            >
              Try Analysis
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 