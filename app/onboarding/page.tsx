// app/onboarding/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function OnboardingPage() {
  const [username, setUsername] = useState('')
  const [soberDate, setSoberDate] = useState('')
  const [includeSoberDate, setIncludeSoberDate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Redirect if user already completed onboarding
    const checkProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return router.push('/auth') // not logged in

      const { data: existing } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (existing) {
        router.push('/dashboard')
      }
    }

    checkProfile()
  }, [router])

  const handleSubmit = async () => {
    if (!username.trim()) {
      setError('Username is required')
      return
    }
    
    setLoading(true)
    setError(null)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('User not logged in')
      setLoading(false)
      return
    }

    const userData = {
      id: user.id,
      email: user.email,
      username,
      ...(includeSoberDate && soberDate ? { sober_start_date: soberDate } : {})
    }

    const { error } = await supabase.from('users').insert([userData])

    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
    }

    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Welcome to Recovery Quest</h2>
      <p className="mb-6 text-gray-600 text-center">Set up your profile to begin your journey</p>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Choose a username:
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div className="pt-2">
          <div className="flex items-center mb-2">
            <input
              id="trackSobriety"
              type="checkbox"
              checked={includeSoberDate}
              onChange={() => setIncludeSoberDate(!includeSoberDate)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="trackSobriety" className="ml-2 block text-sm text-gray-700">
              I want to track my sobriety
            </label>
          </div>
          
          {includeSoberDate && (
            <div className="ml-6">
              <label htmlFor="soberDate" className="block text-sm font-medium text-gray-700 mb-1">
                When did your sobriety begin?
              </label>
              <input
                id="soberDate"
                type="date"
                value={soberDate}
                onChange={(e) => setSoberDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be used to calculate your days of sobriety. You can update this later.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={loading || !username}
        className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        {loading ? 'Creating Profile...' : 'Start My Journey'}
      </button>
      
      {error && (
        <p className="text-red-500 mt-2 text-sm text-center">{error}</p>
      )}
    </div>
  )
}
