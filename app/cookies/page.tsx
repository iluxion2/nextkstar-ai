'use client'

import { useState } from 'react'
import { Settings, CheckCircle, XCircle, Info } from 'lucide-react'

export default function CookiesPage() {
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
    personalization: false
  })

  const handlePreferenceChange = (type: string, value: boolean) => {
    if (type === 'necessary') return // Can't disable necessary cookies
    
    setCookiePreferences(prev => ({
      ...prev,
      [type]: value
    }))
  }

  const savePreferences = () => {
    localStorage.setItem('consent-preferences', JSON.stringify(cookiePreferences))
    localStorage.setItem('consent-choice', 'custom')
    
    // Update Google Tag Manager consent state
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': cookiePreferences.analytics ? 'granted' : 'denied',
        'ad_storage': cookiePreferences.marketing ? 'granted' : 'denied',
        'personalization_storage': cookiePreferences.personalization ? 'granted' : 'denied'
      })
    }
    
    alert('Cookie preferences saved!')
  }

  const cookieTypes = [
    {
      type: 'necessary',
      name: 'Necessary Cookies',
      description: 'These cookies are essential for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.',
      examples: ['Session management', 'Security features', 'Basic functionality'],
      required: true
    },
    {
      type: 'analytics',
      name: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
      examples: ['Google Analytics', 'Page views', 'User behavior'],
      required: false
    },
    {
      type: 'marketing',
      name: 'Marketing Cookies',
      description: 'These cookies are used to track visitors across websites to display relevant and engaging advertisements.',
      examples: ['Google AdSense', 'Social media ads', 'Retargeting'],
      required: false
    },
    {
      type: 'personalization',
      name: 'Personalization Cookies',
      description: 'These cookies allow the website to remember choices you make and provide enhanced, more personal features.',
      examples: ['Language preferences', 'Theme settings', 'Customized content'],
      required: false
    }
  ]

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-xl text-gray-600">
            Learn about how we use cookies and manage your preferences
          </p>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Are Cookies?</h2>
            <p className="text-gray-700 mb-4">
              Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and analyzing how you use our site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Cookies</h2>
            <p className="text-gray-700 mb-4">
              We use cookies to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Ensure our website functions properly</li>
              <li>Analyze how visitors use our site to improve user experience</li>
              <li>Provide personalized content and advertisements</li>
              <li>Remember your preferences and settings</li>
              <li>Maintain security and prevent fraud</li>
            </ul>
          </section>
        </div>

        {/* Cookie Management */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Manage Cookie Preferences</h2>
          <div className="space-y-6">
            {cookieTypes.map((cookie) => (
              <div key={cookie.type} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{cookie.name}</h3>
                      {cookie.required && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Required</span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-3">{cookie.description}</p>
                    <div className="text-sm text-gray-600">
                      <strong>Examples:</strong> {cookie.examples.join(', ')}
                    </div>
                  </div>
                  <div className="ml-4">
                    {cookie.required ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle size={20} />
                        <span className="text-sm font-medium">Always Active</span>
                      </div>
                    ) : (
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cookiePreferences[cookie.type as keyof typeof cookiePreferences]}
                          onChange={(e) => handlePreferenceChange(cookie.type, e.target.checked)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {cookiePreferences[cookie.type as keyof typeof cookiePreferences] ? 'Enabled' : 'Disabled'}
                        </span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={savePreferences}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Save Preferences
            </button>
            <button
              onClick={() => {
                setCookiePreferences({
                  necessary: true,
                  analytics: true,
                  marketing: true,
                  personalization: true
                })
              }}
              className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-all"
            >
              Accept All
            </button>
            <button
              onClick={() => {
                setCookiePreferences({
                  necessary: true,
                  analytics: false,
                  marketing: false,
                  personalization: false
                })
              }}
              className="border-2 border-gray-300 text-gray-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              Reject All
            </button>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Third-Party Cookies</h3>
              <p className="text-gray-700 text-sm">
                We may use third-party services that place their own cookies on your device. These services include Google Analytics, Google AdSense, and social media platforms.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Cookie Duration</h3>
              <p className="text-gray-700 text-sm">
                Session cookies are deleted when you close your browser. Persistent cookies remain on your device for a set period or until you delete them.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Browser Settings</h3>
              <p className="text-gray-700 text-sm">
                You can control cookies through your browser settings. However, disabling certain cookies may affect website functionality.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Updates to Policy</h3>
              <p className="text-gray-700 text-sm">
                We may update this cookie policy from time to time. We will notify you of any material changes through our website or email.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Questions About Cookies?</h2>
          <p className="text-gray-600 mb-6">
            If you have questions about our use of cookies, please contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Contact Us
            </a>
            <a
              href="/privacy"
              className="inline-block border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-all"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 