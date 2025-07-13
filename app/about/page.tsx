'use client'

import { useState, useEffect } from 'react'
import { getTranslation } from '../utils/translations'

export default function AboutPage() {
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'en'
    }
    return 'en'
  })

  // Save language to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language)
    }
  }, [language])

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{getTranslation('About NextKStar', language)}</h1>
          <p className="text-xl text-gray-600">
            {getTranslation('Revolutionizing beauty analysis with AI technology', language)}
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">{getTranslation('Our Mission', language)}</h2>
            <p className="text-gray-700 mb-4">
              {getTranslation('At NextKStar, we believe that beauty is diverse, subjective, and deeply personal. Our mission is to provide users with insightful, AI-powered beauty analysis that celebrates individuality while offering objective insights into facial features and aesthetic characteristics.', language)}
            </p>
            <p className="text-gray-700">
              {getTranslation('We combine cutting-edge artificial intelligence with cultural sensitivity to deliver beauty scores, celebrity matches, and cultural bias analysis that respects and celebrates the diversity of human beauty across different cultures and standards.', language)}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">{getTranslation('What We Do', language)}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{getTranslation('Beauty Analysis', language)}</h3>
                <p className="text-gray-600">
                  {getTranslation('Advanced AI algorithms analyze facial features, symmetry, and proportions to provide comprehensive beauty insights.', language)}
                </p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{getTranslation('Celebrity Matches', language)}</h3>
                <p className="text-gray-600">
                  {getTranslation('Find your celebrity lookalikes and discover which famous faces share similar features with you.', language)}
                </p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{getTranslation('Cultural Insights', language)}</h3>
                <p className="text-gray-600">
                  {getTranslation('Understand how beauty standards vary across cultures and get insights into different aesthetic preferences.', language)}
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">{getTranslation('Our Technology', language)}</h2>
            <p className="text-gray-700 mb-4">
              {getTranslation('NextKStar leverages state-of-the-art deep learning models and computer vision technology to provide accurate and insightful beauty analysis. Our AI systems are trained on diverse datasets to ensure fair and unbiased results across different ethnicities, ages, and cultural backgrounds.', language)}
            </p>
            <p className="text-gray-700">
              {getTranslation('We prioritize user privacy and data security, ensuring that all uploaded images are processed securely and never stored permanently without explicit consent.', language)}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">{getTranslation('Our Values', language)}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{getTranslation('Diversity & Inclusion', language)}</h3>
                <p className="text-gray-600">
                  {getTranslation('We celebrate beauty in all its forms and work to ensure our technology recognizes and respects the diversity of human appearance.', language)}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{getTranslation('Privacy & Security', language)}</h3>
                <p className="text-gray-600">
                  {getTranslation('Your privacy is paramount. We implement robust security measures and transparent data practices to protect your information.', language)}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{getTranslation('Innovation', language)}</h3>
                <p className="text-gray-600">
                  {getTranslation('We continuously improve our AI technology to provide more accurate, insightful, and culturally sensitive beauty analysis.', language)}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{getTranslation('User Experience', language)}</h3>
                <p className="text-gray-600">
                  {getTranslation('We design our platform to be intuitive, engaging, and accessible to users from all backgrounds and technical levels.', language)}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">{getTranslation('Get Started', language)}</h2>
            <p className="text-gray-700 mb-6">
              {getTranslation('Ready to discover your beauty insights? Upload a photo and let our AI technology provide you with detailed analysis, celebrity matches, and cultural beauty perspectives.', language)}
            </p>
            <a
              href="/analysis"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              {getTranslation('Start Your Analysis', language)}
            </a>
          </section>
        </div>
      </div>
    </div>
  )
} 