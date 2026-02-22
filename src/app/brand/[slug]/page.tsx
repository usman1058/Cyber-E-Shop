'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { ProductCard } from '@/components/shop/product-card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Filter, ArrowUpDown } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function BrandDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const [brand, setBrand] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [sortBy, setSortBy] = useState('createdAt-desc')

  // Pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchBrandData()
  }, [slug, page, sortBy])

  const fetchBrandData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/brands/${slug}?includeProducts=true&page=${page}&limit=12`)
      const data = await res.json()
      
      if (data.brand) {
        setBrand(data.brand)
        setProducts(data.brand.products || [])
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching brand:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((product) => {
    return product.price >= priceRange[0] && product.price <= priceRange[1]
  })

  return (
    <PageLayout>
      {/* Breadcrumb */}
      <div className="bg-muted/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Home</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">Brands</span>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{brand?.name || slug}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Brand Header */}
        {brand && (
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="h-24 w-24 flex-shrink-0 bg-muted rounded-lg flex items-center justify-center">
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} className="h-20 w-20 object-contain" />
                ) : (
                  <span className="text-4xl font-bold text-primary/30">
                    {brand.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{brand.name}</h1>
                {brand.description && (
                  <p className="text-muted-foreground text-lg mb-4">{brand.description}</p>               )}
                {brand.story && (
                  <div className="bg-muted/50 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold mb-2">Brand Story</h3>
                    <p className="text-sm text-muted-foreground">{brand.story}</p>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">{brand.productCount || products.length} Products</Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2 flex-wrap">
              <Label>Price:</Label>
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                max={5000}
                step={50}
                className="w-48"
              />
              <span className="text-sm text-muted-foreground">
                ${priceRange[0]} - ${priceRange[1]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
            </select>
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
              Showing {filteredProducts.length} of {brand?.productCount || products.length} products
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your price range or browse other brands
            </p>
            <Button onClick={() => setPriceRange([0, 5000])}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
