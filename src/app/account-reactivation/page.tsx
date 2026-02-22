'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'

export default function AccountReactivationPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [acceptUpdatedTerms, setAcceptUpdatedTerms] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    
    if (!acceptUpdatedTerms) {
      setMessage('You must accept the updated terms to reactivate your account')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/reactivate-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, acceptUpdatedTerms }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setMessage('Reactivation email has been sent to your email address.')
      } else {
        setMessage(data.error || 'Failed to send reactivation email.')
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      setMessage('Please provide your email address')
      return
    }

    setLoading(true)
    setMessage('')
    setSuccess(false)

    try {
      const response = await fetch('/api/auth/resend-reactivation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setMessage('Reactivation email has been resent.')
      } else {
        setMessage(data.error || 'Failed to resend reactivation email.')
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
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold">Reactivate Your Account</CardTitle>
              <CardDescription>
                Your account has been deactivated and can be reactivated
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {!success ? (
                  <>
                    <Alert>
                      <Mail className="h-4 w-4" />
                      <AlertDescription className="space-y-2">
                        <p>
                          Your account was previously deactivated. To reactivate it, please provide your email address 
                          and accept the updated terms and conditions.
                        </p>
                      </AlertDescription>
                    </Alert>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {message && (
                        <Alert variant={success ? 'default' : 'destructive'}>
                          {success ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <AlertCircle className="h-4 w-4" />
                          )}
                          <AlertDescription>{message}</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="terms"
                          checked={acceptUpdatedTerms}
                          onCheckedChange={(checked) => setAcceptUpdatedTerms(checked as boolean)}
                        />
                        <label
                          htmlFor="terms"
                          className="text-sm leading-none"
                        >
                          <span className="font-medium">Accept Updated Terms</span>
                          <p className="text-muted-foreground mt-1">
                            I have read and agree to the updated{' '}
                            <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
                            {' '}and{' '}
                            <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                          </p>
                        </label>
                      </div>

                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reactivation Email'}
                      </Button>
                    </form>
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold">Check Your Email</h3>
                    <p className="text-muted-foreground">
                      We've sent a reactivation link to your email address.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg text-left space-y-2">
                      <p className="text-sm font-medium">Next steps:</p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>1. Check your email inbox</li>
                        <li>2. Click the reactivation link</li>
                        <li>3. Your account will be reactivated</li>
                        <li>4. You can log in normally</li>
                      </ul>
                    </div>
                    <div className="space-y-2 pt-4">
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
                            Resend Reactivation Email
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Having trouble? <a href="/contact" className="text-primary hover:underline">Contact Support</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
