'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, ShoppingCart, Trash2, Bell, CheckCircle, ChevronRight } from 'lucide-react'
import { ProductCard } from '@/components/shop/product-card'

export default function SaveForLaterPage() {
  const router = useRouter()
  const [savedItems, setSavedItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Simulate fetching saved items
    setSavedItems([
      {
        id: '1',
        name: 'Gaming Laptop Pro RTX 4080',
        slug: 'gaming-laptop-pro-rtx-4080',
        price: 2499.99,
        image: '/images/products/laptop.jpg',
        rating: 4.7,
        reviewCount: 89,
        stock: 5,
        savedDate: '2024-01-05',
        priceAlert: true,
      },
      {
        id: '2',
        name: 'Smartphone 15 Pro Max',
        slug: 'smartphone-15-pro-max',
        price: 1199.99,
        image: '/images/products/phone.jpg',
        rating: 4.9,
        reviewCount: 312,
        stock: 0,
        savedDate: '2024-01-02',
        stockAlert: true,
      },
    ])
  }, [])

  const moveToCart = async (item: any) => {
    if (item.stock === 0) {
      alert('This item is currently out of stock')
      return
    }
    
    setSavedItems(savedItems.filter(i => i.id !== item.id))
    setMessage(`${item.name} moved to cart!`)
    setTimeout(() => setMessage(''), 3000)
  }

  const removeItem = (id: string) => {
    if (!confirm('Remove this item from saved items?')) return
    setSavedItems(savedItems.filter(item => item.id !== id))
  }

  const moveAllToCart = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/cart')
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Save for Later</h1>
            <p className="text-muted-foreground">
              {savedItems.length} item{savedItems.length !== 1 ? 's' : ''} saved for future purchase
            </p>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center dark:bg-green-950/20">
              <CheckCircle className="h-5 w-5 text-green-600 inline mr-2" />
              {message}
            </div>
          )}

          {savedItems.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No items saved yet</h3>
                <p className="text-muted-foreground mb-6">
                  Items you save for later will appear here. Start shopping and save items you're interested in!
                </p>
                <Button onClick={() => router.push('/')}>
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Actions Card */}
              <Card className="mb-6 bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div className="text-sm text-blue-800 dark:text-blue-200">
                        <p className="font-medium">Smart Alerts Active</p>
                        <p className="opacity-80">You'll be notified about price drops or when items come back in stock</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={moveAllToCart}
                      disabled={loading}
                      className="flex items-center gap-2 w-full sm:w-auto"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {loading ? 'Moving...' : 'Move All to Cart'}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Saved Items Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {savedItems.map((item) => (
                  <div key={item.id} className="flex flex-col gap-4">
                    {/* Product Card - Removed outer Card wrapper to prevent double borders */}
                    <div className="h-full">
                      <ProductCard {...item} />
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-2 px-1">
                      <Button
                        onClick={() => moveToCart(item)}
                        className="w-full"
                        disabled={item.stock === 0}
                      >
                        {item.stock === 0 ? (
                          'Out of Stock'
                        ) : (
                          <>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Move to Cart
                          </>
                        )}
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="flex-1"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground text-center mt-1">
                        Saved on {item.savedDate}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Help */}
          <Card className="mt-6">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Want to save more items? Browse our{' '}
                <a href="/" className="text-primary hover:underline font-medium">
                  full catalog
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}