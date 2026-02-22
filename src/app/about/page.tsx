'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Target, Eye, Heart, Users, Award, Shield } from 'lucide-react'

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To make cutting-edge technology accessible to everyone while providing exceptional customer service and support.',
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description: 'To be the world\'s most trusted technology retailer, known for quality products, competitive prices, and customer satisfaction.',
    },
    {
      icon: Heart,
      title: 'Our Values',
      description: 'Customer-first approach, innovation, integrity, and continuous improvement in everything we do.',
    },
  ]

  const stats = [
    { value: '500K+', label: 'Happy Customers' },
    { value: '10K+', label: 'Products' },
    { value: '100+', label: 'Top Brands' },
    { value: '50+', label: 'Countries Served' },
    { value: '24/7', label: 'Support Available' },
    { value: '99%', label: 'Satisfaction Rate' },
  ]

  const certifications = [
    'ISO 9001 Certified',
    'SSL Secured',
    'PCI DSS Compliant',
    'GDPR Compliant',
    'TRUSTe Certified',
    'BBB Accredited',
  ]

  const team = [
    { name: 'John Smith', role: 'CEO & Founder', image: '/images/team/ceo.jpg' },
    { name: 'Sarah Johnson', role: 'CTO', image: '/images/team/cto.jpg' },
    { name: 'Michael Chen', role: 'COO', image: '/images/team/coo.jpg' },
    { name: 'Emily Davis', role: 'VP of Customer Experience', image: '/images/team/vp-cx.jpg' },
  ]

  return (
    <PageLayout>
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl">
            <Badge className="mb-4">Since 2015</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About CyberShop
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              We're more than just an online store. We're a team of tech enthusiasts dedicated to bringing you the best technology products at competitive prices, backed by exceptional customer service.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2015 by a group of passionate technology enthusiasts, CyberShop started with a simple mission: to make quality technology accessible to everyone.
                </p>
                <p>
                  What began as a small online store has grown into a leading technology retailer, serving over 500,000 customers across 50+ countries. Our journey has been built on trust, quality, and an unwavering commitment to customer satisfaction.
                </p>
                <p>
                  Today, we continue to innovate and expand our product offerings while maintaining the personal touch that sets us apart. Every member of our team shares a passion for technology and a dedication to helping you find the perfect products for your needs.
                </p>
              </div>
            </div>
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
              <div className="text-6xl font-bold text-primary/20">CS</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Drives Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our core principles guide every decision we make and every interaction we have with our customers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose CyberShop?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We go above and beyond to ensure your shopping experience is exceptional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Quality Guarantee', desc: 'All products are authentic and backed by manufacturer warranties.' },
              { icon: Users, title: 'Expert Support', desc: 'Our team of tech experts is available 24/7 to help you.' },
              { icon: Award, title: 'Best Prices', desc: 'We offer competitive prices and regular promotions and deals.' },
              { icon: Target, title: 'Fast Shipping', desc: 'Free shipping on orders over $50 with quick delivery times.' },
              { icon: Heart, title: 'Easy Returns', desc: '30-day hassle-free return policy with no questions asked.' },
              { icon: Eye, title: 'Secure Shopping', desc: 'Your data is protected with industry-standard security measures.' },
            ].map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Certifications & Trust</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We maintain the highest standards of security, quality, and compliance.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {certifications.map((cert, index) => (
              <Badge key={index} variant="outline" className="px-4 py-2 text-base">
                {cert}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind CyberShop's success.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary/30">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
