'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, AlertCircle, User } from 'lucide-react'

export default function AgeGatePage() {
  const router = useRouter()
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [error, setError] = useState('')
  const [redirectUrl, setRedirectUrl] = useState('/')

  useEffect(() => {
    const url = new URL(window.location.href)
    const redirect = url.searchParams.get('redirect')
    if (redirect) {
      setRedirectUrl(redirect)
    }

    // Check if age already verified
    const ageVerified = localStorage.getItem('ageVerified')
    const verificationTime = ageVerified ? parseInt(ageVerified) : 0
    const oneDay = 24 * 60 * 60 * 1000
    
    if (verificationTime && Date.now() - verificationTime < oneDay) {
      router.push(redirectUrl || '/')
    }
  }, [router])

  const minimumAge = 18

  const calculateAge = (d: number, m: number, y: number) => {
    const today = new Date()
    const birthDate = new Date(y, m - 1, d)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const handleVerify = () => {
    setError('')

    const d = parseInt(day)
    const m = parseInt(month)
    const y = parseInt(year)

    if (!d || !m || !y) {
      setError('Please enter your complete date of birth')
      return
    }

    if (d < 1 || d > 31) {
      setError('Please enter a valid day')
      return
    }

    if (m < 1 || m > 12) {
      setError('Please enter a valid month')
      return
    }

    const currentYear = new Date().getFullYear()
    if (y < 1900 || y > currentYear) {
      setError('Please enter a valid year')
      return
    }

    const age = calculateAge(d, m, y)

    if (age < minimumAge) {
      setError(`You must be at least ${minimumAge} years old to access this content.`)
      return
    }

    // Save verification
    localStorage.setItem('ageVerified', Date.now().toString())
    
    // Redirect
    router.push(redirectUrl)
  }

  const handleDecline = () => {
    router.push('/')
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  return (
    <PageLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Age Verification Required</CardTitle>
              <CardDescription>
                Please verify you are of legal age to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900">Legal Requirement</p>
                      <p className="text-sm text-yellow-700">
                        By continuing, you confirm that you are at least {minimumAge} years old 
                        and meet all legal requirements to access this content.
                      </p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Date of Birth</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="day" className="text-xs">Day</Label>
                      <select
                        id="day"
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="">DD</option>
                        {days.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="month" className="text-xs">Month</Label>
                      <select
                        id="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="">MM</option>
                        {months.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year" className="text-xs">Year</Label>
                      <select
                        id="year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="">YYYY</option>
                        {years.map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="text-sm font-medium">Privacy Notice</p>
                  <p className="text-xs text-muted-foreground">
                    Your date of birth is used only for age verification and is not stored 
                    unless you create an account. Learn more in our{' '}
                    <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <Button onClick={handleVerify} className="w-full" size="lg">
                    I am {minimumAge} years or older
                  </Button>
                  
                  <Button onClick={handleDecline} variant="outline" className="w-full">
                    I am under {minimumAge}
                  </Button>
                </div>

                <div className="text-center pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    By entering, you agree to our{' '}
                    <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}

// Simple Label component for inline use
function Label({ children, className, htmlFor }: { children: React.ReactNode; className?: string; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className={`text-sm font-medium leading-none ${className || ''}`}>
      {children}
    </label>
  )
}
