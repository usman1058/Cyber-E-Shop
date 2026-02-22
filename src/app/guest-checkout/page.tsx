'use client'

import { useState } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, Lock, AlertCircle } from 'lucide-react'

export default function GuestCheckoutPage() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    acceptCookies: false,
    acceptMarketing: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.acceptCookies) {
      setError('You must accept cookies to proceed with checkout')
      return
    }

    setLoading(true)

    try {
      // Save guest info and proceed to checkout
      localStorage.setItem('guestCheckout', JSON.stringify(formData))
      window.location.href = '/checkout'
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold">Guest Checkout</CardTitle>
              <CardDescription>
                Provide your email to receive order updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  Your information is secure and will only be used for this order. 
                  Create an account later to track orders and save preferences.
                </AlertDescription>
              </Alert>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Required for order confirmation and shipping updates
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Used by delivery services if needed
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="cookies"
                      checked={formData.acceptCookies}
                      onCheckedChange={(checked) => setFormData({ ...formData, acceptCookies: checked as boolean })}
                    />
                    <label
                      htmlFor="cookies"
                      className="text-sm leading-none"
                    >
                      <span className="font-medium">Accept Cookies</span>
                      <p className="text-muted-foreground mt-1">
                        Required for secure checkout and order processing. View our{' '}
                        <a href="/cookie" className="text-primary hover:underline">Cookie Policy</a>
                      </p>
                    </label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="marketing"
                      checked={formData.acceptMarketing}
                      onCheckedChange={(checked) => setFormData({ ...formData, acceptMarketing: checked as boolean })}
                    />
                    <label
                      htmlFor="marketing"
                      className="text-sm leading-none"
                    >
                      <span className="font-medium">Receive Marketing Emails</span>
                      <p className="text-muted-foreground mt-1">
                        Get exclusive offers, product updates, and promotions. You can unsubscribe anytime.
                      </p>
                    </label>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? 'Processing...' : 'Continue to Checkout'}
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{' '}
                      <a href="/login" className="text-primary hover:underline">Sign in</a>
                    </p>
                  </div>
                </div>
              </form>

              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <p className="text-sm font-medium text-blue-900">Why create an account?</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Track your orders easily</li>
                  <li>• Save multiple shipping addresses</li>
                  <li>• Get faster checkout next time</li>
                  <li>• Access order history and returns</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
