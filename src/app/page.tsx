'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/shop/product-card'
import { CategoryCard } from '@/components/shop/category-card'
import { DealCard } from '@/components/shop/deal-card'
import { BlogCard } from '@/components/shop/blog-card'
import { PageLayout, Section, Container, Grid, Flex } from '@/components/layout/page-layout'
import { DealSlider } from '@/components/shop/deal-slider'
import { HeroDealSlider } from '@/components/shop/hero-deal-slider'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ArrowRight, Star, Truck, Shield, RotateCcw, Clock, Sparkles } from 'lucide-react'

// Data fetching handled via useEffect

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [flashDeals, setFlashDeals] = useState<any[]>([])
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [catRes, prodRes, dealRes, blogRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products?featured=true&limit=4'),
          fetch('/api/products?onSale=true&limit=4'),
          fetch('/api/blog'),
        ])

        const [catData, prodData, dealData, blogData] = await Promise.all([
          catRes.json(),
          prodRes.json(),
          dealRes.json(),
          blogRes.json(),
        ])

        setCategories(catData.categories || [])
        setFeaturedProducts(prodData.products || [])
        setFlashDeals((dealData.products || []).map((p: any) => ({
          ...p,
          image: p.images?.[0] || '/images/products/placeholder.jpg',
          originalPrice: p.comparePrice || p.price * 1.2,
          discountedPrice: p.price,
          discount: p.comparePrice ? Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100) : 0,
          flash: true,
        })))
        setBlogPosts(blogData.posts || [])
      } catch (error) {
        console.error('Error fetching home data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      alert(`Thank you for subscribing with ${email}!`)
      setEmail('')
    }
  }

  const TrustIndicator = ({ icon: Icon, title, description }: { 
    icon: React.ComponentType<{ className?: string }>
    title: string
    description: string
  }) => (
    <div className="flex flex-col items-center text-center">
      <Icon className="h-10 w-10 text-primary mb-2" />
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )

  const SectionHeader = ({ 
    title, 
    description, 
    badge, 
    action 
  }: { 
    title: string
    description?: string
    badge?: React.ReactNode
    action?: React.ReactNode
  }) => (
    <Flex className="mb-8 md:mb-12" justify="between" align="start" direction="col" gap="tight" wrap>
      <div>
        {badge && <div className="mb-2">{badge}</div>}
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      {action && <div className="mt-4 md:mt-0">{action}</div>}
    </Flex>
  )

  const ProductGrid = ({ 
    products, 
    emptyMessage 
  }: { 
    products: any[]
    emptyMessage: string
  }) => (
    <Grid cols={4} gap="md">
      {loading ? (
        Array(4).fill(0).map((_, i) => (
          <div key={i} className="aspect-square bg-muted animate-pulse rounded-xl" />
        ))
      ) : products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))
      ) : (
        <div className="col-span-full text-center py-12 text-muted-foreground">
          {emptyMessage}
        </div>
      )}
    </Grid>
  )

  return (
    <PageLayout sectioned>
      {/* Hero Section */}
      <Section size="lg" className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <Container>
          <Flex 
            direction={{ base: 'col', lg: 'row' }} 
            align="start" 
            justify="between" 
            gap="relaxed" 
            className="items-start"
          >
            {/* Left: Hero Content */}
            <div className="max-w-3xl w-full lg:max-w-none">
              <Badge className="mb-4" variant="secondary">
                <Sparkles className="mr-1 h-3 w-3" />
                New Arrivals Available
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Discover the Future of Technology Today
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Shop the latest electronics, gadgets, and tech accessories at unbeatable prices. 
                Free shipping on orders over $50.
              </p>
              <Flex direction={{ base: 'col', sm: 'row' }} gap="tight" wrap>
                <Link href="/category/electronics">
                  <Button size="lg" className="w-full sm:w-auto">
                    Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/deals">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    View Deals
                  </Button>
                </Link>
              </Flex>
            </div>

            {/* Right: Compact Flash Deals Slider */}
            <div className="hidden lg:block relative w-full max-w-md">
              <div className="sticky top-24">
                <HeroDealSlider deals={flashDeals} />
              </div>
            </div>
          </Flex>

          {/* Mobile: Show slider below content */}
          <div className="lg:hidden mt-10">
            <HeroDealSlider deals={flashDeals} />
          </div>
        </Container>
      </Section>

      {/* Trust Indicators */}
      <Section size="sm" className="border-b bg-muted/50">
        <Container>
          <Grid cols={4} gap="md">
            <TrustIndicator icon={Truck} title="Free Shipping" description="On orders over $50" />
            <TrustIndicator icon={Shield} title="Secure Checkout" description="SSL encrypted" />
            <TrustIndicator icon={RotateCcw} title="Easy Returns" description="30-day policy" />
            <TrustIndicator icon={Clock} title="24/7 Support" description="Always here to help" />
          </Grid>
        </Container>
      </Section>

      {/* Categories Section */}
      <Section size="md">
        <Container>
          <SectionHeader
            title="Shop by Category"
            description="Find exactly what you're looking for"
            action={
              <Link href="/categories">
                <Button variant="ghost">View All <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            }
          />
          <Grid cols={6} gap="md">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="aspect-square bg-muted animate-pulse rounded-xl" />
              ))
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <CategoryCard key={category.id} {...category} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No categories found
              </div>
            )}
          </Grid>
        </Container>
      </Section>

      {/* Flash Deals Section */}
      <Section size="md" className="bg-gradient-to-b from-primary/5 to-background">
        <Container>
          <SectionHeader
            badge={<Badge variant="destructive">Limited Time</Badge>}
            title="Flash Deals"
            description="Hurry! Offers end soon"
            action={
              <Link href="/deals">
                <Button variant="ghost">View All Deals <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            }
          />
          <Grid cols={4} gap="md">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="aspect-square bg-muted animate-pulse rounded-xl" />
              ))
            ) : flashDeals.length > 0 ? (
              flashDeals.map((deal) => (
                <DealCard key={deal.id} {...deal} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No flash deals available right now
              </div>
            )}
          </Grid>
        </Container>
      </Section>

      {/* Featured Products Section */}
      <Section size="md">
        <Container>
          <SectionHeader
            title="Featured Products"
            description="Handpicked by our team"
            action={
              <Link href="/best-sellers">
                <Button variant="ghost">View All <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            }
          />
          <ProductGrid products={featuredProducts} emptyMessage="No featured products found" />
        </Container>
      </Section>

      {/* New Arrivals & Best Sellers */}
      <Section size="md" className="bg-muted/30">
        <Container>
          <Grid cols={2} gap="relaxed" className="mb-8 md:mb-12">
            <div>
              <Badge className="mb-2">Just In</Badge>
              <h2 className="text-2xl font-bold mb-2">New Arrivals</h2>
              <p className="text-muted-foreground mb-4">
                Check out the latest products we've added to our store
              </p>
              <Link href="/new-arrivals">
                <Button>Shop New Arrivals <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </div>
            <div>
              <Badge className="mb-2">Trending</Badge>
              <h2 className="text-2xl font-bold mb-2">Best Sellers</h2>
              <p className="text-muted-foreground mb-4">
                Our most popular products based on sales and reviews
              </p>
              <Link href="/best-sellers">
                <Button variant="outline">Shop Best Sellers <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </div>
          </Grid>
        </Container>
      </Section>

      {/* Blog Section */}
      <Section size="md">
        <Container>
          <SectionHeader
            title="Latest from Our Blog"
            description="Tech tips, reviews, and news"
            action={
              <Link href="/blog">
                <Button variant="ghost">Read More <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            }
          />
          <Grid cols={3} gap="md">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-muted animate-pulse rounded-xl" />
              ))
            ) : blogPosts.length > 0 ? (
              blogPosts.map((post) => (
                <BlogCard key={post.id} {...post} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No blog posts found
              </div>
            )}
          </Grid>
        </Container>
      </Section>

      {/* Newsletter Section */}
      <Section size="md" className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <Container size="md">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Subscribe & Save 10%
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Join our newsletter and get exclusive deals, new product alerts, and tech tips delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/20 border-white/30 placeholder:text-white/70 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" variant="secondary" size="lg">
                Subscribe
              </Button>
            </form>
            <p className="text-sm mt-4 opacity-75">
              By subscribing, you agree to our{' '}
              <Link href="/privacy" className="underline hover:text-white">Privacy Policy</Link>
              {' '}and{' '}
              <Link href="/terms" className="underline hover:text-white">Terms of Service</Link>
            </p>
          </div>
        </Container>
      </Section>

      {/* Testimonials / Reviews */}
      <Section size="md">
        <Container>
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">What Our Customers Say</h2>
            <p className="text-muted-foreground mt-1">Trusted by thousands of tech enthusiasts</p>
          </div>
          <Grid cols={3} gap="md">
            {[
              { name: 'John D.', rating: 5, review: 'Excellent service and fast shipping! The product quality exceeded my expectations.', product: 'Wireless Headphones' },
              { name: 'Sarah M.', rating: 5, review: 'Best online tech store! Great prices and customer support is always helpful.', product: 'Gaming Laptop' },
              { name: 'Mike R.', rating: 5, review: 'I\'ve been shopping here for years. Never disappointed with my purchases.', product: 'Smart TV' },
            ].map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <Flex gap="tight" className="mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </Flex>
                  <p className="text-muted-foreground mb-4">"{testimonial.review}"</p>
                  <Flex justify="between">
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.product}</p>
                    </div>
                  </Flex>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>
    </PageLayout>
  )
}