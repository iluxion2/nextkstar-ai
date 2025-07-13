import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ConsentWrapper from './components/ConsentWrapper'
import Footer from './components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Face Analysis - Beauty Score & Celebrity Matches',
  description: 'Discover your beauty score, celebrity matches, and cultural bias insights through our revolutionary AI technology.',
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