'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/shop/product-card'
import { CategoryCard } from '@/components/shop/category-card'
import { DealCard } from '@/components/shop/deal-card'
import { BlogCard } from '@/components/shop/blog-card'
import { PageLayout } from '@/components/layout/page-layout'
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
        setFlashDeals(dealData.products || []) // Using products on sale as flash deals for now
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
      // Subscribe to newsletter
      alert(`Thank you for subscribing with ${email}!`)
      setEmail('')
    }
  }

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
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
            <div className="flex flex-col sm:flex-row gap-4">
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
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-10 pointer-events-none">
          <div className="absolute right-20 top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute right-40 bottom-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="border-b bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center">
              <Truck className="h-10 w-10 text-primary mb-2" />
              <h3 className="font-semibold">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">On orders over $50</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Shield className="h-10 w-10 text-primary mb-2" />
              <h3 className="font-semibold">Secure Checkout</h3>
              <p className="text-sm text-muted-foreground">SSL encrypted</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <RotateCcw className="h-10 w-10 text-primary mb-2" />
              <h3 className="font-semibold">Easy Returns</h3>
              <p className="text-sm text-muted-foreground">30-day policy</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Clock className="h-10 w-10 text-primary mb-2" />
              <h3 className="font-semibold">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">Always here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
              <p className="text-muted-foreground mt-1">Find exactly what you're looking for</p>
            </div>
            <Link href="/categories">
              <Button variant="ghost">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
              ))
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <CategoryCard key={category.id} {...category} />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No categories found
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Flash Deals Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Badge className="mb-2" variant="destructive">
                Limited Time
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold">Flash Deals</h2>
              <p className="text-muted-foreground mt-1">Hurry! Offers end soon</p>
            </div>
            <Link href="/deals">
              <Button variant="ghost">
                View All Deals <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
              ))
            ) : flashDeals.length > 0 ? (
              flashDeals.map((deal) => (
                <DealCard key={deal.id} {...deal} />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No flash deals available right now
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
              <p className="text-muted-foreground mt-1">Handpicked by our team</p>
            </div>
            <Link href="/best-sellers">
              <Button variant="ghost">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No featured products found
              </div>
            )}
          </div>
        </div>
      </section>

      {/* New Arrivals & Best Sellers */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <Badge className="mb-2">Just In</Badge>
              <h2 className="text-2xl font-bold mb-2">New Arrivals</h2>
              <p className="text-muted-foreground mb-4">
                Check out the latest products we've added to our store
              </p>
              <Link href="/new-arrivals">
                <Button>
                  Shop New Arrivals <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div>
              <Badge className="mb-2">Trending</Badge>
              <h2 className="text-2xl font-bold mb-2">Best Sellers</h2>
              <p className="text-muted-foreground mb-4">
                Our most popular products based on sales and reviews
              </p>
              <Link href="/best-sellers">
                <Button variant="outline">
                  Shop Best Sellers <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Latest from Our Blog</h2>
              <p className="text-muted-foreground mt-1">Tech tips, reviews, and news</p>
            </div>
            <Link href="/blog">
              <Button variant="ghost">
                Read More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-muted animate-pulse rounded-lg" />
              ))
            ) : blogPosts.length > 0 ? (
              blogPosts.map((post) => (
                <BlogCard key={post.id} {...post} />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No blog posts found
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
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
              <Link href="/privacy" className="underline hover:text-white">
                Privacy Policy
              </Link>
              {' '}and{' '}
              <Link href="/terms" className="underline hover:text-white">
                Terms of Service
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials / Reviews */}
      {/* 
        NOTE: These are currently hardcoded because they are general marketing text. 
        In a full implementation, these would also come from a 'testimonials' API.
      */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">What Our Customers Say</h2>
            <p className="text-muted-foreground mt-1">Trusted by thousands of tech enthusiasts</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'John D.',
                rating: 5,
                review: 'Excellent service and fast shipping! The product quality exceeded my expectations.',
                product: 'Wireless Headphones',
              },
              {
                name: 'Sarah M.',
                rating: 5,
                review: 'Best online tech store! Great prices and customer support is always helpful.',
                product: 'Gaming Laptop',
              },
              {
                name: 'Mike R.',
                rating: 5,
                review: 'I\'ve been shopping here for years. Never disappointed with my purchases.',
                product: 'Smart TV',
              },
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.review}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.product}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
