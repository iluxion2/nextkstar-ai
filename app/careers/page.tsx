export default function CareersPage() {
  const jobListings = [
    {
      id: 1,
      title: "Senior AI/ML Engineer",
      department: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time",
      description: "Join our AI team to develop cutting-edge facial analysis algorithms and improve our beauty scoring system.",
      requirements: [
        "5+ years experience in machine learning and computer vision",
        "Expertise in Python, TensorFlow, and PyTorch",
        "Experience with facial recognition and analysis",
        "Strong background in deep learning and neural networks"
      ]
    },
    {
      id: 2,
      title: "Frontend Developer (React/Next.js)",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Build beautiful, responsive user interfaces for our AI beauty analysis platform.",
      requirements: [
        "3+ years experience with React and Next.js",
        "Strong TypeScript skills",
        "Experience with Tailwind CSS and modern UI frameworks",
        "Understanding of web performance and accessibility"
      ]
    },
    {
      id: 3,
      title: "Social Media Manager",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description: "Lead our social media strategy and create engaging content that showcases our AI beauty analysis platform.",
      requirements: [
        "3+ years experience in social media marketing",
        "Experience with Instagram, TikTok, YouTube, and Twitter",
        "Strong content creation and copywriting skills",
        "Understanding of beauty and tech industry trends"
      ]
    },
    {
      id: 4,
      title: "Content Creator & Influencer Relations",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description: "Create viral content and build relationships with beauty influencers and content creators.",
      requirements: [
        "2+ years experience in content creation or influencer marketing",
        "Strong understanding of beauty and K-pop culture",
        "Experience with video editing and social media platforms",
        "Excellent communication and relationship-building skills"
      ]
    },
    {
      id: 5,
      title: "Product Manager",
      department: "Product",
      location: "San Francisco",
      type: "Full-time",
      description: "Lead product strategy and development for our AI beauty analysis platform.",
      requirements: [
        "5+ years in product management",
        "Experience with AI/ML products",
        "Strong analytical and user research skills",
        "Excellent communication and leadership abilities"
      ]
    },
    {
      id: 6,
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      description: "Create intuitive and beautiful user experiences for our AI-powered beauty platform.",
      requirements: [
        "3+ years in UX/UI design",
        "Experience with Figma and design systems",
        "Understanding of user research and testing",
        "Portfolio showcasing mobile and web applications"
      ]
    },
    {
      id: 7,
      title: "Data Scientist",
      department: "Data Science",
      location: "Remote",
      type: "Full-time",
      description: "Analyze user data and improve our AI models for better beauty analysis accuracy.",
      requirements: [
        "3+ years in data science or analytics",
        "Experience with Python, SQL, and statistical analysis",
        "Knowledge of machine learning and A/B testing",
        "Experience with big data technologies"
      ]
    },
    {
      id: 8,
      title: "Software Engineering Intern",
      department: "Engineering",
      location: "Remote / San Francisco",
      type: "Internship",
      description: "Gain hands-on experience building features for our AI beauty analysis platform.",
      requirements: [
        "Currently pursuing Computer Science or related degree",
        "Basic knowledge of React, Python, or machine learning",
        "Strong problem-solving and learning abilities",
        "Passion for AI and beauty technology"
      ]
    },
    {
      id: 9,
      title: "Marketing & Social Media Intern",
      department: "Marketing",
      location: "Remote",
      type: "Internship",
      description: "Learn social media marketing and content creation in the beauty tech industry.",
      requirements: [
        "Currently pursuing Marketing, Communications, or related degree",
        "Active on social media platforms (Instagram, TikTok, YouTube)",
        "Creative mindset and strong writing skills",
        "Interest in beauty, K-pop, and AI technology"
      ]
    },
    {
      id: 10,
      title: "Data Science Intern",
      department: "Data Science",
      location: "Remote",
      type: "Internship",
      description: "Work with real data to improve our AI models and analysis algorithms.",
      requirements: [
        "Currently pursuing Data Science, Statistics, or related degree",
        "Basic knowledge of Python and machine learning",
        "Strong analytical and mathematical skills",
        "Interest in facial analysis and beauty AI"
      ]
    },
    {
      id: 11,
      title: "UI/UX Design Intern",
      department: "Design",
      location: "Remote",
      type: "Internship",
      description: "Create beautiful user interfaces and improve user experience for our platform.",
      requirements: [
        "Currently pursuing Design, HCI, or related degree",
        "Basic knowledge of Figma or similar design tools",
        "Strong visual design and user empathy skills",
        "Portfolio of design projects (even class projects)"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Team</h1>
          <p className="text-xl text-gray-600 mb-8">
            Help us revolutionize beauty analysis with AI technology
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span>🌍 Remote-first culture</span>
            <span>💡 Innovative AI technology</span>
            <span>🎯 Mission-driven team</span>
            <span>📈 Rapid growth opportunities</span>
          </div>
        </div>

        {/* Company Culture */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">Our Culture</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation First</h3>
              <p className="text-gray-600">
                We push the boundaries of AI technology to create meaningful experiences 
                that celebrate human diversity and beauty.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaborative Team</h3>
              <p className="text-gray-600">
                Work with talented individuals from diverse backgrounds who share a passion 
                for technology and making a positive impact.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Continuous Growth</h3>
              <p className="text-gray-600">
                We invest in your development with learning opportunities, mentorship, 
                and career advancement paths.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16 bg-gray-50 rounded-2xl p-8">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">Benefits & Perks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Health & Wellness</h4>
              <p className="text-gray-600 text-sm">Comprehensive health insurance, mental health support, and wellness programs</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Flexible Work</h4>
              <p className="text-gray-600 text-sm">Remote-first culture with flexible hours and unlimited PTO</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Learning & Development</h4>
              <p className="text-gray-600 text-sm">Conference budgets, online courses, and mentorship programs</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Team Events</h4>
              <p className="text-gray-600 text-sm">Regular team building, hackathons, and social events</p>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">Open Positions</h2>
          
          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button className="px-4 py-2 rounded-full bg-purple-600 text-white font-semibold">
              All Positions
            </button>
            <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300">
              Full-time
            </button>
            <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300">
              Internships
            </button>
            <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300">
              Social Media
            </button>
          </div>

          <div className="space-y-6">
            {jobListings.map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>{job.department}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span className={`px-2 py-1 rounded-full ${
                        job.type === 'Internship' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <button className="mt-4 md:mt-0 bg-[#1da1f2] hover:bg-[#1991da] text-white px-6 py-2 rounded-lg font-semibold transition-all">
                    Apply Now
                  </button>
                </div>
                <p className="text-gray-700 mb-4">{job.description}</p>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Internship Highlight */}
        <div className="mb-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6 text-center">Internship Program</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Intern With Us?</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Work on real AI projects that impact millions of users</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Mentorship from industry experts in AI and beauty tech</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Flexible remote work with competitive stipend</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Potential for full-time offers after graduation</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Program Details</h3>
              <div className="space-y-3 text-gray-700">
                <p><strong>Duration:</strong> 3-6 months (flexible)</p>
                <p><strong>Start Date:</strong> Rolling applications</p>
                <p><strong>Location:</strong> Remote (US-based preferred)</p>
                <p><strong>Stipend:</strong> Competitive monthly compensation</p>
                <p><strong>Perks:</strong> Free beauty analysis credits, team events, learning resources</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Don't see the right fit?</h2>
          <p className="text-gray-600 mb-6">
            We're always looking for talented individuals to join our team. 
            Send us your resume and let's discuss how you can contribute to our mission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Contact Us
            </a>
            <a
                              href="mailto:team@nextkstar.com"
              className="inline-block border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-all"
            >
              Send Resume
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 