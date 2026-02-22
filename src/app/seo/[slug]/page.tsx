'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { ProductCard } from '@/components/shop/product-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle2, TrendingUp, Star } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function SEOLandingPage() {
  const params = useParams()
  const slug = params.slug as string

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [seoData, setSeoData] = useState<any>(null)

  useEffect(() => {
    fetchSEOLandingData()
  }, [slug])

  const fetchSEOLandingData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/products?category=${slug}&limit=12`)
      const data = await res.json()
      setProducts(data.products || [])

      const seoInfo = generateSEOData(slug)
      setSeoData(seoInfo)

      document.title = seoInfo.metaTitle
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', seoInfo.metaDescription)
      }
    } catch (error) {
      console.error('Error fetching SEO landing data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSEOData = (slug: string) => {
    const seoTemplates: Record<string, any> = {
      'wireless-headphones': {
        title: 'Best Wireless Headphones 2024 | Noise Cancelling & Premium Audio',
        description: 'Discover top-rated wireless headphones with active noise cancellation. Shop Bose, Sony, and more. Expert reviews, best prices, free shipping on orders over $50.',
        keywords: 'wireless headphones, noise cancelling, bluetooth headphones, audiophile, premium audio',
        heading: 'Wireless Headphones Collection',
        subheading: 'Experience pure sound with the best noise-cancelling headphones',
        features: [
          'Active Noise Cancellation',
          '30+ Hour Battery Life',
          'Premium Audio Quality',
          'Comfortable Design',
        ],
      },
      'gaming-laptops': {
        title: 'Gaming Laptops 2024 | RTX Graphics, High Performance',
        description: 'Shop the best gaming laptops with RTX graphics cards. Top brands: ASUS, MSI, Razer. Free shipping, expert support.',
        keywords: 'gaming laptop, RTX 4080, gaming computer, portable gaming, high-performance laptop',
        heading: 'Gaming Laptops Collection',
        subheading: 'Dominate any game with powerful gaming laptops',
        features: [
          'Latest RTX Graphics',
          'High Refresh Rate Displays',
          'Fast SSD Storage',
          'Advanced Cooling',
        ],
      },
      '4k-tvs': {
        title: '4K Smart TVs 2024 | OLED, QLED, Best Prices',
        description: 'Find your perfect 4K TV with smart features. Top brands: Sony, Samsung, LG. Expert reviews, competitive prices.',
        keywords: '4K TV, smart TV, OLED, QLED, UHD, home theater',
        heading: '4K Smart TV Collection',
        subheading: 'Cinema-quality experience at home',
        features: [
          '4K Ultra HD Resolution',
          'Smart TV Features',
          'HDR & Dolby Vision',
          'Multiple Screen Sizes',
        ],
      },
      'mechanical-keyboards': {
        title: 'Mechanical Keyboards 2024 | RGB, Wireless, Gaming',
        description: 'Premium mechanical keyboards for gaming and productivity. Cherry MX switches, RGB lighting, wireless options.',
        keywords: 'mechanical keyboard, gaming keyboard, Cherry MX, RGB keyboard, wireless keyboard',
        heading: 'Mechanical Keyboards Collection',
        subheading: 'Precision typing with premium switches',
        features: [
          'Cherry MX Switches',
          'RGB Customization',
          'Wireless & Wired Options',
          'Macro Keys',
        ],
      },
    }

    return seoTemplates[slug] || {
      title: `${slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')} - CyberShop`,
      description: `Shop ${slug.replace(/-/g, ' ')} at CyberShop. Best prices, fast shipping, expert support.`,
      keywords: slug.replace(/-/g, ', '),
      heading: `${slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')} Collection`,
      subheading: `Discover the best ${slug.replace(/-/g, ' ')}`,
      features: ['High Quality', 'Competitive Prices', 'Fast Shipping', 'Expert Support'],
    }
  }

  if (!seoData) {
    return null
  }

  return (
    <PageLayout>
      <div className="bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4" variant="secondary">
              <TrendingUp className="h-3 w-3 mr-1" />
              Trending Now
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {seoData.heading}
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              {seoData.subheading}
            </p>
            
            <div className="flex flex-wrap gap-3">
              {seoData.features.map((feature: string) => (
                <Badge key={feature} variant="outline" className="px-4 py-2">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">
              Why Shop {seoData.heading.replace(' Collection', '')} at CyberShop?
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Expert Curation</h3>
                  <p className="text-sm">
                    Our team of tech experts carefully selects only the best products from top brands. Every item is tested and reviewed for quality.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Best Price Guarantee</h3>
                  <p className="text-sm">
                    We offer competitive prices on all products. Find a lower price elsewhere? We'll match it.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Free Shipping</h3>
                  <p className="text-sm">
                    Enjoy free shipping on all orders over $50. Fast, reliable delivery to your door.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Easy Returns</h3>
                  <p className="text-sm">
                    30-day hassle-free returns. Not satisfied? Send it back for a full refund.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Expert Support</h3>
                  <p className="text-sm">
                    Our tech experts are available 24/7 to answer your questions and help you make the right choice.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Secure Shopping</h3>
                  <p className="text-sm">
                    Bank-level security protects your data. Shop with confidence.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-3">What Customers Say</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">4.8/5 based on 2,500+ reviews</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2 italic">
                "Best prices I've found anywhere. Fast shipping and excellent customer service!" - Verified Buyer
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Featured {seoData.heading.replace(' Collection', '')}</h2>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>

              <div className="text-center mt-8">
                <Button size="lg">
                  View All {seoData.heading.replace(' Collection', '')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Check back later or browse other categories
              </p>
            </div>
          )}
        </div>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Related Categories</h3>
            <div className="flex flex-wrap gap-3">
              {['Electronics', 'Computers', 'Mobile', 'Gaming', 'Audio', 'Accessories'].map((cat) => (
                <Button
                  key={cat}
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = `/category/${cat.toLowerCase()}`}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  q: `What are the best ${seoData.heading.replace(' Collection', '').toLowerCase()}?`,
                  a: `Our ${seoData.heading.replace(' Collection', '').toLowerCase()} are curated from top brands known for quality and performance. Check our reviews for detailed information.`,
                },
                {
                  q: 'Do you offer free shipping?',
                  a: 'Yes! We offer free shipping on all orders over $50 within the continental United States.',
                },
                {
                  q: 'What is your return policy?',
                  a: 'We offer a 30-day hassle-free return policy. Items must be unused and in original packaging.',
                },
                {
                  q: 'How can I contact customer support?',
                  a: 'Our support team is available 24/7 via live chat, email, or phone at +1 (800) 123-4567.',
                },
              ].map((faq, index) => (
                <div key={index}>
                  <h4 className="font-semibold mb-2">{faq.q}</h4>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
