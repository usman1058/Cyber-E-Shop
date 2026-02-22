'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string | null
  role: string
  isAdmin: boolean
}

interface Session {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  expiresAt: Date | null
}

interface UseSessionReturn {
  session: Session | null
  loading: boolean
  error: string | null
  guestId: string | null
  refetch: () => Promise<void>
}

export function useSession(options?: { required?: boolean; redirectTo?: string }): UseSessionReturn {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [guestId, setGuestId] = useState<string | null>(null)

  // Manage Guest ID
  useEffect(() => {
    let id = localStorage.getItem('eshop_guest_id')
    if (!id) {
      id = `guest_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`
      localStorage.setItem('eshop_guest_id', id)
    }
    setGuestId(id)
  }, [])

  const fetchSession = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/session', {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setSession({
          isAuthenticated: data.isAuthenticated,
          user: data.user,
          token: data.token,
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        })
      } else {
        setSession({
          isAuthenticated: false,
          user: null,
          token: null,
          expiresAt: null,
        })

        // Redirect if session is required
        if (options?.required && options?.redirectTo) {
          router.push(options.redirectTo)
        }
      }
    } catch (err) {
      setError('Failed to fetch session')
      setSession({
        isAuthenticated: false,
        user: null,
        token: null,
        expiresAt: null,
      })

      // Redirect on error if session is required
      if (options?.required && options?.redirectTo) {
        router.push(options.redirectTo)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSession()
  }, [])

  return {
    session,
    loading,
    error,
    guestId,
    refetch: fetchSession,
  }
}
