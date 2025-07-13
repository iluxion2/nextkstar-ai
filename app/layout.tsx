import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ConsentWrapper from './components/ConsentWrapper'
import Footer from './components/Footer'
import StructuredData from './components/StructuredData'
import GoogleAnalytics from './components/GoogleAnalytics'
import GoogleSearchConsole from './components/GoogleSearchConsole'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://nextkstar.com'),
  title: 'KStar - AI Face Analysis & Beauty Score | Celebrity Matches',
  description: 'Get your AI beauty score, find celebrity lookalikes, and explore beauty bias insights. Free face analysis with celebrity matching technology.',
  keywords: 'how hot am i, attractiveness test, beauty score, celebrity lookalike, k-beauty, kpop, BTS, BLACKPINK, Jennie, boyfriend, girlfriend, AI face analysis, face recognition, beauty calculator, kstar, nextkstar, beauty AI, face beauty test, celebrity lookalike finder, hot or not, am i attractive, beauty rating, korean beauty, k-pop idols, BTS members, BLACKPINK members, relationship advice, dating tips',
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
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
        <GoogleAnalytics />
        <GoogleSearchConsole />
      </head>
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