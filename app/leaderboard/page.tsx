'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  User, 
  LogIn, 
  UserIcon,
  X
} from 'lucide-react'
import Leaderboard from '../components/Leaderboard'
import LanguageSelector from '../components/LanguageSelector'
import { getTranslation } from '../utils/translations'
import { useRouter } from 'next/navigation'
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signInAnonymously } from "firebase/auth";
import { auth } from "../firebase";
import { db } from "../firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";

// Utility to generate a consistent color from a string
function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 60%)`;
  return color;
}

// UserAvatar component
function UserAvatar({ user, size = 32 }: { user: any, size?: number }) {
  if (user.photoURL) {
    return (
      <img
        src={user.photoURL}
        alt="Profile"
        className={`rounded-full object-cover`}
        style={{ width: size, height: size }}
      />
    );
  }
  const name = user.displayName || user.email || '';
  const letter = name.charAt(0).toUpperCase();
  const bgColor = stringToColor(user.uid || name);
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold"
      style={{ background: bgColor, width: size, height: size, fontSize: size * 0.6 }}
    >
      {letter}
    </div>
  );
}

export default function LeaderboardPage() {
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'en'
    }
    return 'en'
  })
  const router = useRouter();
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Helper to check if user is a real (non-anonymous) user
  const isRealUser = user && user.providerData && user.providerData.length > 0;

  // Auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      console.log('Auth state changed:', firebaseUser);
      setUser(firebaseUser);
      // If not signed in, sign in anonymously
      if (!firebaseUser) {
        signInAnonymously(auth).catch((err) => {
          console.error('Anonymous sign-in error:', err);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Save language to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language)
    }
  }, [language])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>{getTranslation('Back to Home', language)}</span>
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
                <button
                  className="flex items-center space-x-2 px-4 py-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                  onClick={() => setShowProfileModal(true)}
                >
                  <UserAvatar user={user} size={32} />
                  <span>{user.displayName || user.email}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{getTranslation('Beauty Score Leaderboard', language)}</h1>
          <p className="text-gray-600">{getTranslation('See how you rank against others', language)}</p>
        </div>
        
        <Leaderboard language={language} />
      </div>

      {/* Modals */}
      {showSignUp && (<SignUpModal onClose={() => setShowSignUp(false)} onSwitch={() => { setShowSignUp(false); setShowLogin(true); }} />)}
      {showLogin && (<LoginModal onClose={() => setShowLogin(false)} onSwitch={() => { setShowLogin(false); setShowSignUp(true); }} />)}
      {showProfileModal && user && (
        <ProfileModal user={user} onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  )
}

// Modal Components (exact same as analysis page)
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
      console.log('Starting Google signup...');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Google signup successful:', user);
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
      console.error('Google signup error:', err);
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
        createdAt: new Date(),
        photoURL: auth.currentUser?.photoURL || null
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
        createdAt: new Date(),
        photoURL: user.photoURL || null
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
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="text-3xl font-bold mb-6 text-center">Complete Profile</h2>
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
            {loading ? 'Saving...' : 'Complete Setup'}
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
          Don't have an account?{' '}
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

function ProfileModal({ user, onClose }: { user: any, onClose: () => void }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [newUsername, setNewUsername] = useState(user.displayName || '');
  const [newBirthday, setNewBirthday] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      await updateProfile(auth.currentUser!, { displayName: newUsername });
      await setDoc(doc(db, "Users", user.uid), {
        username: newUsername,
        email: user.email || '',
        birthday: newBirthday,
        updatedAt: new Date()
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await auth.signOut();
    onClose();
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
        <h2 className="text-3xl font-bold mb-6 text-center">Profile</h2>
        <div className="flex flex-col items-center mb-6">
          <UserAvatar user={user} size={96} />
          <h3 className="text-2xl font-bold mb-2">{user.displayName || user.email}</h3>
          <p className="text-gray-600 text-sm">@{user.displayName || user.email}</p>
        </div>
        <div className="w-full mb-6">
          <h3 className="text-lg font-semibold mb-2">Account Details</h3>
          <p className="text-gray-800 text-sm">Email: {user.email}</p>
          <p className="text-gray-800 text-sm">Birthday: {user.birthday ? new Date(user.birthday).toLocaleDateString() : 'Not set'}</p>
        </div>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => setShowEditModal(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            Edit Profile
          </button>
          <button
            onClick={handleSignOut}
            className="w-full bg-red-600 text-white py-3 rounded-full font-semibold hover:bg-red-700 transition-colors"
            disabled={loading}
          >
            Sign Out
          </button>
        </div>
      </div>
      {showEditModal && (
        <EditProfileModal
          user={user}
          newUsername={newUsername}
          newBirthday={newBirthday}
          onClose={() => setShowEditModal(false)}
          onSave={handleSave}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
}

function EditProfileModal({ user, newUsername, newBirthday, onClose, onSave, loading, error }: {
  user: any;
  newUsername: string;
  newBirthday: string;
  onClose: () => void;
  onSave: () => void;
  loading: boolean;
  error: string | null;
}) {
  const [username, setUsername] = useState(newUsername);
  const [birthday, setBirthday] = useState(newBirthday);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleBirthdayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBirthday(e.target.value);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
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
        <h2 className="text-3xl font-bold mb-6 text-center">Edit Profile</h2>
        {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}
        <form className="space-y-4" onSubmit={handleSave}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-200"
            required
          />
          <input
            type="date"
            placeholder="Birthday"
            value={birthday}
            onChange={handleBirthdayChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
          <button
            type="submit"
            className="w-full bg-[#ff5a8d] hover:bg-[#ffc3bb] text-white font-semibold py-3 rounded-full transition-colors text-lg"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
} 