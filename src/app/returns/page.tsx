'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { Card, CardContent } from '@/components/ui/card'
import { RotateCcw, Package, Clock, AlertCircle } from 'lucide-react'

export default function ReturnsPage() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Return & Refund Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Overview */}
          <div className="mb-8">
            <div className="bg-muted/50 rounded-lg p-6 flex gap-4 items-start">
              <RotateCcw className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold mb-2">30-Day Hassle-Free Returns</h2>
                <p className="text-sm text-muted-foreground">
                  We want you to be completely satisfied with your purchase. If you're not happy, we're here to help with our easy return process.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Return Eligibility */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Return Eligibility</h2>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Requirements</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Items must be returned within 30 days of delivery, in original condition, unused, with all tags and original packaging.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium mb-2">Non-returnable items:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Personal care items (headphones, earbuds)</li>
                      <li>• Software and downloadable products</li>
                      <li>• Gift cards</li>
                      <li>• Customized or personalized items</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Return Process */}
            <section>
              <h2 className="text-2xl font-bold mb-4">How to Return</h2>
              <Card>
                <CardContent className="pt-6">
                  <ol className="space-y-6">
                    {[
                      { step: 1, title: 'Initiate Return', desc: 'Log into your account, go to Orders, and select the item you wish to return.' },
                      { step: 2, title: 'Select Reason', desc: 'Choose a reason for return from the dropdown menu and submit your request.' },
                      { step: 3, title: 'Print Label', desc: 'We\'ll email you a prepaid return shipping label. Print and attach it to your package.' },
                      { step: 4, title: 'Ship Item', desc: 'Drop off the package at any authorized shipping location.' },
                      { step: 5, title: 'Receive Refund', desc: 'Once received and inspected, we\'ll process your refund within 5-7 business days.' },
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

            {/* Refund Process */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Refund Information</h2>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Processing Time</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Refunds are processed within 5-7 business days after we receive and inspect your return.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <p><strong>Credit Card:</strong> 5-7 business days to your account</p>
                    <p><strong>PayPal:</strong> 3-5 business days</p>
                    <p><strong>Store Credit:</strong> Immediate</p>
                  </div>

                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm">
                      Shipping costs are non-refundable unless the return is due to our error or defective product.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Exchanges */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Exchanges</h2>
              <Card>
                <CardContent className="pt-6 space-y-4 text-muted-foreground text-sm">
                  <p>
                    We only exchange items for the same product in a different size, color, or configuration if available.
                  </p>
                  <p>
                    For different products, please return your original item for a refund and place a new order.
                  </p>
                  <p className="font-medium">
                    Damaged or defective items may be exchanged at no additional cost.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Damaged/Defective Items */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Damaged or Defective Items</h2>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold">What to Do</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        If your item arrives damaged or defective, contact us within 48 hours of delivery. We'll arrange for a free replacement or refund.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>Required:</strong> Photos of the damage and packaging
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
              <Card>
                <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
                  <p>If you have questions about returns or need assistance, our customer service team is here to help.</p>
                  <ul className="space-y-2">
                    <li><strong>Email:</strong> returns@cybershop.com</li>
                    <li><strong>Phone:</strong> +1 (800) 123-4567</li>
                    <li><strong>Live Chat:</strong> Available 24/7</li>
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
