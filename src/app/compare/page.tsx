'use client'

import { PageLayout } from '@/components/layout/page-layout'
import Link from 'next/link'
import { ProductCard } from '@/components/shop/product-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Trash2, Plus, X, ArrowUpDown } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ComparisonProduct {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  image: string
  rating: number
  reviewCount: number
  specs?: any
}

export default function ComparePage() {
  const [products, setProducts] = useState<ComparisonProduct[]>([])
  const [loading, setLoading] = useState(false)

  // Get product IDs from URL query or localStorage
  useEffect(() => {
    const savedComparisons = localStorage.getItem('compareProducts')
    if (savedComparisons) {
      const productIds = JSON.parse(savedComparisons)
      fetchComparisonProducts(productIds)
    }
  }, [])

  const fetchComparisonProducts = async (productIds: string[]) => {
    setLoading(true)
    try {
      const productData = await Promise.all(
        productIds.map(id => fetch(`/api/products/${id}`).then(res => res.json()))
      )
      setProducts(productData.map(p => ({
        ...p,
        specs: p.specs || {},
      })))
    } catch (error) {
      console.error('Error fetching comparison products:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeProduct = (productId: string) => {
    const updatedProducts = products.filter(p => p.id !== productId)
    setProducts(updatedProducts)
    localStorage.setItem('compareProducts', JSON.stringify(updatedProducts.map(p => p.id)))
  }

  const clearAll = () => {
    setProducts([])
    localStorage.removeItem('compareProducts')
  }

  const addFromSuggestions = async (productId: string) => {
    if (products.length >= 4) {
      alert('You can compare up to 4 products at a time')
      return
    }
    if (products.some(p => p.id === productId)) {
      alert('This product is already in comparison')
      return
    }

    try {
      const res = await fetch(`/api/products/${productId}`)
      const product = await res.json()
      const updatedProducts = [...products, { ...product, specs: product.specs || {} }]
      setProducts(updatedProducts)
      localStorage.setItem('compareProducts', JSON.stringify(updatedProducts.map(p => p.id)))
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([])

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch('/api/products?limit=5')
        const data = await res.json()
        if (data.products) {
          setSuggestedProducts(data.products)
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      }
    }
    fetchSuggestions()
  }, [])

  const filteredSuggestions = suggestedProducts.filter(p => !products.some(existing => existing.id === p.id))

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground mt-4">Loading comparison...</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Product Comparison
          </h1>
          <p className="text-muted-foreground">
            Compare products side by side to make the best choice
          </p>
        </div>

        {products.length === 0 ? (
          /* Empty State */
          <Card>
            <CardContent className="p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-3">No Products to Compare</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Add products to comparison from product pages or browse our catalog to get started.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => window.location.href = '/category/electronics'}>
                  Browse Products
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Comparison Table */
          <div className="space-y-8">
            {/* Actions Bar */}
            <div className="flex items-center justify-between">
              <Badge variant="secondary">
                {products.length} product{products.length > 1 ? 's' : ''} selected
              </Badge>
              <Button variant="outline" size="sm" onClick={clearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>

            {/* Product Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <div className="relative">
                      <button
                        onClick={() => removeProduct(product.id)}
                        className="absolute top-0 right-0 h-8 w-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                        title="Remove from comparison"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>

                      {/* Product Image */}
                      <Link href={`/product/${product.slug}`}>
                        <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </Link>

                      {/* Product Info */}
                      <Link href={`/product/${product.slug}`}>
                        <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors mb-2">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-2 text-sm">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${i < Math.floor(product.rating)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                                }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-muted-foreground">
                          ({product.reviewCount})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <span className="text-xl font-bold text-primary">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.comparePrice && product.comparePrice > product.price && (
                          <span className="ml-2 text-sm text-muted-foreground line-through">
                            ${product.comparePrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Quick Add to Cart */}
                      <Button className="w-full" size="sm">
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detailed Comparison Table */}
            <Card>
              <CardContent className="p-6 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold min-w-[200px]">
                        Feature
                      </th>
                      {products.map((product) => (
                        <th key={product.id} className="py-3 px-4 min-w-[200px]">
                          <div className="font-semibold">{product.name}</div>
                          <div className="text-lg font-bold text-primary mt-1">
                            ${product.price.toFixed(2)}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Price */}
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium bg-muted/50">
                        Price
                      </td>
                      {products.map((product) => (
                        <td key={product.id} className="py-3 px-4 text-center">
                          <span className="text-lg font-bold text-primary">
                            ${product.price.toFixed(2)}
                          </span>
                          {product.comparePrice && product.comparePrice > product.price && (
                            <div className="text-sm text-green-600 mt-1">
                              Save ${product.comparePrice - product.price}
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Rating */}
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium bg-muted/50">
                        Rating
                      </td>
                      {products.map((product) => (
                        <td key={product.id} className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-lg font-bold">
                              {product.rating}
                            </span>
                            <span className="text-muted-foreground">
                              / 5 ({product.reviewCount} reviews)
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Dynamic Specs */}
                    {Object.keys(products[0]?.specs || {}).length > 0 ? (
                      <>
                        {Object.entries(products[0]?.specs || {}).map(([key, value]) => (
                          <tr key={key} className="border-b">
                            <td className="py-3 px-4 font-medium bg-muted/50 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </td>
                            {products.map((product) => (
                              <td key={product.id} className="py-3 px-4 text-center">
                                {product.specs?.[key] || '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </>
                    ) : (
                      <tr>
                        <td colSpan={products.length + 1} className="py-8 text-center text-muted-foreground">
                          Detailed specifications not available for comparison
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Suggestions to Add More */}
            {products.length < 4 && suggestedProducts.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Add More Products to Compare
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Compare up to 4 products at a time. Add more products below:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredSuggestions.map((product) => (
                    <Card key={product.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
                          <span className="text-4xl font-bold text-primary/20">
                            {product.name[0]}
                          </span>
                        </div>
                        <h3 className="font-medium text-sm mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary">
                            ${product.price.toFixed(2)}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => addFromSuggestions(product.id)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
