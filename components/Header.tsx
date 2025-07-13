'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Menu, X } from 'lucide-react'

interface HeaderProps {
  onSignUp: () => void
}

export default function Header({ onSignUp }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass-effect shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 beauty-gradient rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">
              AI Face Revolution
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-beauty-500 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-beauty-500 transition-colors">
              How It Works
            </a>
            <a href="#research" className="text-gray-700 hover:text-beauty-500 transition-colors">
              Research
            </a>
            <a href="#about" className="text-gray-700 hover:text-beauty-500 transition-colors">
              About
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-700 hover:text-beauty-500 transition-colors">
              Sign In
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSignUp}
              className="beauty-gradient text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t border-gray-200"
          >
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-700 hover:text-beauty-500 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-beauty-500 transition-colors">
                How It Works
              </a>
              <a href="#research" className="text-gray-700 hover:text-beauty-500 transition-colors">
                Research
              </a>
              <a href="#about" className="text-gray-700 hover:text-beauty-500 transition-colors">
                About
              </a>
              <div className="pt-4 space-y-2">
                <button className="w-full text-left text-gray-700 hover:text-beauty-500 transition-colors">
                  Sign In
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onSignUp}
                  className="w-full beauty-gradient text-white px-6 py-2 rounded-full font-medium shadow-lg"
                >
                  Get Started
                </motion.button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
} 