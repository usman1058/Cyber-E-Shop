'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Truck, Globe, Clock, Package } from 'lucide-react'

export default function ShippingPage() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Shipping Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Overview */}
          <div className="mb-8">
            <div className="bg-muted/50 rounded-lg p-6 flex gap-4 items-start">
              <Truck className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold mb-2">Fast & Reliable Shipping</h2>
                <p className="text-sm text-muted-foreground">
                  We offer multiple shipping options to meet your needs. Free standard shipping on orders over $50 within the contiguous United States.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Domestic Shipping */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Domestic Shipping (USA)</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 font-semibold">Method</th>
                          <th className="text-left py-3 px-2 font-semibold">Cost</th>
                          <th className="text-left py-3 px-2 font-semibold">Delivery Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 px-2">Standard Shipping</td>
                          <td className="py-3 px-2">Free (orders $50+)<br /><span className="text-xs text-muted-foreground">$5.99 (orders under $50)</span></td>
                          <td className="py-3 px-2">5-7 business days</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-2">Express Shipping</td>
                          <td className="py-3 px-2">$12.99</td>
                          <td className="py-3 px-2">2-3 business days</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-2">Overnight Shipping</td>
                          <td className="py-3 px-2">$24.99</td>
                          <td className="py-3 px-2">1 business day</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* International Shipping */}
            <section>
              <h2 className="text-2xl font-bold mb-4">International Shipping</h2>
              <Card>
                <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Available Destinations</h3>
                      <p>
                        We ship to over 50 countries worldwide. Shipping is calculated at checkout based on your location and order weight.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-2">International Delivery Times:</p>
                    <ul className="space-y-1 ml-4">
                      <li>• Canada: 7-10 business days</li>
                      <li>• Europe: 10-14 business days</li>
                      <li>• Australia: 10-14 business days</li>
                      <li>• Asia: 10-14 business days</li>
                      <li>• Other regions: 14-21 business days</li>
                    </ul>
                  </div>

                  <div className="mt-4">
                    <p className="font-medium">Important Notes:</p>
                    <ul className="mt-2 space-y-1 ml-4">
                      <li>• International orders may be subject to customs duties and taxes</li>
                      <li>• Recipient is responsible for all import fees</li>
                      <li>• Some products may not be eligible for international shipping</li>
                      <li>• Delivery times exclude customs processing</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Order Processing */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Order Processing</h2>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Processing Time</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Orders are typically processed within 1-2 business days. You'll receive a confirmation email with tracking information once shipped.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm">
                      <strong>Note:</strong> Orders placed on weekends or holidays will be processed the next business day. Pre-orders ship according to their specified release dates.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Shipping Restrictions */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Shipping Restrictions</h2>
              <Card>
                <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
                  <p className="font-medium">Items we cannot ship:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• Large appliances (over 150 lbs)</li>
                    <li>• Hazardous materials</li>
                    <li>• Items requiring special handling</li>
                  </ul>
                  
                  <p className="font-medium mt-4">Locations we cannot ship to:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• P.O. Boxes (for express shipping)</li>
                    <li>• APO/FPO addresses (for some products)</li>
                    <li>• Some international destinations</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Tracking Your Order */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Tracking Your Order</h2>
              <Card>
                <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">How to Track</h3>
                      <ul className="space-y-1 ml-4">
                        <li>• Log into your account and view order history</li>
                        <li>• Use the tracking number in your shipping confirmation email</li>
                        <li>• Visit our order tracking page and enter your order number</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* In-Store Pickup */}
            <section>
              <h2 className="text-2xl font-bold mb-4">In-Store Pickup</h2>
              <Card>
                <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
                  <p>
                    Select in-store pickup at checkout for select locations. You'll receive an email when your order is ready for pickup, typically within 2-4 hours.
                  </p>
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-2">Pickup Requirements:</p>
                    <ul className="space-y-1 ml-4">
                      <li>• Bring your order confirmation email or ID</li>
                      <li>• The person picking up must be the account holder</li>
                      <li>• Orders held for 7 days, then returned</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Lost or Delayed Shipments */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Lost or Delayed Shipments</h2>
              <Card>
                <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
                  <p>
                    If your shipment is delayed beyond the expected delivery date or appears to be lost:
                  </p>
                  <ul className="space-y-1 ml-4">
                    <li>• Check your tracking status</li>
                    <li>• Contact the carrier directly</li>
                    <li>• Reach out to our customer service team for assistance</li>
                  </ul>
                  <p className="mt-4">
                    We'll work with the carrier to locate your package. If it cannot be found, we'll send a replacement or issue a full refund.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
              <Card>
                <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
                  <p>Have questions about shipping? Our team is here to help.</p>
                  <ul className="space-y-2">
                    <li><strong>Email:</strong> shipping@cybershop.com</li>
                    <li><strong>Phone:</strong> +1 (800) 123-4567</li>
                    <li><strong>Hours:</strong> 24/7 support available</li>
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
