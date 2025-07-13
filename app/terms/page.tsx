'use client'

import { useState, useEffect } from 'react'
import { getTranslation } from '../utils/translations'

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{getTranslation('Terms of Service', language)}</h1>
          <p className="text-gray-600">
            {getTranslation('Last updated:', language)} {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{getTranslation('1. Acceptance of Terms', language)}</h2>
            <p className="text-gray-700 mb-4">
              {getTranslation('By accessing and using NextKStar ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.', language)}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{getTranslation('2. Description of Service', language)}</h2>
            <p className="text-gray-700 mb-4">
              {getTranslation('NextKStar provides AI-powered beauty analysis services, including facial feature analysis, beauty scoring, celebrity matching, and cultural bias analysis. Our service uses advanced machine learning algorithms to provide insights about facial characteristics and aesthetic features.', language)}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{getTranslation('3. User Responsibilities', language)}</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>{getTranslation('Age Requirement:', language)}</strong> {getTranslation('You must be at least 18 years old to use our service. Users under 18 are not permitted to upload photos or use our analysis features.', language)}
              </p>
              <p className="text-gray-700">
                <strong>{getTranslation('Photo Content:', language)}</strong> {getTranslation('You may only upload photos of yourself or photos for which you have explicit permission to use. Do not upload photos of children, celebrities without permission, or any content that violates others\' privacy rights.', language)}
              </p>
              <p className="text-gray-700">
                <strong>{getTranslation('Appropriate Use:', language)}</strong> {getTranslation('You agree to use our service for lawful purposes only and in a way that does not infringe the rights of, restrict, or inhibit anyone else\'s use and enjoyment of the service.', language)}
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{getTranslation('4. Privacy and Data Protection', language)}</h2>
            <p className="text-gray-700 mb-4">
              {getTranslation('Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices regarding the collection and use of your personal information.', language)}
            </p>
            <p className="text-gray-700">
              {getTranslation('We implement industry-standard security measures to protect your data, including SSL encryption and secure data processing protocols.', language)}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{getTranslation('5. AI Analysis Disclaimer', language)}</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>{getTranslation('Accuracy:', language)}</strong> {getTranslation('While our AI technology is advanced, beauty analysis results are subjective and should not be considered definitive. Results may vary based on photo quality, lighting, and other factors.', language)}
              </p>
              <p className="text-gray-700">
                <strong>{getTranslation('Cultural Bias:', language)}</strong> {getTranslation('Our system acknowledges that beauty standards vary across cultures. Our cultural bias analysis is provided for educational purposes and should not be used to make definitive judgments about beauty.', language)}
              </p>
              <p className="text-gray-700">
                <strong>{getTranslation('Not Medical Advice:', language)}</strong> {getTranslation('Our service is for entertainment and self-discovery purposes only. It is not intended to provide medical, psychological, or professional advice.', language)}
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{getTranslation('6. Intellectual Property', language)}</h2>
            <p className="text-gray-700 mb-4">
              {getTranslation('The Service and its original content, features, and functionality are and will remain the exclusive property of NextKStar and its licensors. The Service is protected by copyright, trademark, and other laws.', language)}
            </p>
            <p className="text-gray-700">
              {getTranslation('You retain ownership of any photos you upload, but you grant us a limited license to process your images for analysis purposes only.', language)}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{getTranslation('7. Limitation of Liability', language)}</h2>
            <p className="text-gray-700 mb-4">
              {getTranslation('In no event shall NextKStar, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.', language)}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{getTranslation('8. Service Availability', language)}</h2>
            <p className="text-gray-700 mb-4">
              {getTranslation('We strive to maintain the Service\'s availability, but we do not guarantee that the Service will be available at all times. We may suspend or discontinue the Service at any time without notice.', language)}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{getTranslation('9. Changes to Terms', language)}</h2>
            <p className="text-gray-700 mb-4">
              {getTranslation('We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.', language)}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{getTranslation('10. Governing Law', language)}</h2>
            <p className="text-gray-700 mb-4">
              {getTranslation('These Terms shall be interpreted and governed by the laws of the United States, without regard to its conflict of law provisions.', language)}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{getTranslation('11. Contact Information', language)}</h2>
            <p className="text-gray-700 mb-4">
              {getTranslation('If you have any questions about these Terms of Service, please contact us at:', language)}
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>{getTranslation('Email:', language)}</strong> legal@nextkstar.com<br />
                <strong>{getTranslation('Address:', language)}</strong> NextKStar Inc., 123 AI Boulevard, Tech City, TC 12345, United States
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 text-center">
          <a
            href="/privacy"
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            {getTranslation('View Privacy Policy', language)}
          </a>
        </div>
      </div>
    </div>
  )
} 