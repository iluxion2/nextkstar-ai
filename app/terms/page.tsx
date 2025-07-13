export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using NextKStar ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              NextKStar provides AI-powered beauty analysis services, including facial feature analysis, beauty scoring, celebrity matching, and cultural bias analysis. Our service uses advanced machine learning algorithms to provide insights about facial characteristics and aesthetic features.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>Age Requirement:</strong> You must be at least 18 years old to use our service. Users under 18 are not permitted to upload photos or use our analysis features.
              </p>
              <p className="text-gray-700">
                <strong>Photo Content:</strong> You may only upload photos of yourself or photos for which you have explicit permission to use. Do not upload photos of children, celebrities without permission, or any content that violates others' privacy rights.
              </p>
              <p className="text-gray-700">
                <strong>Appropriate Use:</strong> You agree to use our service for lawful purposes only and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the service.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Privacy and Data Protection</h2>
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices regarding the collection and use of your personal information.
            </p>
            <p className="text-gray-700">
              We implement industry-standard security measures to protect your data, including SSL encryption and secure data processing protocols.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. AI Analysis Disclaimer</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>Accuracy:</strong> While our AI technology is advanced, beauty analysis results are subjective and should not be considered definitive. Results may vary based on photo quality, lighting, and other factors.
              </p>
              <p className="text-gray-700">
                <strong>Cultural Bias:</strong> Our system acknowledges that beauty standards vary across cultures. Our cultural bias analysis is provided for educational purposes and should not be used to make definitive judgments about beauty.
              </p>
              <p className="text-gray-700">
                <strong>Not Medical Advice:</strong> Our service is for entertainment and self-discovery purposes only. It is not intended to provide medical, psychological, or professional advice.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              The Service and its original content, features, and functionality are and will remain the exclusive property of NextKStar and its licensors. The Service is protected by copyright, trademark, and other laws.
            </p>
            <p className="text-gray-700">
              You retain ownership of any photos you upload, but you grant us a limited license to process your images for analysis purposes only.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              In no event shall NextKStar, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Service Availability</h2>
            <p className="text-gray-700 mb-4">
              We strive to maintain the Service's availability, but we do not guarantee that the Service will be available at all times. We may suspend or discontinue the Service at any time without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These Terms shall be interpreted and governed by the laws of the United States, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> legal@nextkstar.com<br />
                <strong>Address:</strong> NextKStar Inc., 123 AI Boulevard, Tech City, TC 12345, United States
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 text-center">
          <a
            href="/privacy"
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            View Privacy Policy
          </a>
        </div>
      </div>
    </div>
  )
} 