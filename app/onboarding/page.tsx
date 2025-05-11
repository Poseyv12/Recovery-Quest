// app/onboarding/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function OnboardingPage() {
  const [username, setUsername] = useState('')
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

    const { error } = await supabase.from('users').insert([
      {
        id: user.id,
        email: user.email,
        username,
      },
    ])

    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
    }

    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Welcome to Recovery Quest</h2>
      <p className="mb-2">Choose a username to get started:</p>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Your username"
        className="w-full p-2 mb-4 border rounded"
      />
      <button
        onClick={handleSubmit}
        disabled={loading || !username}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        {loading ? 'Saving...' : 'Continue'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}
