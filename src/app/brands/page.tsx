'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { BrandCard } from '@/components/shop/brand-card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'popularity'>('name')

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands?includeProductCount=true')
      const data = await res.json()
      setBrands(data.brands || [])
    } catch (error) {
      console.error('Error fetching brands:', error)
    }
  }

  const filteredAndSortedBrands = brands
    .filter(brand => 
      brand.name.toLowerCase().includes(search.toLowerCase()) ||
      (brand.description && brand.description.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'popularity') return (b.productCount || 0) - (a.productCount || 0)
      return 0
    })

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Shop by Brand</h1>
          <p className="text-muted-foreground text-lg">
            Explore products from our trusted partners and top manufacturers
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search brands..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('name')}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  sortBy === 'name'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                Alphabetical
              </button>
              <button
                onClick={() => setSortBy('popularity')}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  sortBy === 'popularity'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                Popularity
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-6">
          Showing {filteredAndSortedBrands.length} brands
        </p>

        {/* Brands Grid */}
        {filteredAndSortedBrands.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAndSortedBrands.map((brand) => (
              <BrandCard key={brand.id} {...brand} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No brands found</h3>
            <p className="text-muted-foreground mb-4">
              Try a different search term or browse our categories
            </p>
            <button
              onClick={() => setSearch('')}
              className="text-primary hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
