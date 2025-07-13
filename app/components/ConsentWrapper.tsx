'use client'

import { useState, useEffect } from 'react'
import ConsentBanner from './ConsentBanner'
import GoogleTagManager from './GoogleTagManager'

interface ConsentWrapperProps {
  children: React.ReactNode
}

export default function ConsentWrapper({ children }: ConsentWrapperProps) {
  const [consentGranted, setConsentGranted] = useState(false)
  const [gtmId] = useState('GTM-XXXXXXX') // Replace with your actual GTM ID

  useEffect(() => {
    // Check for existing consent
    const consentChoice = localStorage.getItem('consent-choice')
    if (consentChoice) {
      const preferences = JSON.parse(localStorage.getItem('consent-preferences') || '{}')
      const hasMarketingConsent = preferences.marketing || preferences.personalization
      setConsentGranted(hasMarketingConsent)
    }
  }, [])

  const handleConsent = (consent: boolean) => {
    setConsentGranted(consent)
    
    // You can add additional logic here, such as:
    // - Sending consent data to your analytics
    // - Updating other tracking scripts
    // - Logging consent changes
  }

  const handleManageOptions = () => {
    // This will be handled by the ConsentBanner component
    // You can add additional logic here if needed
  }

  return (
    <>
      <GoogleTagManager gtmId={gtmId} consentGranted={consentGranted} />
      {children}
      <ConsentBanner onConsent={handleConsent} onManageOptions={handleManageOptions} />
    </>
  )
} 