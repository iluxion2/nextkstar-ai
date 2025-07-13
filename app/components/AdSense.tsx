'use client'

import { useEffect } from 'react'

interface AdSenseProps {
  adSlot: string
  adFormat?: 'auto' | 'fluid'
  style?: React.CSSProperties
  className?: string
}

export default function AdSense({ adSlot, adFormat = 'auto', style, className }: AdSenseProps) {
  useEffect(() => {
    try {
      // @ts-ignore - adsbygoogle is added by the AdSense script
      if (window.adsbygoogle) {
        // @ts-ignore
        window.adsbygoogle.push({})
      }
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [])

  return (
    <div className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3958504506139862"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  )
} 