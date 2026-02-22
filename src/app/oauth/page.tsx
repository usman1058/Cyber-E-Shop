'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, AlertCircle, User } from 'lucide-react'

function OAuthRedirectContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'info'>('loading')
  const [message, setMessage] = useState('')
  const [needsAdditionalInfo, setNeedsAdditionalInfo] = useState(false)
  const [additionalInfo, setAdditionalInfo] = useState({
    name: '',
    phone: '',
  })

  const provider = searchParams.get('provider') || 'OAuth Provider'
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')
  const action = searchParams.get('action') || 'login'

  useEffect(() => {
    if (error) {
      setStatus('error')
      setMessage('Authentication was cancelled or failed. Please try again.')
      return
    }

    if (!code) {
      setStatus('error')
      setMessage('Invalid authentication response. Please try again.')
      return
    }

    // Process OAuth callback
    processOAuthCallback()
  }, [code, error])

  const processOAuthCallback = async () => {
    try {
      const response = await fetch('/api/auth/oauth/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, code, state, action }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.needsAdditionalInfo) {
          setStatus('info')
          setNeedsAdditionalInfo(true)
          setMessage('Please provide additional information to complete your account setup.')
        } else {
          setStatus('success')
          setMessage(`Successfully ${action === 'register' ? 'created account' : 'signed in'} with ${provider}`)

          setTimeout(() => {
            router.push(data.redirect || '/account')
          }, 1500)
        }
      } else {
        setStatus('error')
        setMessage(data.error || 'Authentication failed. Please try again.')
      }
    } catch (err) {
      setStatus('error')
      setMessage('An error occurred. Please try again.')
    }
  }

  const handleAdditionalInfoSubmit = async () => {
    try {
      const response = await fetch('/api/auth/oauth/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, ...additionalInfo }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Account setup complete!')

        setTimeout(() => {
          router.push(data.redirect || '/account')
        }, 1500)
      } else {
        setMessage(data.error || 'Failed to complete setup. Please try again.')
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.')
    }
  }

  const handleRetry = () => {
    router.push(`/login`)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              {status === 'loading' ? (
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              ) : status === 'success' ? (
                <CheckCircle className="h-10 w-10 text-green-600" />
              ) : status === 'error' ? (
                <AlertCircle className="h-10 w-10 text-red-600" />
              ) : (
                <User className="h-10 w-10 text-primary" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold">
              {status === 'loading' && 'Authenticating...'}
              {status === 'success' && 'Success!'}
              {status === 'error' && 'Authentication Failed'}
              {status === 'info' && 'Complete Your Profile'}
            </CardTitle>
            <CardDescription>
              {status === 'loading' && `Signing you in with ${provider}...`}
              {status === 'success' && message}
              {status === 'error' && message}
              {status === 'info' && message}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === 'loading' && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Please wait while we verify your credentials...
                </p>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">
                  You will be redirected to your account shortly.
                </p>
                <Button onClick={() => router.push('/account')} className="w-full">
                  Go to Account
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {message}
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Button onClick={handleRetry} variant="outline" className="w-full">
                    Try Again
                  </Button>
                  <Button onClick={() => router.push('/login')} className="w-full">
                    Back to Login
                  </Button>
                </div>

                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Need help? <a href="/contact" className="text-primary hover:underline">Contact Support</a>
                  </p>
                </div>
              </div>
            )}

            {status === 'info' && needsAdditionalInfo && (
              <div className="space-y-4">
                <form onSubmit={(e) => { e.preventDefault(); handleAdditionalInfoSubmit(); }} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={additionalInfo.name}
                      onChange={(e) => setAdditionalInfo({ ...additionalInfo, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={additionalInfo.phone}
                      onChange={(e) => setAdditionalInfo({ ...additionalInfo, phone: e.target.value })}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Complete Setup
                  </Button>
                </form>

                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    By continuing, you agree to our{' '}
                    <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function OAuthRedirectPage() {
  return (
    <PageLayout>
      <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Authenticating...</div>}>
        <OAuthRedirectContent />
      </Suspense>
    </PageLayout>
  )
}
