'use client'

import { useState, useEffect } from 'react'
import { getTranslation } from '../utils/translations'

export default function AIDisclosurePage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{getTranslation('AI Disclosure', language)}</h1>
          <p className="text-xl text-gray-600">
            {getTranslation('Transparency about our artificial intelligence technology', language)}
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{getTranslation('Our AI Technology', language)}</h2>
            <p className="text-gray-700 mb-4">
              {getTranslation('NextKStar uses advanced artificial intelligence and machine learning algorithms to provide beauty analysis services. This disclosure explains how our AI works, what data it uses, and how we ensure transparency and fairness.', language)}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{getTranslation('How Our AI Works', language)}</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{getTranslation('Facial Analysis', language)}</h3>
                <p className="text-gray-700">
                  {getTranslation('Our AI system analyzes facial features including symmetry, proportions, skin clarity, and facial structure using computer vision algorithms trained on diverse datasets.', language)}
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{getTranslation('Beauty Scoring', language)}</h3>
                <p className="text-gray-700">
                  {getTranslation('Beauty scores are calculated using machine learning models that consider multiple factors including facial harmony, feature balance, and aesthetic proportions.', language)}
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{getTranslation('Celebrity Matching', language)}</h3>
                <p className="text-gray-700">
                  {getTranslation('Our AI compares facial features against a database of celebrity images using similarity algorithms to find the closest matches based on facial characteristics.', language)}
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{getTranslation('Data and Training', language)}</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>{getTranslation('Training Data:', language)}</strong> {getTranslation('Our AI models are trained on diverse datasets that include faces from various ethnicities, ages, and cultural backgrounds to ensure fair and unbiased analysis.', language)}
              </p>
              <p className="text-gray-700">
                <strong>{getTranslation('Continuous Learning:', language)}</strong> {getTranslation('Our models are regularly updated and refined to improve accuracy and reduce bias, though we acknowledge that AI systems may still reflect societal biases present in training data.', language)}
              </p>
              <p className="text-gray-700">
                <strong>{getTranslation('User Data:', language)}</strong> {getTranslation('Photos uploaded for analysis are processed temporarily and are not used to retrain our models without explicit consent.', language)}
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{getTranslation('Bias and Fairness', language)}</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>{getTranslation('Acknowledgment of Bias:', language)}</strong> {getTranslation('We recognize that AI systems can inherit and amplify societal biases. Our cultural bias analysis feature is designed to help users understand how beauty standards vary across cultures.', language)}
              </p>
              <p className="text-gray-700">
                <strong>{getTranslation('Diversity Efforts:', language)}</strong> {getTranslation('We actively work to ensure our training data represents diverse populations and regularly audit our systems for bias.', language)}
              </p>
              <p className="text-gray-700">
                <strong>{getTranslation('Transparency:', language)}</strong> {getTranslation('We believe in being transparent about our AI\'s limitations and potential biases, which is why we provide this disclosure and cultural context in our analysis.', language)}
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{getTranslation('Accuracy and Limitations', language)}</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>{getTranslation('Subjective Nature:', language)}</strong> {getTranslation('Beauty is inherently subjective and varies across cultures and individuals. Our AI provides one perspective among many.', language)}
              </p>
              <p className="text-gray-700">
                <strong>{getTranslation('Photo Quality:', language)}</strong> {getTranslation('Analysis accuracy depends on photo quality, lighting, angle, and other factors. Results may vary significantly based on these conditions.', language)}
              </p>
              <p className="text-gray-700">
                <strong>{getTranslation('Not Definitive:', language)}</strong> {getTranslation('Our analysis should not be considered definitive or used for important life decisions. It is intended for entertainment and self-discovery purposes.', language)}
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{getTranslation('Privacy and Security', language)}</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>{getTranslation('Data Processing:', language)}</strong> {getTranslation('Photos are processed securely using encrypted connections and are automatically deleted after analysis unless you choose to save them.', language)}
              </p>
              <p className="text-gray-700">
                <strong>{getTranslation('No Permanent Storage:', language)}</strong> {getTranslation('We do not permanently store your photos without explicit consent. Analysis results may be stored temporarily to improve service quality.', language)}
              </p>
              <p className="text-gray-700">
                <strong>{getTranslation('Third-Party Access:', language)}</strong> {getTranslation('We do not share your photos or analysis results with third parties without your permission.', language)}
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{getTranslation('User Control and Rights', language)}</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>{getTranslation('Consent:', language)}</strong> {getTranslation('You have full control over your data and can choose whether to use our service and what information to share.', language)}
              </p>
              <p className="text-gray-700">
                <strong>{getTranslation('Deletion:', language)}</strong> {getTranslation('You can request deletion of your account and associated data at any time.', language)}
              </p>
              <p className="text-gray-700">
                <strong>{getTranslation('Opt-out:', language)}</strong> {getTranslation('You can choose not to save analysis results or create an account while still using basic analysis features.', language)}
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{getTranslation('Ongoing Improvements', language)}</h2>
            <p className="text-gray-700 mb-4">
              {getTranslation('We are committed to continuously improving our AI systems to be more accurate, fair, and transparent. We regularly:', language)}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>{getTranslation('Update our training data to be more diverse and representative', language)}</li>
              <li>{getTranslation('Audit our systems for bias and fairness', language)}</li>
              <li>{getTranslation('Improve our algorithms based on user feedback', language)}</li>
              <li>{getTranslation('Enhance our transparency and disclosure practices', language)}</li>
              <li>{getTranslation('Research and implement new techniques to reduce bias', language)}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{getTranslation('Contact and Questions', language)}</h2>
            <p className="text-gray-700 mb-4">
              {getTranslation('If you have questions about our AI technology, how it works, or our approach to fairness and transparency, please contact us:', language)}
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>{getTranslation('AI Ethics Team:', language)}</strong> team@nextkstar.com<br />
                <strong>{getTranslation('General Support:', language)}</strong> team@nextkstar.com<br />
                <strong>{getTranslation('Privacy Concerns:', language)}</strong> team@nextkstar.com
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 text-center space-y-4">
          <p className="text-gray-600">
            {getTranslation('This disclosure is updated regularly to reflect our current AI practices and commitments.', language)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/privacy"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              {getTranslation('Privacy Policy', language)}
            </a>
            <a
              href="/terms"
              className="inline-block border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-all"
            >
              {getTranslation('Terms of Service', language)}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 