'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { PageLayout } from '@/components/layout/page-layout'
import { ProductCard } from '@/components/shop/product-card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const [category, setCategory] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('featured')
  const [brands, setBrands] = useState<{ id: string, name: string }[]>([])

  useEffect(() => {
    const fetchCategoryAndBrands = async () => {
      try {
        const catRes = await fetch(`/api/categories`)
        const catData = await catRes.json()
        const currentCat = catData.categories?.find((c: any) => c.slug === slug)
        setCategory(currentCat)

        // Fetch brands from API
        const brandsRes = await fetch(`/api/brands`)
        const brandsData = await brandsRes.json()
        if (brandsData.brands) {
          setBrands(brandsData.brands.map((b: any) => ({ id: b.id, name: b.name })))
        }
      } catch (error) {
        console.error('Error fetching category details:', error)
      }
    }
    fetchCategoryAndBrands()
  }, [slug])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        let url = `/api/products?category=${slug}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}&sort=${sortBy}`
        if (selectedBrands.length > 0) {
          url += `&brands=${selectedBrands.join(',')}`
        }
        
        const res = await fetch(url)
        const data: any = await res.json()
        setProducts(data.products || [])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [slug, priceRange, selectedBrands, sortBy])

  const toggleBrand = (brandId: string) => {
    setSelectedBrands(prev => 
      prev.includes(brandId) 
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    )
  }

  const handlePriceChange = (value: number[]) => {
    if (value.length === 2) {
      setPriceRange([value[0], value[1]])
    }
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Price Range</h3>
              <Slider
                defaultValue={[0, 2000]}
                max={2000}
                step={50}
                value={priceRange}
                onValueChange={handlePriceChange}
                className="mb-4"
              />
              <div className="flex items-center justify-between text-sm">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4">Brands</h3>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <div key={brand.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={brand.id} 
                      checked={selectedBrands.includes(brand.id)}
                      onCheckedChange={() => toggleBrand(brand.id)}
                    />
                    <Label htmlFor={brand.id}>{brand.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {category ? category.name : 'Category'}
                </h1>
                <p className="text-muted-foreground">
                  {products.length} products found
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium whitespace-nowrap">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Featured" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-lg" />
                ))
              ) : products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-xl text-muted-foreground">No products found in this category.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </PageLayout>
  )
}
