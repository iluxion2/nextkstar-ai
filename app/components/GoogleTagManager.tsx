'use client'

import Script from 'next/script'
import { useEffect } from 'react'

interface GoogleTagManagerProps {
  gtmId: string
  consentGranted: boolean
}

export default function GoogleTagManager({ gtmId, consentGranted }: GoogleTagManagerProps) {
  useEffect(() => {
    // Initialize consent state for Google Tag Manager
    if (typeof window !== 'undefined') {
      // Set default consent state
      (window as any).gtag = (window as any).gtag || function() {
        (window as any).dataLayer = (window as any).dataLayer || []
        ;(window as any).dataLayer.push(arguments)
      }
      
      // Initialize with denied consent by default
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({
        'consent': 'default',
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'personalization_storage': 'denied',
        'functionality_storage': 'denied',
        'security_storage': 'granted' // Always granted for security
      })
      
      // Update consent based on user choice
      if (consentGranted) {
        const preferences = JSON.parse(localStorage.getItem('consent-preferences') || '{}')
        ;(window as any).dataLayer.push({
          'consent': 'update',
          'analytics_storage': preferences.analytics ? 'granted' : 'denied',
          'ad_storage': preferences.marketing ? 'granted' : 'denied',
          'personalization_storage': preferences.personalization ? 'granted' : 'denied',
          'functionality_storage': preferences.necessary ? 'granted' : 'denied'
        })
      }
    }
  }, [consentGranted])

  return (
    <>
      {/* Google Tag Manager */}
      <Script
        id="gtm"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `,
        }}
      />
      
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
      
      {/* Google AdSense - Only load if consent is granted */}
      {consentGranted && (
        <Script
          data-ad-client="ca-pub-3958504506139862"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          strategy="afterInteractive"
        />
      )}
    </>
  )
} 