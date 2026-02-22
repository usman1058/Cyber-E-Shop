'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageLayout } from '@/components/layout/page-layout'
import { useCart, CartItem } from '@/hooks/use-cart'
import { useCurrency } from '@/hooks/use-currency'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  Save,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'

export default function CartPage() {
  const router = useRouter()
  const {
    cartItems,
    summary,
    loading,
    updateQuantity,
    removeItem,
    refreshCart
  } = useCart()
  const { formatPrice } = useCurrency()

  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return

    setMessage('')
    setSuccess(false)

    try {
      const response = await fetch('/api/checkout', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promoCode,
          items: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      })

      const result = await response.json()

      if (result.success) {
        setAppliedPromo(result.promoCode || '')
        setPromoDiscount(result.discount || 0)
        setSuccess(true)
        setMessage(result.message || 'Promo code applied!')
      } else {
        setMessage(result.message || 'Invalid promo code. Please try again.')
        setSuccess(false)
      }
    } catch (err) {
      console.error('Failed to apply promo code:', err)
      setMessage('Failed to apply promo code. Please try again.')
      setSuccess(false)
    } finally {
      setTimeout(() => setSuccess(false), 5000)
    }
  }

  const removePromoCode = () => {
    setPromoCode('')
    setAppliedPromo('')
    setPromoDiscount(0)
    setMessage('')
  }

  const handleSaveForLater = (item: CartItem) => {
    removeItem(item.id)
    setSuccess(true)
    setMessage(`${item.name} saved for later`)
    setTimeout(() => setSuccess(false), 3000)
  }

  const [isNavigating, setIsNavigating] = useState(false)

  const proceedToCheckout = () => {
    setIsNavigating(true)
    router.push('/checkout/address')
  }

  const { subtotal, savings, shipping, tax, total } = summary

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>

          {message && (
            <Alert variant={success ? 'default' : 'destructive'} className="mb-6">
              {success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {cartItems.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Start shopping to add items to your cart
                </p>
                <Button onClick={() => router.push('/')}>
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div>
                            <Link href={`/product/${item.slug}`}>
                              <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2">
                                {item.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">{item.brand}</Badge>
                                <Badge variant="outline" className="text-xs">{item.category}</Badge>
                              </div>
                            </Link>
                          </div>

                          {/* Price & Quantity */}
                          <div className="flex items-start justify-between gap-4 mt-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl font-bold text-primary">
                                  {formatPrice(item.price, 'USD')}
                                </span>
                                {item.comparePrice && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    {formatPrice(item.comparePrice, 'USD')}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="h-8 w-8"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= 10 || item.quantity >= item.stock}
                                  className="h-8 w-8"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="mt-2 font-semibold">
                                {formatPrice(item.price * item.quantity, 'USD')}
                              </div>
                            </div>
                          </div>

                          {/* Stock Status */}
                          <div className="mt-3 space-y-1">
                            {item.stock > 0 && item.stock < 10 && (
                              <p className="text-xs text-orange-600 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Only {item.stock} left in stock
                              </p>
                            )}
                            {item.stock === 0 && (
                              <p className="text-xs text-red-600">Out of Stock</p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 pt-4 border-t mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSaveForLater(item)}
                              className="flex-1"
                              disabled={item.stock === 0}
                            >
                              <Save className="mr-1 h-4 w-4" />
                              Save for Later
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Subtotal */}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">{formatPrice(subtotal, 'USD')}</span>
                    </div>

                    {/* Savings */}
                    {savings > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>You Save</span>
                        <span className="font-semibold">-{formatPrice(savings, 'USD')}</span>
                      </div>
                    )}

                    {/* Promo Code */}
                    <div className="space-y-2">
                      {appliedPromo ? (
                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950/20">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-green-600" />
                            <span className="font-semibold text-green-800 dark:text-green-400">
                              {appliedPromo} Applied
                            </span>
                          </div>
                          <Button variant="ghost" size="icon" onClick={removePromoCode}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Promo code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && applyPromoCode()}
                            disabled={loading}
                          />
                          <Button variant="outline" onClick={applyPromoCode} disabled={loading}>
                            {loading ? 'Applying...' : 'Apply'}
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Discount */}
                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span className="font-semibold">-{formatPrice(promoDiscount, 'USD')}</span>
                      </div>
                    )}

                    {/* Shipping */}
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Shipping</span>
                        {subtotal > 50 && (
                          <Badge variant="secondary" className="text-xs">FREE</Badge>
                        )}
                      </div>
                      <span className="font-semibold">
                        {shipping === 0 ? 'Free' : formatPrice(shipping, 'USD')}
                      </span>
                    </div>

                    {/* Tax */}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (8%)</span>
                      <span className="font-semibold">{formatPrice(tax, 'USD')}</span>
                    </div>

                    <Separator />

                    {/* Total */}
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(total, 'USD')}
                      </span>
                    </div>

                    {/* Info Alert */}
                    <Alert>
                      <Tag className="h-4 w-4" />
                      <AlertDescription>
                        Free shipping on orders over {formatPrice(50, 'USD')}. You'll save {formatPrice(savings, 'USD')} on this order.
                      </AlertDescription>
                    </Alert>

                    {/* Checkout Button - Moved inside sticky card */}
                    <Button
                      onClick={proceedToCheckout}
                      size="lg"
                      className="w-full"
                      loading={isNavigating}
                      disabled={cartItems.some(item => item.stock === 0)}
                    >
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}