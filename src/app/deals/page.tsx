'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { ProductCard } from '@/components/shop/product-card'
import { DealCard } from '@/components/shop/deal-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function DealsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [productsRes, dealsRes] = await Promise.all([
        fetch('/api/products?featured=true&limit=20'),
        fetch('/api/deals'),
      ])
      const productsData = await productsRes.json()
      const dealsData = await dealsRes.json()
      setProducts(productsData.products || [])
      setDeals(dealsData.deals || [])
    } catch (error) {
      console.error('Error fetching deals:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <PageLayout>
      {/* Hero */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16 text-center">
          <Badge className="mb-4 bg-white text-red-600">Limited Time</Badge>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Hot Deals & Special Offers
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Save big on your favorite tech products. Don't miss out on these amazing deals!
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search deals..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Flash Deals Section */}
        {deals.filter(d => d.type === 'flash').length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                🔥 FLASH SALE
              </Badge>
              <h2 className="text-2xl font-bold">Flash Deals</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {deals
                .filter(d => d.type === 'flash')
                .slice(0, 4)
                .map((deal, index) => (
                  <div key={deal.id} className="animate-in fade-in-0 slide-in-from-bottom-4" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900 rounded-lg p-4 text-center mb-4">
                      <p className="text-sm font-medium text-red-700 dark:text-red-400">
                        {deal.name}
                      </p>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                        {deal.discountType === 'percentage' ? `${deal.discount}% OFF` : `$${deal.discount} OFF`}
                      </p>
                      {deal.endDate && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                          Ends: {new Date(deal.endDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* All Deals */}
        <section>
          <h2 className="text-2xl font-bold mb-6">All Deals & Discounts</h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts
                .filter(p => p.comparePrice && p.comparePrice > p.price)
                .map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">No deals found</h3>
              <p className="text-muted-foreground">
                Check back soon for new deals and promotions!
              </p>
            </div>
          )}
        </section>

        {/* Promo Banners */}
        {deals.filter(d => d.type === 'promo').length > 0 && (
          <section className="mt-12 grid md:grid-cols-2 gap-6">
            {deals
              .filter(d => d.type === 'promo')
              .slice(0, 2)
              .map((deal) => (
                <div
                  key={deal.id}
                  className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-6 border"
                >
                  <Badge className="mb-2">{deal.discountType === 'percentage' ? `${deal.discount}% OFF` : `Save $${deal.discount}`}</Badge>
                  <h3 className="text-xl font-bold mb-2">{deal.name}</h3>
                  {deal.description && (
                    <p className="text-muted-foreground mb-4">{deal.description}</p>
                  )}
                  {deal.endDate && (
                    <p className="text-sm text-muted-foreground">
                      Valid until: {new Date(deal.endDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
          </section>
        )}
      </div>
    </PageLayout>
  )
}
