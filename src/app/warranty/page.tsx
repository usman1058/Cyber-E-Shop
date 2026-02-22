'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, Clock, FileText, CheckCircle } from 'lucide-react'

export default function WarrantyPage() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Warranty Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Overview */}
          <div className="mb-8">
            <div className="bg-muted/50 rounded-lg p-6 flex gap-4 items-start">
              <Shield className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold mb-2">Manufacturer Warranty Coverage</h2>
                <p className="text-sm text-muted-foreground">
                  Most products sold at CyberShop are covered by manufacturer warranties. Coverage periods and terms vary by product and manufacturer.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Standard Warranty */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Standard Warranty Coverage</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Coverage Periods</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><strong>Electronics:</strong> 1-2 years</li>
                        <li><strong>Computers & Laptops:</strong> 1-3 years</li>
                        <li><strong>Mobile Devices:</strong> 1-2 years</li>
                        <li><strong>Accessories:</strong> 90 days - 1 year</li>
                        <li><strong>Gaming Consoles:</strong> 1-2 years</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">What's Covered</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Manufacturing defects</li>
                        <li>• Component failures</li>
                        <li>• Non-physical damage malfunctions</li>
                        <li>• Hardware issues under normal use</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Extended Warranty */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Extended Warranty</h2>
              <Card>
                <CardContent className="pt-6 space-y-4 text-muted-foreground text-sm">
                  <p>
                    We offer extended warranty options for most products, providing additional protection beyond the standard manufacturer warranty.
                  </p>
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-2">Extended warranty benefits:</p>
                    <ul className="space-y-1 ml-4">
                      <li>• Extended coverage up to 5 years</li>
                      <li>• Accidental damage protection</li>
                      <li>• Priority repair service</li>
                      <li>• Free shipping for repairs</li>
                      <li>• 24/7 dedicated support line</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* What's Not Covered */}
            <section>
              <h2 className="text-2xl font-bold mb-4">What's Not Covered</h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 text-xs">×</span>
                      </div>
                      <span>Physical damage from drops, impacts, or accidents</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 text-xs">×</span>
                      </div>
                      <span>Liquid damage or exposure to moisture</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 text-xs">×</span>
                      </div>
                      <span>Unauthorized repairs or modifications</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 text-xs">×</span>
                      </div>
                      <span>Normal wear and tear</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 text-xs">×</span>
                      </div>
                      <span>Damage from misuse, abuse, or neglect</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 text-xs">×</span>
                      </div>
                      <span>Lost or stolen items</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Making a Warranty Claim */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Making a Warranty Claim</h2>
              <Card>
                <CardContent className="pt-6">
                  <ol className="space-y-6">
                    {[
                      { step: 1, title: 'Prepare Proof of Purchase', desc: 'Locate your order confirmation email or receipt.' },
                      { step: 2, title: 'Document the Issue', desc: 'Take clear photos or videos of the problem.' },
                      { step: 3, title: 'Contact Support', desc: 'Submit a warranty claim through your account or contact our support team.' },
                      { step: 4, title: 'Await Approval', desc: 'Our team will review your claim within 24-48 hours.' },
                      { step: 5, title: 'Return or Repair', desc: 'Follow the provided instructions for repair or replacement.' },
                    ].map((item) => (
                      <li key={item.step} className="flex gap-4">
                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-semibold">
                          {item.step}
                        </div>
                        <div>
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </section>

            {/* CyberShop Guarantee */}
            <section>
              <h2 className="text-2xl font-bold mb-4">CyberShop Guarantee</h2>
              <Card className="bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-8 w-8 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">30-Day Money-Back Guarantee</h3>
                      <p className="text-sm text-muted-foreground">
                        In addition to manufacturer warranties, we offer a 30-day money-back guarantee on all products. If you're not completely satisfied, return it for a full refund—no questions asked.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Warranty Support</h2>
              <Card>
                <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
                  <p>Need help with a warranty claim? Our team is ready to assist you.</p>
                  <ul className="space-y-2">
                    <li><strong>Email:</strong> warranty@cybershop.com</li>
                    <li><strong>Phone:</strong> +1 (800) 123-4567</li>
                    <li><strong>Hours:</strong> Monday - Friday, 9AM - 6PM PST</li>
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
