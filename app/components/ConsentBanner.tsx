'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Settings, CheckCircle } from 'lucide-react'

interface ConsentBannerProps {
  onConsent: (consent: boolean) => void
  onManageOptions: () => void
}

export default function ConsentBanner({ onConsent, onManageOptions }: ConsentBannerProps) {
  const [showBanner, setShowBanner] = useState(false)
  const [showManageModal, setShowManageModal] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
    personalization: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consentChoice = localStorage.getItem('consent-choice')
    if (!consentChoice) {
      setShowBanner(true)
    }
  }, [])

  const handleConsent = (acceptAll: boolean) => {
    if (acceptAll) {
      // Accept all cookies
      setPreferences({
        necessary: true,
        analytics: true,
        marketing: true,
        personalization: true
      })
      localStorage.setItem('consent-choice', 'accept-all')
      localStorage.setItem('consent-preferences', JSON.stringify({
        necessary: true,
        analytics: true,
        marketing: true,
        personalization: true
      }))
    } else {
      // Accept only necessary cookies
      localStorage.setItem('consent-choice', 'necessary-only')
      localStorage.setItem('consent-preferences', JSON.stringify(preferences))
    }
    
    setShowBanner(false)
    onConsent(acceptAll)
    
    // Trigger Google Tag Manager consent update
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': acceptAll || preferences.analytics ? 'granted' : 'denied',
        'ad_storage': acceptAll || preferences.marketing ? 'granted' : 'denied',
        'personalization_storage': acceptAll || preferences.personalization ? 'granted' : 'denied'
      })
    }
  }

  const handleSavePreferences = () => {
    localStorage.setItem('consent-choice', 'custom')
    localStorage.setItem('consent-preferences', JSON.stringify(preferences))
    setShowManageModal(false)
    setShowBanner(false)
    onConsent(false)
    
    // Trigger Google Tag Manager consent update
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': preferences.analytics ? 'granted' : 'denied',
        'ad_storage': preferences.marketing ? 'granted' : 'denied',
        'personalization_storage': preferences.personalization ? 'granted' : 'denied'
      })
    }
  }

  if (!showBanner) return null

  return (
    <>
      {/* Main Consent Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4"
          >
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  We value your privacy
                </h3>
                <p className="text-sm text-gray-600">
                  We use cookies and similar technologies to provide, protect, and improve our services. 
                  By clicking "Accept all", you consent to our use of cookies for analytics, marketing, and personalization.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowManageModal(true)}
                  className="flex items-center justify-center gap-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings size={16} />
                  Manage options
                </button>
                <button
                  onClick={() => handleConsent(true)}
                  className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <CheckCircle size={16} />
                  Accept all
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manage Options Modal */}
      <AnimatePresence>
        {showManageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Cookie Preferences
                </h3>
                <button
                  onClick={() => setShowManageModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Necessary Cookies */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Necessary</h4>
                    <p className="text-sm text-gray-600">Required for the website to function</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.necessary}
                      disabled
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Analytics</h4>
                    <p className="text-sm text-gray-600">Help us understand how visitors interact</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Marketing</h4>
                    <p className="text-sm text-gray-600">Used to deliver personalized ads</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Personalization Cookies */}
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Personalization</h4>
                    <p className="text-sm text-gray-600">Remember your preferences and settings</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.personalization}
                      onChange={(e) => setPreferences(prev => ({ ...prev, personalization: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowManageModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save preferences
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 