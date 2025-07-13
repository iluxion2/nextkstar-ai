'use client'

import { useState, useEffect } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'
import { getTranslation } from '../utils/translations'
import LanguageSelector from '../components/LanguageSelector'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'en'
    }
    return 'en'
  })

  // Save language to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language)
    }
  }, [language])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{getTranslation('Contact Us', language)}</h1>
          <p className="text-xl text-gray-600">
            {getTranslation("Get in touch with our team. We'd love to hear from you!", language)}
          </p>
          <div className="flex justify-center mt-4">
            <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{getTranslation('Get in Touch', language)}</h2>
            <p className="text-gray-600 mb-8">
              {getTranslation("Have questions about our AI beauty analysis service? Need technical support? Want to provide feedback? We're here to help!", language)}
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{getTranslation('Email', language)}</h3>
                  <p className="text-gray-600">team@nextkstar.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{getTranslation('Phone', language)}</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-500">{getTranslation('Mon-Fri 9AM-6PM EST', language)}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{getTranslation('Address', language)}</h3>
                  <p className="text-gray-600">
                    NextKStar Inc.<br />
                    123 AI Boulevard<br />
                    Tech City, TC 12345<br />
                    United States
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">{getTranslation('Response Time', language)}</h3>
              <p className="text-gray-600 text-sm">
                {getTranslation('We typically respond to inquiries within 24 hours during business days. For urgent technical issues, please include "URGENT" in your subject line.', language)}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{getTranslation('Send us a Message', language)}</h2>
            {isSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-900 mb-2">{getTranslation('Message Sent!', language)}</h3>
                <p className="text-green-700">
                  {getTranslation("Thank you for contacting us. We'll get back to you soon!", language)}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    {getTranslation('Name', language)} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={getTranslation('Your full name', language)}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {getTranslation('Email', language)} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={getTranslation('your.email@example.com', language)}
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    {getTranslation('Subject', language)} *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">{getTranslation('Select a subject', language)}</option>
                    <option value="general">{getTranslation('General Inquiry', language)}</option>
                    <option value="technical">{getTranslation('Technical Support', language)}</option>
                    <option value="feedback">{getTranslation('Feedback', language)}</option>
                    <option value="business">{getTranslation('Business Partnership', language)}</option>
                    <option value="privacy">{getTranslation('Privacy Concerns', language)}</option>
                    <option value="other">{getTranslation('Other', language)}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {getTranslation('Message', language)} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={getTranslation('Tell us how we can help you...', language)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{getTranslation('Sending...', language)}</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>{getTranslation('Send Message', language)}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{getTranslation('Quick Answers', language)}</h2>
          <p className="text-gray-600 mb-6">
            {getTranslation('Check our FAQ for quick answers to common questions', language)}
          </p>
          <a
            href="/faq"
            className="inline-block border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-all"
          >
            {getTranslation('View FAQ', language)}
          </a>
        </div>
      </div>
    </div>
  )
} 