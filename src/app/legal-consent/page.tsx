'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label' // Added missing import
import { Shield, FileText, Cookie, Target, Bell, AlertCircle } from 'lucide-react'

interface ConsentPreferences {
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

export default function LegalConsentPage() {
  const router = useRouter()
  const [consents, setConsents] = useState<ConsentPreferences>({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false,
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Load existing consent preferences
    const savedConsents = localStorage.getItem('consentPreferences')
    if (savedConsents) {
      setConsents(JSON.parse(savedConsents))
    }
  }, [])

  const handleSave = async () => {
    setLoading(true)
    setMessage('')

    try {
      // Save consent preferences
      localStorage.setItem('consentPreferences', JSON.stringify(consents))
      localStorage.setItem('consentTimestamp', Date.now().toString())
      
      // In production, send to backend
      // await fetch('/api/consent', { method: 'POST', body: JSON.stringify(consents) })
      
      setSuccess(true)
      setMessage('Your consent preferences have been saved.')
      
      setTimeout(() => {
        const returnUrl = new URLSearchParams(window.location.search).get('return')
        router.push(returnUrl || '/')
      }, 2000)
    } catch (err) {
      setMessage('Failed to save preferences. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptAll = () => {
    setConsents({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    })
  }

  const handleRejectOptional = () => {
    setConsents({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    })
  }

  return (
    <PageLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="w-full max-w-3xl">
          <Card>
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Privacy & Cookie Preferences</CardTitle>
              <CardDescription>
                Manage your data and cookie consent preferences
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Compliance Info */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg dark:bg-blue-950/20">
                <div className="flex items-start gap-2">
                  <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">GDPR & CCPA Compliance</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      We respect your privacy and comply with GDPR and CCPA regulations. 
                      You have the right to control how we use your data.
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Message */}
              {message && (
                <div className={`p-4 rounded-lg ${
                  success ? 'bg-green-50 border border-green-200 dark:bg-green-950/20' : 'bg-red-50 border border-red-200 dark:bg-red-950/20'
                }`}>
                  <div className="flex items-start gap-2">
                    {success ? (
                      <div className="h-5 w-5 flex items-center justify-center text-green-600">✓</div>
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <p className={`text-sm ${success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>{message}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {/* Necessary Cookies */}
                <div className="flex items-start gap-4 p-4 border rounded-lg bg-muted/50">
                  <Checkbox
                    id="necessary"
                    checked={consents.necessary}
                    disabled
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Label htmlFor="necessary" className="font-medium">
                        Necessary Cookies
                      </Label>
                      <Badge variant="secondary">Required</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Essential for the website to function properly, including authentication, 
                      security, and basic functionality. Cannot be disabled.
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Functional Cookies */}
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Checkbox
                    id="functional"
                    checked={consents.functional}
                    onCheckedChange={(checked) => setConsents({ ...consents, functional: checked as boolean })}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Label htmlFor="functional" className="font-medium">
                        Functional Cookies
                      </Label>
                      <Badge variant="outline">Recommended</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Enable enhanced features like remembering preferences, language settings, 
                      and personalized content.
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Target className="h-3 w-3" />
                      <span>Personalization, preferences, accessibility</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Analytics Cookies */}
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Checkbox
                    id="analytics"
                    checked={consents.analytics}
                    onCheckedChange={(checked) => setConsents({ ...consents, analytics: checked as boolean })}
                  />
                  <div className="flex-1">
                    <Label htmlFor="analytics" className="font-medium mb-1 block">
                      Analytics Cookies
                    </Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Help us understand how you use our website to improve performance and 
                      user experience. Data is anonymized.
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      <span>Page views, bounce rate, traffic sources</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Marketing Cookies */}
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Checkbox
                    id="marketing"
                    checked={consents.marketing}
                    onCheckedChange={(checked) => setConsents({ ...consents, marketing: checked as boolean })}
                  />
                  <div className="flex-1">
                    <Label htmlFor="marketing" className="font-medium mb-1 block">
                      Marketing Cookies
                    </Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Allow us and our partners to show you personalized advertisements and offers 
                      based on your browsing behavior.
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Bell className="h-3 w-3" />
                      <span>Personalized ads, promotions, recommendations</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg dark:bg-yellow-950/20">
                <div className="flex items-start gap-2">
                  <Cookie className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800 dark:text-yellow-200">
                    <p className="font-medium mb-1">You can change your preferences anytime</p>
                    <p>
                      Visit the <a href="/cookie" className="font-medium hover:underline">Cookie Policy</a> page 
                      to update your consent preferences in the future.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleAcceptAll} variant="outline" className="flex-1">
                  Accept All
                </Button>
                <Button onClick={handleRejectOptional} variant="outline" className="flex-1">
                  Reject Optional
                </Button>
                <Button onClick={handleSave} className="flex-1" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Preferences'}
                </Button>
              </div>

              {/* Footer Links */}
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  For more details, read our{' '}
                  <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                  {' '}and{' '}
                  <a href="/cookie" className="text-primary hover:underline">Cookie Policy</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}