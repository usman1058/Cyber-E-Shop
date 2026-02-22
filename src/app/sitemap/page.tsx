'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link';
import { Home, ShoppingBag, FileText, HelpCircle, Users, Building2, Map, BookOpen, SeparatorHorizontal } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function SitemapPage() {
  const sections = [
    {
      title: 'Shop',
      icon: ShoppingBag,
      items: [
        { name: 'All Products', href: '/category/electronics' },
        { name: 'Deals & Offers', href: '/deals' },
        { name: 'New Arrivals', href: '/new-arrivals' },
        { name: 'Best Sellers', href: '/best-sellers' },
        { name: 'All Brands', href: '/brands' },
      ],
    },
    {
      title: 'Categories',
      icon: ShoppingBag,
      items: [
        { name: 'Electronics', href: '/category/electronics' },
        { name: 'Computers', href: '/category/computers' },
        { name: 'Mobile', href: '/category/mobile' },
        { name: 'Gaming', href: '/category/gaming' },
        { name: 'Audio', href: '/category/audio' },
        { name: 'Accessories', href: '/category/accessories' },
      ],
    },
    {
      title: 'Information',
      icon: FileText,
      items: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Blog', href: '/blog' },
        { name: 'Store Locations', href: '/locations' },
        { name: 'Contact Us', href: '/contact' },
      ],
    },
    {
      title: 'Customer Service',
      icon: HelpCircle,
      items: [
        { name: 'Help Center', href: '/help' },
        { name: 'Track Order', href: '/track-order' },
        { name: 'Returns & Refunds', href: '/returns' },
        { name: 'Shipping Info', href: '/shipping' },
        { name: 'Warranty', href: '/warranty' },
      ],
    },
    {
      title: 'Account',
      icon: Users,
      items: [
        { name: 'My Account', href: '/account' },
        { name: 'Login', href: '/login' },
        { name: 'Register', href: '/register' },
        { name: 'Order History', href: '/account/orders' },
        { name: 'Wishlist', href: '/wishlist' },
      ],
    },
    {
      title: 'Policies',
      icon: FileText,
      items: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms & Conditions', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookie' },
        { name: 'Security', href: '/security' },
      ],
    },
  ]

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Sitemap
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Navigate through CyberShop's website structure. Find all our pages and sections quickly and easily.
            </p>
          </div>

          {/* Sitemap Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {sections.map((section) => (
              <Card key={section.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <section.icon className="h-5 w-5 text-primary" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Links */}
          <div className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Get Started</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link href="/" className="text-muted-foreground hover:text-primary">
                          Home Page
                        </Link>
                      </li>
                      <li>
                        <Link href="/category/electronics" className="text-muted-foreground hover:text-primary">
                          Browse Products
                        </Link>
                      </li>
                      <li>
                        <Link href="/deals" className="text-muted-foreground hover:text-primary">
                          View Deals
                        </Link>
                      </li>
                      <li>
                        <Link href="/register" className="text-muted-foreground hover:text-primary">
                          Create Account
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Popular Pages</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link href="/new-arrivals" className="text-muted-foreground hover:text-primary">
                          New Arrivals
                        </Link>
                      </li>
                      <li>
                        <Link href="/best-sellers" className="text-muted-foreground hover:text-primary">
                          Best Sellers
                        </Link>
                      </li>
                      <li>
                        <Link href="/blog" className="text-muted-foreground hover:text-primary">
                          Tech Blog
                        </Link>
                      </li>
                      <li>
                        <Link href="/contact" className="text-muted-foreground hover:text-primary">
                          Contact Support
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="my-8">
              <Separator />
            </div>
          </div>

          {/* Help Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Can't Find What You're Looking For?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="text-sm text-muted-foreground max-w-2xl">
                    <p>
                      If you can't find the page you're looking for, try using our search function or contact our customer support team for assistance.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link href="/search">
                      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                        Search Site
                      </button>
                    </Link>
                    <Link href="/contact">
                      <button className="px-4 py-2 border border-input rounded-md text-sm font-medium hover:bg-accent transition-colors">
                        Contact Us
                      </button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>
              Last updated: {new Date().toLocaleDateString()} | CyberShop
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
