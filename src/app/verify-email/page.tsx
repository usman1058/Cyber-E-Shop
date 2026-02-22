'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, CheckCircle, Clock, RefreshCw } from 'lucide-react'

function VerificationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  // Get email from URL query params
  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam))
    }
  }, [searchParams])

  const handleResend = async () => {
    if (!email) {
      setMessage('Please provide your email address')
      return
    }

    setLoading(true)
    setMessage('')
    setSuccess(false)

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setMessage('Verification email has been resent. Please check your inbox.')
      } else {
        setMessage(data.error || 'Failed to resend verification email')
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
            <CardDescription>
              We've sent a verification link to your email address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription className="space-y-2">
                  <p>
                    Please check your email and click the verification link to activate your account.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    The verification link will expire in 24 hours.
                  </p>
                </AlertDescription>
              </Alert>

              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Didn't receive the email?
                </p>
                <Button
                  variant="outline"
                  onClick={handleResend}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
              </div>

              {message && (
                <Alert variant={success ? 'default' : 'destructive'}>
                  {success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : null}
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Make sure to check:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Your inbox (including spam folder)</li>
                  <li>• Promotions and social tabs</li>
                  <li>• Junk or spam folder</li>
                </ul>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Wrong email address?
                </p>
                <Link href="/login">
                  <Button variant="ghost" className="w-full">
                    Go back to login
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function EmailVerificationPage() {
  return (
    <PageLayout>
      <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading verification...</div>}>
        <VerificationContent />
      </Suspense>
    </PageLayout>
  )
}
