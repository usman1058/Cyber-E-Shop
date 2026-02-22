'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Cookie, CheckCircle, XCircle } from 'lucide-react'
import { useState } from 'react'

export default function CookiePage() {
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false,
  })

  const handleSave = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences))
    alert('Your cookie preferences have been saved')
  }

  const handleAcceptAll = () => {
    const allAccepted = { ...preferences, analytics: true, marketing: true }
    setPreferences(allAccepted)
    localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted))
  }

  const handleRejectAll = () => {
    const onlyNecessary = { ...preferences, functional: false, analytics: false, marketing: false }
    setPreferences(onlyNecessary)
    localStorage.setItem('cookiePreferences', JSON.stringify(onlyNecessary))
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Cookie Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Overview */}
          <div className="mb-8">
            <div className="bg-muted/50 rounded-lg p-6 flex gap-4 items-start">
              <Cookie className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold mb-2">Understanding Cookies</h2>
                <p className="text-sm text-muted-foreground">
                  Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and analyzing usage.
                </p>
              </div>
            </div>
          </div>

          {/* Cookie Preferences Manager */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Manage Your Cookie Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Update your cookie preferences below. Changes will take effect immediately.
                  </p>
                </div>

                {/* Necessary Cookies */}
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <input
                      type="checkbox"
                      id="necessary"
                      checked={preferences.necessary}
                      disabled
                      className="w-5 h-5 text-primary rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <Label htmlFor="necessary" className="font-semibold cursor-pointer">
                        Necessary Cookies
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Required for the website to function properly. These cookies enable basic features like page navigation, secure login, and shopping cart. Cannot be disabled.
                    </p>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <input
                      type="checkbox"
                      id="functional"
                      checked={preferences.functional}
                      onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                      className="w-5 h-5 text-primary rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="functional" className="font-semibold cursor-pointer block mb-1">
                      Functional Cookies
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Enable enhanced functionality and personalization. Remember your preferences, language, and location to provide a better user experience.
                    </p>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <input
                      type="checkbox"
                      id="analytics"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      className="w-5 h-5 text-primary rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="analytics" className="font-semibold cursor-pointer block mb-1">
                      Analytics Cookies
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Help us understand how visitors use our website by collecting anonymous information about page visits, time spent, and errors encountered.
                    </p>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <input
                      type="checkbox"
                      id="marketing"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                      className="w-5 h-5 text-primary rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="marketing" className="font-semibold cursor-pointer block mb-1">
                      Marketing Cookies
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Used to deliver personalized advertisements and track marketing campaigns. May share information with third-party advertising networks.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <Button onClick={handleSave}>
                    Save Preferences
                  </Button>
                  <Button variant="outline" onClick={handleAcceptAll}>
                    Accept All
                  </Button>
                  <Button variant="outline" onClick={handleRejectAll}>
                    Reject Optional
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information */}
          <div className="space-y-8">
            {/* Types of Cookies */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Types of Cookies We Use</h2>
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Session Cookies</h3>
                    <p className="text-sm text-muted-foreground">
                      Temporary cookies that expire when you close your browser. Used to maintain your session while browsing.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Persistent Cookies</h3>
                    <p className="text-sm text-muted-foreground">
                      Remain on your device for a set period or until you delete them. Used to remember your preferences between visits.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">First-Party Cookies</h3>
                    <p className="text-sm text-muted-foreground">
                      Set by CyberShop directly. Essential for our website to function properly.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Third-Party Cookies</h3>
                    <p className="text-sm text-muted-foreground">
                      Set by external services we use (analytics, payment processors, social media). Used for analytics and marketing.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* How to Manage Cookies */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Managing Cookies in Your Browser</h2>
              <Card>
                <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
                  <p>
                    Most web browsers allow you to control cookies through their settings. You can:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li>• Block all cookies</li>
                    <li>• Accept only first-party cookies</li>
                    <li>• Delete existing cookies</li>
                    <li>• Clear cookies when you close your browser</li>
                  </ul>
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-xs">
                      <strong>Note:</strong> Blocking or deleting cookies may affect your browsing experience and some website features may not work properly.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Cookie List */}
            <section>
              <h2 className="text-2xl font-bold mb-4">List of Cookies We Use</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 font-semibold">Cookie Name</th>
                          <th className="text-left py-3 px-2 font-semibold">Type</th>
                          <th className="text-left py-3 px-2 font-semibold">Purpose</th>
                          <th className="text-left py-3 px-2 font-semibold">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 px-2 font-medium">_session_id</td>
                          <td className="py-3 px-2">Session</td>
                          <td className="py-3 px-2">Maintains your browsing session</td>
                          <td className="py-3 px-2">Session</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-2 font-medium">_ga, _gid</td>
                          <td className="py-3 px-2">Analytics</td>
                          <td className="py-3 px-2">Google Analytics tracking</td>
                          <td className="py-3 px-2">2 years / 24 hours</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-2 font-medium">cart_token</td>
                          <td className="py-3 px-2">Functional</td>
                          <td className="py-3 px-2">Stores your shopping cart</td>
                          <td className="py-3 px-2">30 days</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-2 font-medium">user_preferences</td>
                          <td className="py-3 px-2">Functional</td>
                          <td className="py-3 px-2">Remembers your preferences</td>
                          <td className="py-3 px-2">1 year</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Updates */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Updates to This Policy</h2>
              <Card>
                <CardContent className="pt-6 text-sm text-muted-foreground">
                  <p className="mb-4">
                    We may update this Cookie Policy from time to time to reflect changes in our practices, technology, or legal requirements.
                  </p>
                  <p>
                    We encourage you to review this policy regularly. Continued use of our website after changes indicates your acceptance of the updated policy.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <Card>
                <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
                  <p>If you have questions about our use of cookies, please contact us:</p>
                  <ul className="space-y-2">
                    <li><strong>Email:</strong> privacy@cybershop.com</li>
                    <li><strong>Phone:</strong> +1 (800) 123-4567</li>
                    <li><strong>Address:</strong> 123 Cyber Street, Tech City, CA 90210, USA</li>
                  </ul>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
