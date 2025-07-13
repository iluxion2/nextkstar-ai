'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookie Policy</h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar technologies to provide, protect, and improve our services. 
              This policy explains how we use cookies and your choices regarding them.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Types of Cookies We Use</h3>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Necessary Cookies</h4>
                <p className="text-gray-700 text-sm">
                  These cookies are essential for the website to function properly. They cannot be disabled 
                  and are necessary for basic site functionality, security, and accessibility.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Analytics Cookies</h4>
                <p className="text-gray-700 text-sm">
                  These cookies help us understand how visitors interact with our website by collecting 
                  and reporting information anonymously. This helps us improve our services.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Marketing Cookies</h4>
                <p className="text-gray-700 text-sm">
                  These cookies are used to deliver personalized advertisements based on your interests 
                  and browsing behavior. They may be set by us or our advertising partners.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Personalization Cookies</h4>
                <p className="text-gray-700 text-sm">
                  These cookies remember your preferences and settings to provide a personalized experience 
                  when you visit our website.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">How to Manage Cookies</h3>
            <p className="text-gray-700 mb-4">
              You can manage your cookie preferences at any time by clicking the "Manage options" button 
              in our consent banner. You can also:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Use your browser settings to block or delete cookies</li>
              <li>Use browser extensions to manage cookies</li>
              <li>Contact us if you have questions about our cookie usage</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Collection and Use</h3>
            <p className="text-gray-700 mb-4">
              When you use our AI face analysis service, we may collect:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Images you upload for analysis (processed temporarily and not stored permanently)</li>
              <li>Analysis results and scores</li>
              <li>Usage data and preferences</li>
              <li>Technical information about your device and browser</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Third-Party Services</h3>
            <p className="text-gray-700 mb-4">
              We use the following third-party services that may set their own cookies:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Google AdSense for advertising</li>
              <li>Google Analytics for website analytics</li>
              <li>Google Tag Manager for tag management</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Your Rights</h3>
            <p className="text-gray-700 mb-4">
              Under GDPR and other privacy laws, you have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for data processing</li>
              <li>Object to data processing</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h3>
            <p className="text-gray-700">
              If you have any questions about this privacy policy or our cookie usage, please contact us at:
            </p>
            <p className="text-blue-600 mt-2">
              privacy@nextkstar.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
} 