'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, CheckCircle, ArrowLeft, Lock } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setMessage('Password reset instructions have been sent to your email.')
      } else {
        setMessage(data.error || 'Failed to send reset instructions.')
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
              <CardDescription>
                No worries, we'll send you reset instructions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!success ? (
                <>
                  <div className="space-y-4">
                    <Alert>
                      <Mail className="h-4 w-4" />
                      <AlertDescription>
                    Enter your email address and we'll send you a link to reset your password.
                      </AlertDescription>
                    </Alert>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {message && (
                        <Alert variant={success ? 'default' : 'destructive'}>
                          {success ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : null}
                          <AlertDescription>{message}</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            className="pl-10"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      {/* CAPTCHA placeholder */}
                      <div className="bg-muted/50 p-4 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">
                          🤖 CAPTCHA verification would be here
                        </p>
                      </div>

                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Check Your Email</h3>
                  <p className="text-muted-foreground">
                    We've sent password reset instructions to your email address.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg text-left space-y-2">
                    <p className="text-sm font-medium">What to do next:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>1. Check your email inbox</li>
                      <li>2. Look for the password reset email</li>
                      <li>3. Click the reset link in the email</li>
                      <li>4. Create a new password</li>
                    </ul>
                  </div>
                  <div className="space-y-2 pt-4">
                    <p className="text-sm text-muted-foreground">
                      Didn't receive the email? Check your spam folder or try again.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSuccess(false)
                        setMessage('')
                      }}
                      className="w-full"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link href="/login" className="w-full">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
