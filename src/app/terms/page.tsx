'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', title: 'Overview' },
    { id: 'account', title: 'Account & Registration' },
    { id: 'products', title: 'Products & Services' },
    { id: 'orders', title: 'Orders & Payments' },
    { id: 'shipping', title: 'Shipping' },
    { id: 'returns', title: 'Returns & Refunds' },
    { id: 'intellectual', title: 'Intellectual Property' },
    { id: 'limitation', title: 'Limitation of Liability' },
    { id: 'governing', title: 'Governing Law' },
    { id: 'contact', title: 'Contact' },
  ]

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Terms & Conditions
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
                  <CardContent className="pt-6 space-y-4 text-muted-foreground text-sm">
                    <p>
                      Welcome to CyberShop. By accessing or using our website and services, you agree to be bound by these Terms and Conditions. Please read them carefully.
                    </p>
                    <p>
                      These Terms apply to all visitors, users, and others who access or use our services. If you do not agree with any part of these Terms, you must not access or use our services.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Account & Registration */}
              <section id="account" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4">Account & Registration</h2>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <p className="text-muted-foreground text-sm">
                      To access certain features of our website, you must register for an account. You agree to:
                    </p>
                    <ul className="space-y-2 text-muted-foreground text-sm ml-4">
                      <li>• Provide accurate, current, and complete information</li>
                      <li>• Maintain and update your account information</li>
                      <li>• Keep your password secure and confidential</li>
                      <li>• Accept responsibility for all activities under your account</li>
                      <li>• Notify us immediately of any unauthorized use</li>
                    </ul>
                    <p className="text-muted-foreground text-sm">
                      We reserve the right to suspend or terminate your account for violation of these Terms.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Products & Services */}
              <section id="products" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4">Products & Services</h2>
                <Card>
                  <CardContent className="pt-6 space-y-4 text-muted-foreground text-sm">
                    <p>
                      We strive to display accurate product information, including descriptions, images, and specifications. However, we do not warrant that:
                    </p>
                    <ul className="space-y-2 ml-4">
                      <li>• Product descriptions or other content are error-free</li>
                      <li>• Products will meet your expectations or requirements</li>
                      <li>• Colors displayed on our site are accurate</li>
                    </ul>
                    <p>
                      We reserve the right to limit sales of our products or services, correct errors, and update information at any time without prior notice.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Orders & Payments */}
              <section id="orders" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4">Orders & Payments</h2>
                <Card>
                  <CardContent className="pt-6 space-y-4 text-muted-foreground text-sm">
                    <p>
                      By placing an order, you offer to purchase products from us. We reserve the right to accept or decline your order for any reason.
                    </p>
                    <p>
                      Payment is required at the time of purchase. We accept major credit cards, PayPal, and other payment methods as displayed on our website.
                    </p>
                    <p>
                      All prices are in USD and are subject to change without notice. We are not responsible for typographical errors.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Shipping */}
              <section id="shipping" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4">Shipping</h2>
                <Card>
                  <CardContent className="pt-6 space-y-4 text-muted-foreground text-sm">
                    <p>
                      Shipping times and costs vary by location and shipping method selected. Estimated delivery dates are not guaranteed.
                    </p>
                    <p>
                      We offer free shipping on orders over $50 within the contiguous United States. International shipping is available with varying costs and delivery times.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Returns & Refunds */}
              <section id="returns" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4">Returns & Refunds</h2>
                <Card>
                  <CardContent className="pt-6 space-y-4 text-muted-foreground text-sm">
                    <p>
                      We offer a 30-day return policy for most products. To be eligible for a return, the item must be:
                    </p>
                    <ul className="space-y-2 ml-4">
                      <li>• Unused and in the same condition as received</li>
                      <li>• In original packaging</li>
                      <li>• Accompanied by proof of purchase</li>
                    </ul>
                    <p>
                      See our Returns & Refunds Policy for detailed information.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Intellectual Property */}
              <section id="intellectual" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
                <Card>
                  <CardContent className="pt-6 space-y-4 text-muted-foreground text-sm">
                    <p>
                      All content on this website, including text, graphics, logos, images, and software, is the property of CyberShop or its content suppliers and is protected by copyright laws.
                    </p>
                    <p>
                      You may not use, reproduce, modify, or distribute any content from this website without our prior written consent.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Limitation of Liability */}
              <section id="limitation" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
                <Card>
                  <CardContent className="pt-6 text-muted-foreground text-sm">
                    <p className="mb-4">
                      To the maximum extent permitted by law, CyberShop shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses, resulting from:
                    </p>
                    <ul className="space-y-2 ml-4">
                      <li>• Your use or inability to use our services</li>
                      <li>• Any unauthorized access to or use of our servers</li>
                      <li>• Any bugs, viruses, or harmful code that may be transmitted to our site</li>
                      <li>• Errors or omissions in any content</li>
                    </ul>
                  </CardContent>
                </Card>
              </section>

              {/* Governing Law */}
              <section id="governing" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
                <Card>
                  <CardContent className="pt-6 text-muted-foreground text-sm">
                    <p>
                      These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
                    </p>
                    <p className="mt-4">
                      Any disputes arising under these Terms shall be resolved in the courts of California.
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
                      If you have questions about these Terms & Conditions, please contact us:
                    </p>
                    <ul className="space-y-2">
                      <li><strong>Email:</strong> legal@cybershop.com</li>
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
