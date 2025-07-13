import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ConsentWrapper from './components/ConsentWrapper'
import Footer from './components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://nextkstar.com'),
  title: 'KStar - AI Face Analysis & Beauty Score | Celebrity Matches',
  description: 'Get your AI beauty score, find celebrity lookalikes, and explore beauty bias insights. Free face analysis with celebrity matching technology.',
  keywords: 'AI face analysis, beauty score, celebrity matches, face recognition, beauty calculator, kstar, nextkstar, beauty AI, face beauty test, celebrity lookalike finder',
  authors: [{ name: 'KStar Team' }],
  creator: 'KStar',
  publisher: 'KStar',
  robots: 'index, follow',
  openGraph: {
    title: 'KStar - AI Face Analysis & Beauty Score',
    description: 'Get your AI beauty score, find celebrity lookalikes, and explore beauty bias insights.',
    url: 'https://nextkstar.com',
    siteName: 'KStar',
    images: [
      {
        url: '/images/favicon.fav.png',
        width: 1200,
        height: 630,
        alt: 'KStar AI Face Analysis',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KStar - AI Face Analysis & Beauty Score',
    description: 'Get your AI beauty score, find celebrity lookalikes, and explore beauty bias insights.',
    images: ['/images/favicon.fav.png'],
  },
  icons: {
    icon: '/images/favicon.fav.png',
    shortcut: '/images/favicon.fav.png',
    apple: '/images/favicon.fav.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConsentWrapper>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">
        {children}
            </main>
            <Footer />
          </div>
        </ConsentWrapper>
      </body>
    </html>
  )
} 