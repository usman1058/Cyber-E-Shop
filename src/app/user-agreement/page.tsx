'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { FileCheck, AlertCircle, CheckCircle, ArrowRight, ExternalLink } from 'lucide-react'

export default function UserAgreementPage() {
  const router = useRouter()
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [acceptedCookies, setAcceptedCookies] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [updatedDocs, setUpdatedDocs] = useState<string[]>([])

  useEffect(() => {
    // Get updated documents from URL params
    const url = new URLSearchParams(window.location.search)
    const updates = url.get('updates')
    if (updates) {
      setUpdatedDocs(updates.split(','))
    }
  }, [])

  const handleAcceptAll = () => {
    setAcceptedTerms(true)
    setAcceptedPrivacy(true)
    setAcceptedCookies(true)
  }

  const handleSubmit = async () => {
    setError('')

    if (!acceptedTerms || !acceptedPrivacy) {
      setError('You must accept the Terms of Service and Privacy Policy to continue')
      return
    }

    setLoading(true)

    try {
      // Save acceptance timestamp
      localStorage.setItem('agreementAccepted', Date.now().toString())
      localStorage.setItem('agreements', JSON.stringify({
        terms: acceptedTerms,
        privacy: acceptedPrivacy,
        cookies: acceptedCookies,
      }))

      // In production, send to backend
      // await fetch('/api/agreements', { method: 'POST', body: JSON.stringify({ ... }) })

      // Redirect to return URL or account/dashboard
      const returnUrl = new URLSearchParams(window.location.search).get('return')
      router.push(returnUrl || '/account')
    } catch (err) {
      setError('Failed to save your acceptance. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const documentInfo = {
    terms: {
      title: 'Terms of Service',
      description: 'Rules and guidelines for using our platform',
      lastUpdated: 'January 15, 2024',
      href: '/terms',
      updated: updatedDocs.includes('terms'),
    },
    privacy: {
      title: 'Privacy Policy',
      description: 'How we collect, use, and protect your data',
      lastUpdated: 'January 15, 2024',
      href: '/privacy',
      updated: updatedDocs.includes('privacy'),
    },
    cookies: {
      title: 'Cookie Policy',
      description: 'Information about cookies and tracking technologies',
      lastUpdated: 'January 15, 2024',
      href: '/cookie',
      updated: updatedDocs.includes('cookies'),
    },
  }

  return (
    <PageLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="w-full max-w-2xl">
          <Card>
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <FileCheck className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Review and Accept Updated Agreements</CardTitle>
              <CardDescription>
                {updatedDocs.length > 0 
                  ? `We've updated our ${updatedDocs.length === 1 ? 'agreement' : 'agreements'}. Please review before continuing.`
                  : 'Please review and accept our terms and policies to continue'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {updatedDocs.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Updates Required</p>
                      <p>
                        The following documents have been updated since you last accepted them. 
                        Please review and accept the new versions.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Documents List */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Documents to Review</h3>
                
                {/* Terms of Service */}
                <div className={`p-4 border rounded-lg ${documentInfo.terms.updated ? 'border-primary bg-primary/5' : ''}`}>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{documentInfo.terms.title}</h4>
                        {documentInfo.terms.updated && <Badge variant="default">Updated</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {documentInfo.terms.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last updated: {documentInfo.terms.lastUpdated}
                      </p>
                    </div>
                    <Link href={documentInfo.terms.href} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        Read
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                  <div className="flex items-start gap-2 mt-3 pt-3 border-t">
                    <Checkbox
                      id="terms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm leading-none cursor-pointer"
                    >
                      I have read and accept the {documentInfo.terms.title}
                    </label>
                  </div>
                </div>

                {/* Privacy Policy */}
                <div className={`p-4 border rounded-lg ${documentInfo.privacy.updated ? 'border-primary bg-primary/5' : ''}`}>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{documentInfo.privacy.title}</h4>
                        {documentInfo.privacy.updated && <Badge variant="default">Updated</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {documentInfo.privacy.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last updated: {documentInfo.privacy.lastUpdated}
                      </p>
                    </div>
                    <Link href={documentInfo.privacy.href} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        Read
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                  <div className="flex items-start gap-2 mt-3 pt-3 border-t">
                    <Checkbox
                      id="privacy"
                      checked={acceptedPrivacy}
                      onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
                    />
                    <label
                      htmlFor="privacy"
                      className="text-sm leading-none cursor-pointer"
                    >
                      I have read and accept the {documentInfo.privacy.title}
                    </label>
                  </div>
                </div>

                {/* Cookie Policy */}
                <div className={`p-4 border rounded-lg ${documentInfo.cookies.updated ? 'border-primary bg-primary/5' : ''}`}>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{documentInfo.cookies.title}</h4>
                        {documentInfo.cookies.updated && <Badge variant="default">Updated</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {documentInfo.cookies.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last updated: {documentInfo.cookies.lastUpdated}
                      </p>
                    </div>
                    <Link href={documentInfo.cookies.href} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        Read
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                  <div className="flex items-start gap-2 mt-3 pt-3 border-t">
                    <Checkbox
                      id="cookies"
                      checked={acceptedCookies}
                      onCheckedChange={(checked) => setAcceptedCookies(checked as boolean)}
                    />
                    <label
                      htmlFor="cookies"
                      className="text-sm leading-none cursor-pointer"
                    >
                      I have read and accept the {documentInfo.cookies.title}
                    </label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Additional Info */}
              <div className="space-y-3">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">By accepting these agreements, you:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Agree to abide by our Terms of Service</li>
                    <li>• Consent to our data collection and usage as described in Privacy Policy</li>
                    <li>• Understand our use of cookies and tracking technologies</li>
                    <li>• Can withdraw consent at any time through your account settings</li>
                  </ul>
                </div>

                <div className="text-sm text-muted-foreground text-center">
                  Need help understanding these documents?{' '}
                  <Link href="/contact" className="text-primary hover:underline">Contact Support</Link>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button onClick={handleAcceptAll} variant="outline" className="w-full">
                  Accept All Agreements
                </Button>
                
                <Button 
                  onClick={handleSubmit} 
                  className="w-full" 
                  disabled={loading || !acceptedTerms || !acceptedPrivacy}
                  size="lg"
                >
                  {loading ? 'Processing...' : 'Continue'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
