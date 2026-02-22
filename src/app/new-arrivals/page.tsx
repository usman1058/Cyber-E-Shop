'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { ProductCard } from '@/components/shop/product-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Filter } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

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
      const res = await fetch('/api/products?isNew=true&sort=createdAt&order=desc&limit=24')
      const data = await res.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching new arrivals:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !selectedCategory || p.category.slug === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <PageLayout>
      {/* Header */}
      <div className="bg-muted/50">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-3xl">
            <Badge className="mb-4">Just In</Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              New Arrivals
            </h1>
            <p className="text-lg text-muted-foreground">
              Be the first to discover the latest tech products and gadgets. Shop our newest arrivals today!
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search new arrivals..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-sm text-muted-foreground">Category:</span>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
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
              Showing {filteredProducts.length} new arrivals
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No new arrivals found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or browse other categories
            </p>
            <Button onClick={() => { setSearch(''); setSelectedCategory('') }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
