'use client'

import Link from 'next/link'
import { Instagram, Mail, Shield, Lock } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src="/images/black.png" 
                alt="KStar" 
                className="w-12 h-12"
              />
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Discover your beauty score, celebrity matches, and cultural bias insights through our revolutionary AI technology.
            </p>
            
            {/* Social Media - Instagram Only */}
            <div className="flex space-x-4 mb-6">
              <a 
                href="https://instagram.com/nextkstar" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal & Privacy</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/ai-disclosure" className="text-gray-300 hover:text-white transition-colors">
                  AI Disclosure
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-300 hover:text-white transition-colors">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Compliance Badges */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <div className="flex items-center space-x-2 text-green-400">
                <Shield size={20} />
                <span className="text-sm font-medium">GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-400">
                <Lock size={20} />
                <span className="text-sm font-medium">SSL Secure</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-400">
              <Mail size={16} />
              <a 
                href="mailto:team@nextkstar.com" 
                className="text-sm hover:text-white transition-colors"
              >
                team@nextkstar.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="text-center text-gray-400 text-sm">
            © {currentYear} KStar. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
} 