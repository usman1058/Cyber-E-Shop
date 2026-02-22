'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Mail, CheckCircle, Gift, Bell, Zap } from 'lucide-react'
import { useState } from 'react'

export default function NewsletterPage() {
  const [email, setEmail] = useState('')
  const [preferences, setPreferences] = useState({
    deals: true,
    newProducts: true,
    techNews: true,
    reviews: false,
  })
  const [frequency, setFrequency] = useState('weekly')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          preferences: {
            categories: Object.keys(preferences).filter(k => preferences[k as keyof typeof preferences]),
          },
          frequency,
        }),
      })

      if (res.ok) {
        setSubmitted(true)
      }
    } catch (error) {
      console.error('Error subscribing:', error)
      alert('Failed to subscribe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Stay in the Loop
            </h1>
            <p className="text-lg text-muted-foreground">
              Get exclusive deals, new product alerts, and tech insights delivered to your inbox.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {submitted ? (
            /* Success State */
            <Card>
              <CardContent className="p-12 text-center">
                <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-4">
                  You're Subscribed!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for subscribing to the CyberShop newsletter. You'll receive your first email shortly.
                </p>
                <div className="bg-muted/50 rounded-lg p-6 text-left max-w-md mx-auto">
                  <h3 className="font-semibold mb-3">What's Next?</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Check your email for a confirmation link</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Click the link to confirm your subscription</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Start receiving exclusive deals and updates</span>
                    </li>
                  </ul>
                </div>
                <Button
                  onClick={() => {
                    setSubmitted(false)
                    setEmail('')
                    setPreferences({ deals: true, newProducts: true, techNews: true, reviews: false })
                  }}
                >
                  Subscribe Another Email
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Subscription Form */
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Benefits */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Why Subscribe?</h2>
                  <p className="text-muted-foreground mb-6">
                    Join thousands of tech enthusiasts who never miss a deal or update.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      icon: Gift,
                      title: 'Exclusive Deals',
                      desc: 'Get early access to sales and member-only discounts.',
                    },
                    {
                      icon: Bell,
                      title: 'New Product Alerts',
                      desc: 'Be the first to know when new products arrive.',
                    },
                    {
                      icon: Zap,
                      title: 'Tech Insights',
                      desc: 'Expert tips, reviews, and industry news.',
                    },
                  ].map((benefit, index) => (
                    <Card key={index}>
                      <CardContent className="p-4 flex gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <benefit.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{benefit.title}</h3>
                          <p className="text-xs text-muted-foreground">{benefit.desc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-primary/5">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">No Spam, Ever</h3>
                    <p className="text-sm text-muted-foreground">
                      We respect your inbox. You can unsubscribe at any time with one click.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Form */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-6">Subscribe Now</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12"
                      />
                    </div>

                    <div>
                      <Label className="mb-4 block">What would you like to receive?</Label>
                      <div className="space-y-3">
                        {[
                          { key: 'deals', label: 'Flash Deals & Promotions', icon: Gift },
                          { key: 'newProducts', label: 'New Product Announcements', icon: Bell },
                          { key: 'techNews', label: 'Tech News & Reviews', icon: Zap },
                          { key: 'reviews', label: 'Customer Reviews', icon: CheckCircle },
                        ].map((item) => (
                          <label key={item.key} className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <Checkbox
                              id={item.key}
                              checked={preferences[item.key as keyof typeof preferences]}
                              onCheckedChange={(checked) =>
                                setPreferences({ ...preferences, [item.key]: checked })
                              }
                              className="mt-0.5"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <item.icon className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium text-sm">{item.label}</span>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="frequency">Email Frequency *</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {[
                          { value: 'daily', label: 'Daily' },
                          { value: 'weekly', label: 'Weekly' },
                          { value: 'monthly', label: 'Monthly' },
                        ].map((freq) => (
                          <button
                            key={freq.value}
                            type="button"
                            onClick={() => setFrequency(freq.value)}
                            className={`p-3 rounded-lg text-sm font-medium transition-all ${
                              frequency === freq.value
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted hover:bg-muted/80'
                            }`}
                          >
                            {freq.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                      <p className="text-xs text-muted-foreground">
                        By subscribing, you agree to our{' '}
                        <a href="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </a>{' '}
                        and consent to receive marketing emails. You can unsubscribe at any time.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full"
                      size="lg"
                    >
                      {loading ? 'Processing...' : 'Subscribe Now'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="mt-12 py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Easy Unsubscribe</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>No Spam Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
