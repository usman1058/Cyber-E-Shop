'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Smartphone, Mail, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'

function MFAForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const method = searchParams.get('method') || 'email' // email, sms, authenticator

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [trustDevice, setTrustDevice] = useState(false)

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0]
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleVerify = async () => {
    setError('')
    const code = otp.join('')
    
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/verify-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, method, trustDevice }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(data.redirect || '/account')
      } else {
        setError(data.error || 'Invalid code. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResendLoading(true)
    setError('')
    setResendSuccess(false)

    try {
      const response = await fetch('/api/auth/resend-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method }),
      })

      if (response.ok) {
        setResendSuccess(true)
        setOtp(['', '', '', '', '', ''])
        setTimeout(() => setResendSuccess(false), 5000)
      } else {
        setError('Failed to resend code. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Two-Factor Authentication</CardTitle>
            <CardDescription>
              Enter the verification code sent to your {method === 'email' ? 'email' : method === 'sms' ? 'phone' : 'authenticator app'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {resendSuccess && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    New code sent successfully!
                  </AlertDescription>
                </Alert>
              )}

              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {method === 'email' && <Mail className="h-5 w-5 text-primary" />}
                  {method === 'sms' && <Smartphone className="h-5 w-5 text-primary" />}
                  <p className="text-sm font-medium">
                    Enter the 6-digit code sent to you
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  The code will expire in 10 minutes
                </p>
              </div>

              {/* OTP Input */}
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-12 h-14 text-center text-2xl font-bold"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* Trust Device Option */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="trust-device"
                  checked={trustDevice}
                  onChange={(e) => setTrustDevice(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label
                  htmlFor="trust-device"
                  className="text-sm leading-none"
                >
                  Trust this device for 30 days
                </label>
              </div>

              {/* Verify Button */}
              <Button onClick={handleVerify} className="w-full" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify'}
              </Button>

              {/* Resend Code */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Didn't receive the code?
                </p>
                <Button
                  variant="ghost"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="text-primary"
                >
                  {resendLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resend Code
                    </>
                  )}
                </Button>
              </div>

              {/* Backup Code Notice */}
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription className="space-y-1">
                  <p className="text-sm font-medium">Trouble receiving codes?</p>
                  <p className="text-xs text-muted-foreground">
                    If you're having trouble, try using your backup codes or contact support.
                  </p>
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function MFAPage() {
  return (
    <PageLayout>
      <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading authentication...</div>}>
        <MFAForm />
      </Suspense>
    </PageLayout>
  )
}
