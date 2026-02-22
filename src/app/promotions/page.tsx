'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { ProductCard } from '@/components/shop/product-card'
import { DealCard } from '@/components/shop/deal-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Flame, Percent, Tag, Gift, Clock, ArrowRight, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function PromotionsPage() {
  const [deals, setDeals] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [dealsRes, productsRes] = await Promise.all([
        fetch('/api/deals'),
        fetch('/api/products?featured=true&limit=12'),
      ])
      const dealsData = await dealsRes.json()
      const productsData = await productsRes.json()
      setDeals(dealsData.deals || [])
      setProducts(productsData.products || [])
    } catch (error) {
      console.error('Error fetching promotions:', error)
    } finally {
      setLoading(false)
    }
  }

  const campaigns = [
    {
      id: '1',
      name: 'Summer Tech Sale',
      type: 'seasonal',
      description: 'Save up to 40% on summer essentials - fans, coolers, portable devices, and more.',
      discount: 40,
      discountType: 'percentage',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      banner: '/images/banners/summer-sale.jpg',
      active: true,
    },
    {
      id: '2',
      name: 'Gaming Week',
      type: 'promo',
      description: 'Special deals on gaming gear - consoles, headsets, keyboards, and games.',
      discount: 25,
      discountType: 'percentage',
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      banner: '/images/banners/gaming-week.jpg',
      active: true,
    },
    {
      id: '3',
      name: 'Back to School',
      type: 'seasonal',
      description: 'Everything students need - laptops, tablets, accessories, and more at great prices.',
      discount: 30,
      discountType: 'percentage',
      startDate: new Date(),
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      banner: '/images/banners/back-to-school.jpg',
      active: true,
    },
  ]

  const getTimeRemaining = (endDate: Date) => {
    const now = new Date().getTime()
    const end = new Date(endDate).getTime()
    const diff = end - now

    if (diff <= 0) return null

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return { days, hours, minutes }
  }

  return (
    <PageLayout>
      {/* Hero */}
      <div className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Flame className="h-5 w-5" />
              <span className="font-semibold">Limited Time Offers</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Current Promotions
            </h1>
            <p className="text-lg opacity-90">
              Don't miss out on these amazing deals and seasonal sales!
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Flash Deals Section */}
        {deals.filter(d => d.type === 'flash').length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-red-500 flex items-center justify-center">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Flash Deals</h2>
              <Badge variant="destructive">Act Fast!</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {deals.filter(d => d.type === 'flash').slice(0, 4).map((deal, index) => (
                <div key={deal.id} className="animate-in fade-in-0" style={{ animationDelay: `${index * 100}ms` }}>
                  <DealCard
                    id={deal.id}
                    name={`Product ${index + 1}`}
                    slug={`product-${index + 1}`}
                    originalPrice={100}
                    discountedPrice={100 - deal.discount}
                    discount={deal.discount}
                    image="/images/products/placeholder.jpg"
                    endDate={deal.endDate}
                    type={deal.type}
                    flash={true}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Active Campaigns */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            Active Campaigns
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => {
              const timeRemaining = getTimeRemaining(campaign.endDate)
              return (
                <Card
                  key={campaign.id}
                  className="group overflow-hidden transition-all hover:shadow-lg"
                >
                  {/* Banner */}
                  <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Tag className="h-16 w-16 text-primary/30" />
                    </div>

                    {/* Campaign Badge */}
                    <Badge className="absolute top-4 left-4">
                      {campaign.type === 'flash' && '🔥 Flash Sale'}
                      {campaign.type === 'promo' && '🎉 Special Offer'}
                      {campaign.type === 'seasonal' && '🌟 Seasonal Sale'}
                    </Badge>

                    {/* Discount Badge */}
                    <div className="absolute top-4 right-4 bg-red-500 text-white rounded-lg px-3 py-1.5 font-bold">
                      {campaign.discountType === 'percentage' ? `${campaign.discount}% OFF` : `Save $${campaign.discount}`}
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Time Remaining */}
                    {timeRemaining && (
                      <div className="flex items-center gap-2 mb-4 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          Ends in {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m
                        </span>
                      </div>
                    )}

                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {campaign.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {campaign.description}
                    </p>

                    <Button className="w-full">
                      Shop Now
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* All Discounts */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Percent className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">All Discounted Products</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products
                .filter(p => p.comparePrice && p.comparePrice > p.price)
                .map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
            </div>
          )}
        </section>

        {/* Newsletter CTA */}
        <Card className="mt-12 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-8 text-center">
            <Gift className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Never Miss a Deal</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Subscribe to our newsletter and get notified about new promotions and exclusive offers.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => window.location.href = '/newsletter'}>
                Subscribe Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
