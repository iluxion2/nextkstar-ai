'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  Camera, 
  Brain, 
  Sparkles, 
  Star, 
  Share2, 
  Download,
  Eye,
  TrendingUp,
  Heart,
  Target,
  Zap,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Trophy,
  User,
  LogIn,
  X
} from 'lucide-react'
import Image from 'next/image'
// Removed import - using public path instead
import { useDropzone } from 'react-dropzone'
import Webcam from 'react-webcam'
import toast from 'react-hot-toast'
import Confetti from 'react-confetti'
import AnalysisResults from '../components/AnalysisResults'
import BiasAnalysis from '../components/BiasAnalysis'
import CelebrityMatch from '../components/CelebrityMatch'
import Leaderboard from '../components/Leaderboard'
import LanguageSelector from '../components/LanguageSelector'
import AdSense from '../components/AdSense'
import { getTranslation } from '../utils/translations'
import { useRouter } from 'next/navigation'
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { db } from "../firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
import API_ENDPOINTS from '../config/api'

interface AnalysisResult {
  beautyScore: number
  facialFeatures: {
    symmetry: number
    skinClarity: number
    proportions: number
    expression: number
  }
  personalityTraits: {
    confidence: number
    friendliness: number
    intelligence: number
    attractiveness: number
  }
  biasAnalysis: {
    korean: number
    western: number
    global: number
    anime: number
  }
  celebrityMatches: Array<{
    name: string
    image: string
    similarity: number
    category: string
  }>
  age?: number; // Added for new cards
}

export default function AnalysisPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState('')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [showWebcam, setShowWebcam] = useState(false)
  const [language, setLanguage] = useState('en')
  const [showConfetti, setShowConfetti] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [faceDetectionError, setFaceDetectionError] = useState<string | null>(null)
  const webcamRef = useRef<Webcam>(null)
  const router = useRouter();
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Helper to check if user is a real (non-anonymous) user
  const isRealUser = user && user.providerData && user.providerData.length > 0;

  // Remove all anonymous auth logic. Only set user when signed up/logged in.
  // Optionally, you can add a useEffect to listen for auth state changes (for sign in/out):
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 2500)
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false
  })

  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      if (imageSrc) {
        setSelectedImage(imageSrc)
        setShowWebcam(false)
      }
    }
  }

  const analyzeImage = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    setShowConfetti(false)
    setFaceDetectionError(null)
    setAnalysisProgress('Starting analysis...')

    try {
      // Convert base64 to blob
      setAnalysisProgress('Processing image...')
      const base64Response = await fetch(selectedImage)
      const blob = await base64Response.blob()

      const formData = new FormData()
      formData.append('file', blob, 'image.jpg')

      setAnalysisProgress('Analyzing facial features...')
      const response = await fetch(API_ENDPOINTS.ANALYZE, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.detail && typeof errorData.detail === 'string') {
          // Handle face detection errors with funny messages
          const funnyMessages = [
            "Are you sure this is human? I'm seeing more of a potato than a person! 🥔",
            "Hmm... I think you uploaded a picture of your pet rock instead! 🪨",
            "This looks like abstract art to me! Where's the human? 🎨",
            "I'm not seeing any humans here... Are you an alien? 👽",
            "This might be a beautiful landscape, but I need a face to analyze! 🌄",
            "Did you accidentally upload a picture of your lunch? I need a face! 🍕",
            "I think you uploaded a screenshot of your wallpaper! Show me a person! 🖼️",
            "This looks like a painting! I need a real human face! 🎭",
            "Are you trying to trick me with a cartoon? I need a real person! 🎪",
            "I'm pretty sure this is a meme, not a human face! 😅"
          ]
          const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)]
          setFaceDetectionError(randomMessage)
          toast.error(randomMessage)
          return
        }
        throw new Error('Analysis failed')
      }

      const result = await response.json()
      
      // Transform backend response to match frontend expected format
      const transformedResult: AnalysisResult = {
        beautyScore: result.analysis.beauty_score,
        facialFeatures: result.analysis.facial_features || {
          symmetry: 85,
          skinClarity: Math.min(95, result.analysis.beauty_score * 10),
          proportions: Math.min(90, result.analysis.beauty_score * 9),
          expression: Math.min(88, result.analysis.beauty_score * 8.8)
        },
        personalityTraits: {
          confidence: Math.min(92, result.analysis.beauty_score * 9.2),
          friendliness: Math.min(95, result.analysis.beauty_score * 9.5),
          intelligence: Math.min(90, result.analysis.beauty_score * 9),
          attractiveness: Math.min(95, result.analysis.beauty_score * 9.5)
        },
        biasAnalysis: {
          korean: Math.min(85, result.analysis.beauty_score * 8.5),
          western: Math.min(80, result.analysis.beauty_score * 8),
          global: Math.min(88, result.analysis.beauty_score * 8.8),
          anime: Math.min(75, result.analysis.beauty_score * 7.5)
        },
        celebrityMatches: result.lookalike.name !== "Unknown" ? [{
          name: result.lookalike.name,
          image: result.lookalike.image,
          similarity: result.lookalike.similarity,
          category: result.lookalike.info.group || "Celebrity"
        }] : [],
        age: result.analysis.age
      }
      
      setAnalysisProgress('Finding celebrity matches...')
      
      setAnalysisResult(transformedResult)
      setShowConfetti(true)
      setAnalysisProgress('')
      
      toast.success(getTranslation('Analysis completed!', language))
    } catch (error) {
      console.error('Analysis error:', error)
      const funnyMessages = [
        "Oops! Something went wrong! Maybe try uploading a clearer photo? 🤔",
        "Technical difficulties! The AI is having a moment! 😅",
        "Error 404: Human face not found! Try again? 🔍",
        "The AI is confused! Let's try with a different photo! 🤖",
        "Something's not working! Maybe the AI needs coffee? ☕"
      ]
      const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)]
      setFaceDetectionError(randomMessage)
      toast.error(randomMessage)
    } finally {
      setIsAnalyzing(false)
      setAnalysisProgress('')
    }
  }

  const downloadResults = () => {
    if (!analysisResult) return

    const dataStr = JSON.stringify(analysisResult, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'face-analysis-results.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const resetAnalysis = () => {
    setSelectedImage(null)
    setAnalysisResult(null)
    setShowConfetti(false)
    setShowWebcam(false)
    setShowLeaderboard(false)
    setFaceDetectionError(null)
  }

  // Error function approximation for normal distribution
  function erf(x: number) {
    var sign = (x >= 0) ? 1 : -1;
    x = Math.abs(x);
    var a1 =  0.254829592;
    var a2 = -0.284496736;
    var a3 =  1.421413741;
    var a4 = -1.453152027;
    var a5 =  1.061405429;
    var p  =  0.3275911;
    var t = 1.0/(1.0 + p*x);
    var y = 1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-x*x);
    return sign*y;
  }

  if (analysisResult) {
    // Calculate percentile and rank using normal distribution
    const totalPeople = 333271411
    const mean = 5.5
    const std = 1.5
    const z = (analysisResult.beautyScore - mean) / std
    const percentile = Math.round(0.5 * (1 + erf(z / Math.sqrt(2))) * 100)
    const rank = Math.round((1 - percentile / 100) * totalPeople) + 1
    return (
      <div className="min-h-screen bg-white p-4">
        {showConfetti && <Confetti />}
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={resetAnalysis}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>{getTranslation('New Analysis', language)}</span>
            </button>
            <div className="flex items-center space-x-4">
              <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
              
              {/* Auth Buttons */}
              {!isRealUser ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowSignUp(true)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full transition-colors text-white"
                    style={{ backgroundColor: '#ff5a8d' }}
                    onMouseOver={e => (e.currentTarget.style.backgroundColor = '#ffc3bb')}
                    onMouseOut={e => (e.currentTarget.style.backgroundColor = '#ff5a8d')}
                  >
                    {getTranslation('Sign Up', language)}
                  </button>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full font-semibold transition-colors"
                    style={{ color: '#1da1f2', backgroundColor: 'transparent', border: 'none' }}
                    onMouseOver={e => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                    onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {getTranslation('Login', language)}
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Welcome, {user.displayName || user.email}</span>
                  <button
                    onClick={() => auth.signOut()}
                    className="px-4 py-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Uploaded Image */}
          {selectedImage && (
            <div className="flex justify-center mb-8">
              <img
                src={selectedImage}
                alt="Uploaded"
                className="w-80 h-80 object-cover rounded-2xl shadow-lg border-4 border-white"
              />
            </div>
          )}
          
          {/* Beauty Score and Lucas Comment - Above Worldwide Ranking */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-col items-center gap-4">
              {/* Beauty Score */}
              <div className="text-4xl font-bold text-green-600 text-center">
                {Math.round(analysisResult.beautyScore * 10)} <span className="text-lg text-gray-500">/ 100</span>
              </div>
              
              {/* Lucas with Speech Bubble */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Image 
                    src="/images/lucas.png" 
                    alt="Lucas" 
                    width={50}
                    height={50}
                    className="object-cover rounded-full w-14 h-14" 
                    priority
                  />
                </div>
                <div className="relative ml-3 bg-gray-50 rounded-2xl p-3 shadow-sm max-w-xs">
                  <div className="text-sm text-gray-800">
                    {(() => {
                      if (percentile >= 95) {
                        return "OMG! You're literally K-pop idol material! SM, JYP, YG would be fighting to scout you! 🌟✨"
                      } else if (percentile >= 90) {
                        return "WOW! You've got serious star potential! You'd definitely win first place on any audition show! 👑💫"
                      } else if (percentile >= 85) {
                        return "AMAZING! Your visuals are absolutely stunning! You could totally be a K-pop star! 📚✨"
                      } else if (percentile >= 80) {
                        return "INCREDIBLE! You're so pretty, you could be the lead in a Korean drama! 😍"
                      } else if (percentile >= 75) {
                        return "FANTASTIC! Your beauty is next level! You'd fit right into any idol group! 🌸"
                      } else if (percentile >= 70) {
                        return "AWESOME! You're so cute, you'd be super popular in Korea! 💕"
                      } else if (percentile >= 60) {
                        return "GREAT! You're really attractive! Korean style would suit you perfectly! 😊"
                      } else if (percentile >= 50) {
                        return "NICE! You're above average! You'd definitely get recognized in Korea too! 👍"
                      } else if (percentile >= 40) {
                        return "GOOD! You have your own unique charm! Korean skincare could make you even prettier! 💪"
                      } else if (percentile >= 30) {
                        return "KEEP IT UP! With some effort, you can become even more beautiful! Check out Korean beauty YouTube! 🌟"
                      } else if (percentile >= 20) {
                        return "DON'T WORRY! Your heart is beautiful! That's what real beauty is! ❤️"
                      } else {
                        return "IT'S OKAY! You have your own special charm! Love yourself! 💖"
                      }
                    })()}
                  </div>
                  {/* Speech bubble tail */}
                  <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-gray-50"></div>
                </div>
              </div>
            </div>
          </div>
          {/* Worldwide Ranking Card - Above Celebrity Matches */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                Worldwide Ranking
              </h3>
              <div className="flex justify-between items-center mb-3">
                <div className="text-2xl font-bold text-gray-800">
                  {rank.toLocaleString()} <span className="text-lg text-gray-500">/ {totalPeople.toLocaleString()}</span>
                </div>
                <div className="text-lg font-semibold text-green-600">Top {percentile}%</div>
              </div>
              <div className="relative w-full h-6 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full overflow-hidden shadow-inner">
                <div className="absolute inset-0 bg-white opacity-20"></div>
                <div 
                  className="absolute top-0 left-0 h-full bg-black rounded-full shadow-lg transition-all duration-1000 ease-out"
                  style={{ 
                    width: '2px',
                    left: `${Math.max(0, Math.min(100, (rank / totalPeople) * 100))}%`,
                    transform: 'translateX(-50%)'
                  }}
                ></div>
                <div 
                  className="absolute top-0 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black transition-all duration-1000 ease-out"
                  style={{ 
                    left: `${Math.max(0, Math.min(100, (rank / totalPeople) * 100))}%`,
                    transform: 'translateX(-50%)',
                    top: '-8px'
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Cards Section - Celebrity Match, Expected Age & Instagram Followers */}
          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
              {/* Celebrity Match Card */}
              <div className="flex justify-center">
                <CelebrityMatch celebrityMatches={analysisResult.celebrityMatches} language={language} />
              </div>
              {/* Expected Age Card */}
              <div className="bg-white rounded-xl p-4 text-center shadow-lg flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-4">Expected Age</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {typeof analysisResult.age === 'number' ? analysisResult.age : Math.round(20 + (analysisResult.beautyScore-5)*2)}
                </div>
                <div className="text-gray-500 text-sm">AI-estimated age</div>
              </div>
              {/* Instagram Followers Card */}
              <div className="bg-white rounded-xl p-4 text-center shadow-lg">
                <h3 className="text-xl font-bold mb-3">Instagram Followers</h3>
                <div className="text-4xl font-bold text-pink-600 mb-1">
                  {((Math.round(analysisResult.beautyScore*7+Math.random()*3)*1000)/1000).toFixed(1)}K
                </div>
                <div className="text-gray-500 text-sm">Estimated popularity</div>
              </div>
            </div>
          </div>

          {/* Results Grid - Full Width */}
          <div className="space-y-6">
            <AnalysisResults result={analysisResult} language={language} />
            <Leaderboard language={language} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#ffe0ec] relative">
      {/* Overlay Images */}
      <div className="absolute left-7 top-5 z-10">
        <Image 
          src="/images/ok.png" 
          alt="OK" 
          width={250}
          height={250}
          className="object-contain" 
          priority
        />
      </div>
      <div className="absolute left-7 z-10" style={{ top: '415px' }}>
        <Image 
          src="/images/okok.png" 
          alt="IWA" 
          width={250}
          height={250}
          className="object-contain" 
          priority
        />
      </div>
      
      {/* Right side overlay */}
      <div className="absolute right-7 top-5 z-10">
        <Image 
          src="/images/st.png" 
          alt="ST" 
          width={250}
          height={250}
          className="object-contain" 
          priority
        />
      </div>
      <div className="absolute right-7 z-10" style={{ top: '415px' }}>
        <Image 
          src="/images/meme.png" 
          alt="ST" 
          width={250}
          height={250}
          className="object-contain" 
          priority
        />
      </div>
      
      {/* Main Content */}
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Image 
                src="/images/kstar.png" 
                alt="KStar" 
                width={80}
                height={80}
                className="mr-4" 
                priority
              />
              <h1 className="text-3xl font-bold text-gray-800">
                
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
              
              {/* Auth Buttons */}
              {!isRealUser ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowSignUp(true)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full transition-colors text-white"
                    style={{ backgroundColor: '#ff5a8d' }}
                    onMouseOver={e => (e.currentTarget.style.backgroundColor = '#ffc3bb')}
                    onMouseOut={e => (e.currentTarget.style.backgroundColor = '#ff5a8d')}
                  >
                    {getTranslation('Sign Up', language)}
                  </button>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full font-semibold transition-colors"
                    style={{ color: '#1da1f2', backgroundColor: 'transparent', border: 'none' }}
                    onMouseOver={e => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                    onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {getTranslation('Login', language)}
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Welcome, {user.displayName || user.email}</span>
                  <button
                    onClick={() => auth.signOut()}
                    className="px-4 py-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Image 
                  src="/images/lucas.png" 
                  alt="Lucas" 
                  width={80}
                  height={80}
                  className="object-cover"
                  priority
                />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {getTranslation('Upload Your Photo', language)}
              </h2>
              <p className="text-gray-600">
                {getTranslation('Get detailed AI analysis of your facial features, beauty score, and celebrity matches', language)}
              </p>
            </div>

            {/* Upload Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* File Upload */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {getTranslation('Upload Photo', language)}
                </h3>
                <p className="text-gray-500 text-sm">
                  {getTranslation('Drag & drop or click to select', language)}
                </p>
              </div>

              {/* Camera Capture */}
              <div 
                onClick={() => setShowWebcam(true)}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-gray-50 transition-all"
              >
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {getTranslation('Take Photo', language)}
                </h3>
                <p className="text-gray-500 text-sm">
                  {getTranslation('Click to use your camera', language)}
                </p>
              </div>
            </div>

            {/* Selected Image Preview */}
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 text-center"
              >
                <div className="relative inline-block">
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="max-w-xs h-auto rounded-lg shadow-lg"
                  />
                  <button
                    onClick={resetAnalysis}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>{analysisProgress || getTranslation('Analyzing...', language)}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        <span>{getTranslation('Start Analysis', language)}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Funny Error Message */}
            {faceDetectionError && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex items-center justify-center space-x-4"
              >
                {/* Lucas Image */}
                <div className="flex-shrink-0">
                  <Image 
                    src="/images/lucas.png" 
                    alt="Lucas" 
                    width={60}
                    height={60}
                    className="object-cover rounded-full" 
                    priority
                  />
                </div>
                
                {/* Speech Bubble */}
                <div className="relative bg-white rounded-2xl p-4 shadow-lg border-2 border-pink-200 max-w-md">
                  <div className="text-center">
                    <p className="text-gray-800 font-medium text-lg">{faceDetectionError}</p>
                    <p className="text-gray-600 text-sm mt-1">Try uploading a clear photo of a human face!</p>
                  </div>
                  {/* Speech bubble tail pointing to Lucas */}
                  <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-white"></div>
                  <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-pink-200" style={{ left: '-2px' }}></div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-8">
            <div className="bg-white rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="font-semibold mb-1 text-lg">{getTranslation('Beauty Score', language)}</h3>
              <p className="text-gray-600 text-sm mb-2">
                {getTranslation('AI-powered beauty analysis', language)}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Advanced AI algorithms</p>
            </div>

            <div className="bg-white rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="font-semibold mb-1 text-lg">{getTranslation('Facial Features', language)}</h3>
              <p className="text-gray-600 text-sm mb-2">
                {getTranslation('Detailed feature analysis', language)}
              </p>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Symmetry, proportions & more</p>
            </div>

            <div className="bg-white rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="font-semibold mb-1 text-lg">{getTranslation('Celebrity Matches', language)}</h3>
              <div className="grid grid-cols-6 gap-1 mt-2 mb-2">
                <div className="text-center">
                  <img src="/images/v.png" alt="Taehyung" className="w-10 h-10 mx-auto rounded-full object-cover" />
                </div>
                <div className="text-center">
                  <img src="/images/l.png" alt="Lee Jung Jae" className="w-10 h-10 mx-auto rounded-full object-cover" />
                </div>
                <div className="text-center">
                  <img src="/images/li.png" alt="Lisa" className="w-10 h-10 mx-auto rounded-full object-cover" />
                </div>
                <div className="text-center">
                  <img src="/images/cha.png" alt="Cha Eun Woo" className="w-10 h-10 mx-auto rounded-full object-cover" />
                </div>
                <div className="text-center">
                  <img src="/images/r.png" alt="Rose" className="w-10 h-10 mx-auto rounded-full object-cover" />
                </div>
                <div className="text-center">
                  <img src="/images/front.png" alt="Front" className="w-10 h-10 mx-auto rounded-full object-cover" />
                </div>
              </div>
              <p className="text-xs text-gray-500">Find your celebrity twin</p>
            </div>
          </div>

          {/* Leaderboard Button */}
          <div className="flex justify-center mb-8">
            <a
              href="/leaderboard"
              className="inline-flex items-center space-x-2 w-full max-w-md justify-center px-8 py-3 rounded-full font-semibold transition-colors text-white"
              style={{ backgroundColor: '#1da1f2' }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = '#1a8cd8')}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = '#1da1f2')}
            >
              <Trophy size={20} />
              <span>{getTranslation('Check Leaderboard', language)}</span>
            </a>
          </div>


        </div>

        {/* Leaderboard Modal */}
        <AnimatePresence>
          {showLeaderboard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {getTranslation('Global Leaderboard', language)}
                  </h3>
                  <button
                    onClick={() => setShowLeaderboard(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <AlertCircle size={24} />
                  </button>
                </div>
                
                <Leaderboard language={language} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Webcam Modal */}
        <AnimatePresence>
          {showWebcam && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full"
              >
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    {getTranslation('Take a Photo', language)}
                  </h3>
                  <p className="text-gray-600">
                    {getTranslation('Position your face in the frame', language)}
                  </p>
                </div>

                <div className="mb-4">
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full rounded-lg"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowWebcam(false)}
                    className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    {getTranslation('Cancel', language)}
                  </button>
                  <button
                    onClick={capturePhoto}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {getTranslation('Capture', language)}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals */}
        {showSignUp && (<SignUpModal onClose={() => setShowSignUp(false)} onSwitch={() => { setShowSignUp(false); setShowLogin(true); }} />)}
        {showLogin && (<LoginModal onClose={() => setShowLogin(false)} onSwitch={() => { setShowLogin(false); setShowSignUp(true); }} />)}
      </div>
    </div>
  )
} 

// Modal Components
function SignUpModal({ onClose, onSwitch }: { onClose: () => void, onSwitch?: () => void }) {
  const [step, setStep] = useState<'choice' | 'email'>('choice');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthday, setBirthday] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGoogleUsernameModal, setShowGoogleUsernameModal] = useState(false);
  const [googleUser, setGoogleUser] = useState<any>(null);

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Check if user doc exists
      const userDoc = await getDoc(doc(db, "Users", user.uid));
      if (!userDoc.exists()) {
        setGoogleUser(user);
        setShowGoogleUsernameModal(true);
        setLoading(false);
        return;
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (auth.currentUser && username) {
        await updateProfile(auth.currentUser, { displayName: username });
      }
      // Save to Firestore
      await setDoc(doc(db, "Users", userCredential.user.uid), {
        username,
        email,
        birthday,
        createdAt: new Date()
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          >
            <X size={24} />
          </button>
          <h2 className="text-3xl font-bold mb-6 text-center">Sign up</h2>
          {step === 'choice' && (
            <>
              <button
                onClick={handleGoogleSignUp}
                className="w-full flex items-center justify-center space-x-2 border border-gray-200 rounded-full py-3 mb-4 font-semibold hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
                Continue with Google
              </button>
              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="mx-3 text-gray-400 text-sm">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <button
                onClick={() => setStep('email')}
                className="w-full bg-[#ff5a8d] hover:bg-[#ffc3bb] text-white font-semibold py-3 rounded-full transition-colors text-lg"
              >
                Sign up with email
              </button>
            </>
          )}
          {step === 'email' && (
            <form className="space-y-4" onSubmit={handleEmailSignUp}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-200"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-200"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-200"
                required
              />
              <input
                type="date"
                placeholder="Birthday"
                value={birthday}
                onChange={e => setBirthday(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-200"
                required
              />
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <button
                type="submit"
                className="w-full bg-[#ff5a8d] hover:bg-[#ffc3bb] text-white font-semibold py-3 rounded-full transition-colors text-lg"
                disabled={loading}
              >
                {loading ? 'Signing up...' : 'Sign up'}
              </button>
              <button
                type="button"
                className="w-full mt-2 text-gray-500 hover:underline"
                onClick={() => setStep('choice')}
                disabled={loading}
              >
                Back
              </button>
            </form>
          )}
          <div className="text-center text-gray-600 text-sm mt-8">
            Already have an account?{' '}
            <button
              className="font-semibold hover:underline"
              style={{ color: '#1da1f2' }}
              onMouseOver={e => (e.currentTarget.style.color = '#1a8cd8')}
              onMouseOut={e => (e.currentTarget.style.color = '#1da1f2')}
              onClick={() => { onClose(); if (onSwitch) onSwitch(); }}
              type="button"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
      {/* Google Username Modal */}
      {showGoogleUsernameModal && googleUser && (
        <GoogleUsernameModal
          user={googleUser}
          onClose={() => {
            setShowGoogleUsernameModal(false);
            setGoogleUser(null);
            onClose();
          }}
        />
      )}
    </>
  );
}

function GoogleUsernameModal({ user, onClose }: { user: any, onClose: () => void }) {
  const [username, setUsername] = useState(user.displayName || '');
  const [birthday, setBirthday] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await setDoc(doc(db, "Users", user.uid), {
        username,
        email: user.email || '',
        birthday,
        createdAt: new Date()
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save user info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
        <h2 className="text-2xl font-bold mb-6 text-center">Choose a username</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-200"
            required
          />
          <input
            type="date"
            placeholder="Birthday"
            value={birthday}
            onChange={e => setBirthday(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-200"
            required
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-[#ff5a8d] hover:bg-[#ffc3bb] text-white font-semibold py-3 rounded-full transition-colors text-lg"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
}

function LoginModal({ onClose, onSwitch }: { onClose: () => void, onSwitch?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="text-3xl font-bold mb-6 text-center">Log in</h2>
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center space-x-2 border border-gray-200 rounded-full py-3 mb-4 font-semibold hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
          Continue with Google
        </button>
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="mx-3 text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <form className="space-y-4" onSubmit={handleEmailLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full font-semibold py-3 rounded-full transition-colors text-lg text-white"
            style={{ backgroundColor: '#1da1f2' }}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = '#1a8cd8')}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = '#1da1f2')}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <div className="text-center text-gray-600 text-sm mt-8">
          Don’t have an account?{' '}
          <button
            className="text-pink-600 hover:underline font-semibold"
            onClick={() => { onClose(); if (onSwitch) onSwitch(); }}
            type="button"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
} 