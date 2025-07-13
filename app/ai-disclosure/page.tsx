export default function AIDisclosurePage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Disclosure</h1>
          <p className="text-xl text-gray-600">
            Transparency about our artificial intelligence technology
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our AI Technology</h2>
            <p className="text-gray-700 mb-4">
              NextKStar uses advanced artificial intelligence and machine learning algorithms to provide beauty analysis services. This disclosure explains how our AI works, what data it uses, and how we ensure transparency and fairness.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How Our AI Works</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Facial Analysis</h3>
                <p className="text-gray-700">
                  Our AI system analyzes facial features including symmetry, proportions, skin clarity, and facial structure using computer vision algorithms trained on diverse datasets.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Beauty Scoring</h3>
                <p className="text-gray-700">
                  Beauty scores are calculated using machine learning models that consider multiple factors including facial harmony, feature balance, and aesthetic proportions.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Celebrity Matching</h3>
                <p className="text-gray-700">
                  Our AI compares facial features against a database of celebrity images using similarity algorithms to find the closest matches based on facial characteristics.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data and Training</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>Training Data:</strong> Our AI models are trained on diverse datasets that include faces from various ethnicities, ages, and cultural backgrounds to ensure fair and unbiased analysis.
              </p>
              <p className="text-gray-700">
                <strong>Continuous Learning:</strong> Our models are regularly updated and refined to improve accuracy and reduce bias, though we acknowledge that AI systems may still reflect societal biases present in training data.
              </p>
              <p className="text-gray-700">
                <strong>User Data:</strong> Photos uploaded for analysis are processed temporarily and are not used to retrain our models without explicit consent.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Bias and Fairness</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>Acknowledgment of Bias:</strong> We recognize that AI systems can inherit and amplify societal biases. Our cultural bias analysis feature is designed to help users understand how beauty standards vary across cultures.
              </p>
              <p className="text-gray-700">
                <strong>Diversity Efforts:</strong> We actively work to ensure our training data represents diverse populations and regularly audit our systems for bias.
              </p>
              <p className="text-gray-700">
                <strong>Transparency:</strong> We believe in being transparent about our AI's limitations and potential biases, which is why we provide this disclosure and cultural context in our analysis.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Accuracy and Limitations</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>Subjective Nature:</strong> Beauty is inherently subjective and varies across cultures and individuals. Our AI provides one perspective among many.
              </p>
              <p className="text-gray-700">
                <strong>Photo Quality:</strong> Analysis accuracy depends on photo quality, lighting, angle, and other factors. Results may vary significantly based on these conditions.
              </p>
              <p className="text-gray-700">
                <strong>Not Definitive:</strong> Our analysis should not be considered definitive or used for important life decisions. It is intended for entertainment and self-discovery purposes.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy and Security</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>Data Processing:</strong> Photos are processed securely using encrypted connections and are automatically deleted after analysis unless you choose to save them.
              </p>
              <p className="text-gray-700">
                <strong>No Permanent Storage:</strong> We do not permanently store your photos without explicit consent. Analysis results may be stored temporarily to improve service quality.
              </p>
              <p className="text-gray-700">
                <strong>Third-Party Access:</strong> We do not share your photos or analysis results with third parties without your permission.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Control and Rights</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>Consent:</strong> You have full control over your data and can choose whether to use our service and what information to share.
              </p>
              <p className="text-gray-700">
                <strong>Deletion:</strong> You can request deletion of your account and associated data at any time.
              </p>
              <p className="text-gray-700">
                <strong>Opt-out:</strong> You can choose not to save analysis results or create an account while still using basic analysis features.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ongoing Improvements</h2>
            <p className="text-gray-700 mb-4">
              We are committed to continuously improving our AI systems to be more accurate, fair, and transparent. We regularly:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Update our training data to be more diverse and representative</li>
              <li>Audit our systems for bias and fairness</li>
              <li>Improve our algorithms based on user feedback</li>
              <li>Enhance our transparency and disclosure practices</li>
              <li>Research and implement new techniques to reduce bias</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact and Questions</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about our AI technology, how it works, or our approach to fairness and transparency, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>AI Ethics Team:</strong> ai-ethics@nextkstar.com<br />
                <strong>General Support:</strong> support@nextkstar.com<br />
                <strong>Privacy Concerns:</strong> privacy@nextkstar.com
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 text-center space-y-4">
          <p className="text-gray-600">
            This disclosure is updated regularly to reflect our current AI practices and commitments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/privacy"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="inline-block border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-all"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 