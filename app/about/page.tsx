export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About NextKStar</h1>
          <p className="text-xl text-gray-600">
            Revolutionizing beauty analysis with AI technology
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              At NextKStar, we believe that beauty is diverse, subjective, and deeply personal. 
              Our mission is to provide users with insightful, AI-powered beauty analysis that 
              celebrates individuality while offering objective insights into facial features 
              and aesthetic characteristics.
            </p>
            <p className="text-gray-700">
              We combine cutting-edge artificial intelligence with cultural sensitivity to 
              deliver beauty scores, celebrity matches, and cultural bias analysis that 
              respects and celebrates the diversity of human beauty across different cultures 
              and standards.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">What We Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Beauty Analysis</h3>
                <p className="text-gray-600">
                  Advanced AI algorithms analyze facial features, symmetry, and proportions 
                  to provide comprehensive beauty insights.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Celebrity Matches</h3>
                <p className="text-gray-600">
                  Find your celebrity lookalikes and discover which famous faces share 
                  similar features with you.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Cultural Insights</h3>
                <p className="text-gray-600">
                  Understand how beauty standards vary across cultures and get insights 
                  into different aesthetic preferences.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Our Technology</h2>
            <p className="text-gray-700 mb-4">
              NextKStar leverages state-of-the-art deep learning models and computer vision 
              technology to provide accurate and insightful beauty analysis. Our AI systems 
              are trained on diverse datasets to ensure fair and unbiased results across 
              different ethnicities, ages, and cultural backgrounds.
            </p>
            <p className="text-gray-700">
              We prioritize user privacy and data security, ensuring that all uploaded images 
              are processed securely and never stored permanently without explicit consent.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Diversity & Inclusion</h3>
                <p className="text-gray-600">
                  We celebrate beauty in all its forms and work to ensure our technology 
                  recognizes and respects the diversity of human appearance.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Privacy & Security</h3>
                <p className="text-gray-600">
                  Your privacy is paramount. We implement robust security measures and 
                  transparent data practices to protect your information.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Innovation</h3>
                <p className="text-gray-600">
                  We continuously improve our AI technology to provide more accurate, 
                  insightful, and culturally sensitive beauty analysis.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">User Experience</h3>
                <p className="text-gray-600">
                  We design our platform to be intuitive, engaging, and accessible to 
                  users from all backgrounds and technical levels.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Get Started</h2>
            <p className="text-gray-700 mb-6">
              Ready to discover your beauty insights? Upload a photo and let our AI 
              technology provide you with detailed analysis, celebrity matches, and 
              cultural beauty perspectives.
            </p>
            <a
              href="/analysis"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Start Your Analysis
            </a>
          </section>
        </div>
      </div>
    </div>
  )
} 