// app/auth/page.tsx (Next.js 15 App Router)
'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAuth = async () => {
    setError(null)
    setIsLoading(true)
    
    try {
      const { error } = isLogin
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })

      if (error) {
        setError(error.message)
      } else {
        router.push('/onboarding') 
      }
    } catch (error: unknown) {
      console.error('Error signing in:', error)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin 
              ? 'Sign in to continue to Recovery Quest' 
              : 'Get started with Recovery Quest today'}
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="rounded-md -space-y-px">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <button 
            onClick={handleAuth} 
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Log in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
