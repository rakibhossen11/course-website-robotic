'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  AcademicCapIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  SparklesIcon,
  DevicePhoneMobileIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaFacebook } from 'react-icons/fa';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const router = useRouter();
  const { googleSignIn, user, loading: authLoading } = useAuth();

  // Redirect when user is logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');

      const result = await googleSignIn();

      if (result.success) {
        console.log('Google login successful! Redirecting soon...');
      } else {
        let errorMsg = result?.error || 'Failed to sign in with Google';

        if (result?.code === 'auth/popup-blocked') {
          errorMsg = 'Popup blocked. Please allow popups and try again.';
        } else if (result?.code === 'auth/cancelled-popup-request') {
          errorMsg = 'Login cancelled.';
        }

        setError(errorMsg);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Email/password login logic will go here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSocialLogin = (provider) => {
    console.log(`${provider} login clicked`);
    // Implement other social logins here
  };

  // Show redirecting screen when user is authenticated
  if (!authLoading && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center max-w-md px-6">
          <div className="relative mx-auto w-20 h-20 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-ping opacity-20"></div>
            <div className="relative w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <ShieldCheckIcon className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome Back!</h2>
          <p className="text-gray-600 mb-8">Login successful! Redirecting you to dashboard...</p>
          <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Brand/Info */}
        <div className="hidden lg:block px-8">
          <div className="space-y-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <AcademicCapIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  LearningBD
                </h1>
                <p className="text-sm text-gray-600">Learn. Grow. Succeed</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                Welcome Back to Your <span className="text-blue-600">Learning Journey</span>
              </h2>
              
              <p className="text-lg text-gray-600">
                Access your personalized dashboard, continue your courses, and track your progress.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-3 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <SparklesIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Personalized Learning</h4>
                    <p className="text-sm text-gray-600">Pick up where you left off</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DevicePhoneMobileIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Access Anywhere</h4>
                    <p className="text-sm text-gray-600">Learn on any device</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ShieldCheckIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Secure & Private</h4>
                    <p className="text-sm text-gray-600">Your data is protected</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Join <span className="font-semibold text-blue-600">10,000+</span> students already learning with us
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:max-w-lg">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 lg:p-10">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <AcademicCapIcon className="w-7 h-7 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  LearningBD
                </h1>
                <p className="text-sm text-gray-600">Welcome back!</p>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Sign In to Continue</h2>
              <p className="text-gray-600 mt-2">Enter your credentials to access your account</p>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-4 mb-8">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading || authLoading}
                className={`w-full flex items-center justify-center space-x-3 py-3.5 px-4 rounded-xl border transition-all duration-300 ${
                  loading || authLoading
                    ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-300 hover:border-blue-400 hover:shadow-md active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-900 border-t-transparent"></div>
                    <span className="font-medium">Signing in...</span>
                  </>
                ) : (
                  <>
                    <FcGoogle className="w-5 h-5" />
                    <span className="font-medium">Continue with Google</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleSocialLogin('github')}
                  className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border border-gray-300 hover:border-gray-400 hover:shadow-sm transition-all duration-300 active:scale-[0.98]"
                >
                  <FaGithub className="w-5 h-5" />
                  <span className="font-medium text-sm">GitHub</span>
                </button>
                <button
                  onClick={() => handleSocialLogin('facebook')}
                  className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border border-gray-300 hover:border-blue-500 hover:shadow-sm transition-all duration-300 active:scale-[0.98]"
                >
                  <FaFacebook className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-sm">Facebook</span>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-gray-500 text-sm">Or continue with email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me for 30 days
                </label>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center py-3.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transition-all duration-300 active:scale-[0.98] group"
              >
                <span>Sign In</span>
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Error Display */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Login Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                      {error.includes('popup') && (
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>Allow popups for this site in your browser</li>
                          <li>Try in Incognito mode</li>
                          <li>Disable ad blockers temporarily</li>
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link 
                  href="/register" 
                  className="font-medium text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center group"
                >
                  Create one now
                  <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </p>
            </div>

            {/* Terms & Privacy */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-800">Terms</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-800">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add animation keyframes to your global CSS */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}