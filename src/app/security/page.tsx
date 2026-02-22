'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Lock, CheckCircle, AlertTriangle } from 'lucide-react'

export default function SecurityPage() {
  const securityFeatures = [
    '256-bit SSL Encryption',
    'PCI DSS Level 1 Compliance',
    'Tokenized Payment Processing',
    'Fraud Detection System',
    'Two-Factor Authentication',
    'Regular Security Audits',
    'Secure Data Centers',
    'GDPR Compliance',
  ]

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Trust & Security
            </h1>
            <p className="text-muted-foreground">
              Your security is our top priority. Learn how we protect your information.
            </p>
          </div>

          {/* Trust Banner */}
          <div className="mb-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <Shield className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold mb-2">Bank-Level Security</h2>
                <p className="text-sm text-muted-foreground">
                  We use industry-standard security measures to protect your personal and payment information. Your data is encrypted and stored securely.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Security Features */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Our Security Measures</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {securityFeatures.map((feature) => (
                      <div key={feature} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Data Protection */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Data Protection</h2>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Encryption</h3>
                      <p className="text-sm text-muted-foreground">
                        All data transmitted between your browser and our servers is encrypted using 256-bit SSL technology. This is the same level of security used by major banks.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Secure Storage</h3>
                      <p className="text-sm text-muted-foreground">
                        Your personal information is stored in secure, access-controlled data centers. We implement multiple layers of security to prevent unauthorized access.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Payment Security</h3>
                      <p className="text-sm text-muted-foreground">
                        We never store your full credit card number. Payment information is tokenized, meaning only a secure token is stored on our servers.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Payment Security */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Payment Security</h2>
              <Card>
                <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
                  <p className="mb-4">
                    We accept and secure the following payment methods:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Visa', 'Mastercard', 'American Express', 'Discover', 'PayPal', 'Apple Pay', 'Google Pay'].map((method) => (
                      <Badge key={method} variant="outline" className="px-3 py-1.5">
                        {method}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-2">PCI DSS Level 1 Certified</p>
                    <p className="text-xs">
                      Our payment processing meets the highest security standards set by the Payment Card Industry Data Security Standard (PCI DSS).
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Fraud Protection */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Fraud Protection</h2>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Advanced Fraud Detection</h3>
                      <p className="text-sm text-muted-foreground">
                        We use sophisticated fraud detection systems to identify and prevent fraudulent transactions. Suspicious activity is automatically flagged for review.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <p><strong>Zero Liability:</strong> You're protected against unauthorized charges.</p>
                    <p><strong>Verification:</strong> Additional verification may be required for high-risk transactions.</p>
                    <p><strong>Monitoring:</strong> Continuous monitoring for unusual account activity.</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Account Security */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Account Security Tips</h2>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold mb-2">How to protect your account:</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Use a strong, unique password with at least 12 characters</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Enable two-factor authentication (2FA)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Don't share your password with anyone</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Use a secure, private network when shopping</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Keep your browser and software updated</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Monitor your account for suspicious activity</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Privacy */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Your Privacy</h2>
              <Card>
                <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
                  <p>
                    We respect your privacy and are committed to protecting your personal information. For detailed information about how we collect, use, and protect your data, please review our:
                  </p>
                  <ul className="space-y-2">
                    <li>• <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a></li>
                    <li>• <a href="/terms" className="text-primary hover:underline">Terms & Conditions</a></li>
                    <li>• <a href="/cookie" className="text-primary hover:underline">Cookie Policy</a></li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Compliance */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Compliance & Certifications</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      'ISO 27001:2013',
                      'SOC 2 Type II',
                      'GDPR Compliant',
                      'CCPA Compliant',
                      'PCI DSS Level 1',
                      'TRUSTe Certified',
                    ].map((cert) => (
                      <div key={cert} className="p-4 bg-muted/50 rounded-lg text-center">
                        <p className="font-semibold text-sm">{cert}</p>
                        <p className="text-xs text-muted-foreground mt-1">Certified</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Report a Security Issue</h2>
              <Card>
                <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
                  <p>
                    If you discover a security vulnerability or suspect suspicious activity, please report it immediately:
                  </p>
                  <ul className="space-y-2">
                    <li><strong>Email:</strong> security@cybershop.com</li>
                    <li><strong>Response Time:</strong> Within 24 hours</li>
                  </ul>
                  <p className="mt-4">
                    We investigate all reports and take appropriate action to address security concerns.
                  </p>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
