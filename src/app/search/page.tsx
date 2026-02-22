'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { ProductCard } from '@/components/shop/product-card'
import { BrandCard } from '@/components/shop/brand-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function SearchResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery)
    }
  }, [initialQuery])

  const performSearch = async (searchQuery: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      setResults(data)
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      performSearch(query.trim())
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Search Header */}
      <div className="mb-8 max-w-4xl">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products, brands, and categories..."
            className="pl-12 pr-12 h-14 text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); router.push('/search') }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </form>

        {results.query && (
          <p className="text-sm text-muted-foreground mt-3">
            Search results for "<span className="font-medium">{results.query}</span>"
          </p>
        )}
      </div>

      {/* No Results */}
      {!loading && results.query && 
        (!results.products || results.products.length === 0) &&
        (!results.brands || results.brands.length === 0) &&
        (!results.categories || results.categories.length === 0) && (
          <div className="text-center py-16 max-w-2xl mx-auto">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No results found</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find anything matching "{results.query}". Try different keywords or browse our categories.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button onClick={() => setQuery('')}>
                Clear Search
              </Button>
              <Button variant="outline" onClick={() => router.push('/category/electronics')}>
                Browse Products
              </Button>
            </div>
          </div>
        )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground mt-4">Searching...</p>
        </div>
      )}

      {/* Search Results */}
      {!loading && results.query && (
        <div className="space-y-12">
          {/* Products */}
          {results.products && results.products.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-bold">Products</h2>
                <Badge variant="secondary">{results.products.length} results</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.products.map((product: any) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            </section>
          )}

          {/* Brands */}
          {results.brands && results.brands.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-bold">Brands</h2>
                <Badge variant="secondary">{results.brands.length} results</Badge>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.brands.map((brand: any) => (
                  <BrandCard key={brand.id} {...brand} />
                ))}
              </div>
            </section>
          )}

          {/* Categories */}
          {results.categories && results.categories.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-bold">Categories</h2>
                <Badge variant="secondary">{results.categories.length} results</Badge>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.categories.map((category: any) => (
                  <Link key={category.id} href={`/category/${category.slug}`}>
                    <div className="p-4 border rounded-lg hover:border-primary transition-colors">
                      <h3 className="font-medium">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Search Suggestions (when no query) */}
      {!initialQuery && (
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold mb-6">Popular Searches</h2>
          <div className="flex flex-wrap gap-2">
            {['Wireless headphones', 'Gaming laptop', 'Smart TV', 'Bluetooth speaker', 'Mechanical keyboard', 'Webcam', 'External hard drive', 'Phone charger'].map((term) => (
              <Button
                key={term}
                variant="outline"
                onClick={() => { setQuery(term); performSearch(term) }}
              >
                {term}
              </Button>
            ))}
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">Browse by Category</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Electronics', 'Computers', 'Mobile', 'Gaming', 'Audio', 'Accessories'].map((category) => (
              <Link key={category} href={`/category/${category.toLowerCase()}`}>
                <div className="p-6 border rounded-lg hover:border-primary transition-colors text-center">
                  <h3 className="font-semibold">{category}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function SearchResultsPage() {
  return (
    <PageLayout>
      <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center">Loading search...</div>}>
        <SearchResultsContent />
      </Suspense>
    </PageLayout>
  )
}
