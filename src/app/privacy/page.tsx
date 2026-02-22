'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useState } from 'react'

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', title: 'Overview' },
    { id: 'collection', title: 'Data Collection' },
    { id: 'usage', title: 'How We Use Your Data' },
    { id: 'sharing', title: 'Data Sharing' },
    { id: 'security', title: 'Data Security' },
    { id: 'rights', title: 'Your Rights' },
    { id: 'cookies', title: 'Cookies' },
    { id: 'contact', title: 'Contact Us' },
  ]

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Table of Contents */}
            <aside className="md:col-span-1">
              <div className="sticky top-24">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-4">Contents</h3>
                    <nav className="space-y-2">
                      {sections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => {
                            setActiveSection(section.id)
                            document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                            activeSection === section.id
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                        >
                          {section.title}
                        </button>
                      ))}
                    </nav>
                  </CardContent>
                </Card>
              </div>
            </aside>

            {/* Content */}
            <main className="md:col-span-3 space-y-8">
              {/* Overview */}
              <section id="overview" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <Card>
                  <CardContent className="pt-6 space-y-4 text-muted-foreground">
                    <p>
                      CyberShop ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
                    </p>
                    <p>
                      By using our services, you agree to the collection and use of information in accordance with this policy. If you disagree with any part of this policy, please do not use our website.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Data Collection */}
              <section id="collection" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4">Data Collection</h2>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Personal Information</h3>
                      <p className="text-muted-foreground text-sm">
                        We collect information you provide directly, including name, email, phone number, shipping/billing addresses, and payment information.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Usage Data</h3>
                      <p className="text-muted-foreground text-sm">
                        We automatically collect information about your device, browsing actions, and patterns, including IP address, browser type, and referring/exit pages.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Cookies</h3>
                      <p className="text-muted-foreground text-sm">
                        We use cookies and similar tracking technologies to track activity on our website and hold certain information.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* How We Use Your Data */}
              <section id="usage" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4">How We Use Your Data</h2>
                <Card>
                  <CardContent className="pt-6">
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li>• Process and fulfill your orders</li>
                      <li>• Send order confirmations and shipping updates</li>
                      <li>• Provide customer support</li>
                      <li>• Send marketing communications (with your consent)</li>
                      <li>• Improve our website and services</li>
                      <li>• Detect and prevent fraud</li>
                      <li>• Comply with legal obligations</li>
                    </ul>
                  </CardContent>
                </Card>
              </section>

              {/* Data Sharing */}
              <section id="sharing" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4">Data Sharing</h2>
                <Card>
                  <CardContent className="pt-6 space-y-4 text-muted-foreground text-sm">
                    <p>
                      We may share your information with:
                    </p>
                    <ul className="space-y-2 ml-4">
                      <li>• Service providers who assist in operating our website</li>
                      <li>• Payment processors to process transactions</li>
                      <li>• Shipping partners to deliver orders</li>
                      <li>• Analytics providers to improve our services</li>
                    </ul>
                    <p className="font-medium">
                      We do not sell your personal information to third parties.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Data Security */}
              <section id="security" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4">Data Security</h2>
                <Card>
                  <CardContent className="pt-6 text-muted-foreground text-sm">
                    <p className="mb-4">
                      We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                    </p>
                    <p className="mb-4">
                      However, no method of transmission over the Internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Your Rights */}
              <section id="rights" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground text-sm mb-4">
                      Depending on your location, you may have the following rights:
                    </p>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li>• Access to your personal data</li>
                      <li>• Correction of inaccurate data</li>
                      <li>• Deletion of your data (subject to legal requirements)</li>
                      <li>• Restriction of processing</li>
                      <li>• Data portability</li>
                      <li>• Objection to processing</li>
                      <li>• Withdrawal of consent</li>
                    </ul>
                  </CardContent>
                </Card>
              </section>

              {/* Cookies */}
              <section id="cookies" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4">Cookies</h2>
                <Card>
                  <CardContent className="pt-6 space-y-4 text-muted-foreground text-sm">
                    <p>
                      We use various types of cookies:
                    </p>
                    <ul className="space-y-2 ml-4">
                      <li>• <strong>Essential cookies:</strong> Required for the website to function</li>
                      <li>• <strong>Performance cookies:</strong> Help us analyze website traffic</li>
                      <li>• <strong>Functionality cookies:</strong> Remember your preferences</li>
                      <li>• <strong>Targeting cookies:</strong> Used for marketing purposes</li>
                    </ul>
                    <p>
                      You can manage your cookie preferences through your browser settings or our cookie consent banner.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Contact */}
              <section id="contact" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <Card>
                  <CardContent className="pt-6 space-y-4 text-muted-foreground text-sm">
                    <p>
                      If you have questions about this Privacy Policy, please contact us:
                    </p>
                    <ul className="space-y-2">
                      <li><strong>Email:</strong> privacy@cybershop.com</li>
                      <li><strong>Phone:</strong> +1 (800) 123-4567</li>
                      <li><strong>Address:</strong> 123 Cyber Street, Tech City, CA 90210, USA</li>
                    </ul>
                  </CardContent>
                </Card>
              </section>
            </main>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
