'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { ProductCard } from '@/components/shop/product-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Star, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function BestSellersPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [minRating, setMinRating] = useState(0)

  const categories = [
    { id: '', name: 'All Categories' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'computers', name: 'Computers' },
    { id: 'mobile', name: 'Mobile' },
    { id: 'gaming', name: 'Gaming' },
    { id: 'audio', name: 'Audio' },
  ]

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products?sort=salesCount&order=desc&limit=24')
      const data = await res.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching best sellers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !selectedCategory || p.category.slug === selectedCategory
    const matchesRating = p.rating >= minRating
    return matchesSearch && matchesCategory && matchesRating
  }).map((product, index) => ({ ...product, rank: index + 1 }))

  return (
    <PageLayout>
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-amber-500 hover:bg-amber-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                TRENDING
              </Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Best Sellers
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover what's trending. Our most popular products based on sales volume and customer reviews.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search best sellers..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-nowrap">Category:</span>
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-nowrap">Min Rating:</span>
              <div className="flex gap-1">
                {[4, 4.5, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                    className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                      minRating === rating
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {rating}+
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              Showing {filteredProducts.length} best sellers
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="relative">
                  {/* Rank Badge */}
                  {product.rank <= 10 && (
                    <div className="absolute -top-2 -left-2 z-10">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${
                        product.rank === 1 ? 'bg-amber-500' :
                        product.rank === 2 ? 'bg-slate-400' :
                        product.rank === 3 ? 'bg-amber-700' : 'bg-muted-foreground'
                      }`}>
                        #{product.rank}
                      </div>
                    </div>
                  )}
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No best sellers found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or browse other categories
            </p>
            <Button onClick={() => { setSearch(''); setSelectedCategory(''); setMinRating(0) }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
