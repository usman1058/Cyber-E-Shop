'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { useCart } from '@/hooks/use-cart'
import { useSession } from '@/hooks/use-session'
import { useNavigationLoader } from '@/hooks/use-navigation-loader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useCurrency } from '@/hooks/use-currency'
import { 
  Package, 
  MapPin, 
  Truck, 
  DollarSign, 
  Check, 
  AlertCircle, 
  ArrowRight,
  ChevronRight,
  Shield
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function CheckoutReviewPage() {
  const router = useRouter()
  const { cartItems, summary, loading: cartLoading } = useCart()
  const { session, guestId } = useSession()
  const { formatPrice } = useCurrency()
  const { navigateWithLoader, LoaderComponent } = useNavigationLoader()
  const [placingOrder, setPlacingOrder] = useState(false)
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (cartLoading) return
    
    const address = JSON.parse(localStorage.getItem('selectedAddress') || '{}')
    const shipping = JSON.parse(localStorage.getItem('shippingMethod') || '{}')
    const payment = JSON.parse(localStorage.getItem('paymentMethod') || '{"id":"cod","name":"Cash on Delivery"}')
    
    setOrderDetails({
      items: cartItems,
      shippingAddress: address,
      shippingMethod: shipping,
      paymentMethod: payment,
      summary: summary
    })
    setLoading(false)
  }, [cartItems, summary, cartLoading])

  const handlePlaceOrder = async () => {
    if (!orderDetails) return
    setPlacingOrder(true)
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          sessionId: guestId,
          shippingAddress: orderDetails.shippingAddress,
          shippingMethod: orderDetails.shippingMethod.id,
          paymentMethod: orderDetails.paymentMethod.id,
          items: orderDetails.items,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error || 'Failed to place order')
      
      // Save order details for confirmation page
      localStorage.setItem('lastOrder', JSON.stringify({
        ...data.order,
        isNewUser: data.isNewUser
      }))
      
      // Clear cart locally if needed (API already cleared it in DB)
      
      // Redirect to confirmation
      router.push('/checkout/cod-confirmation')
    } catch (err: any) {
      alert(err.message || 'Failed to place order. Please try again.')
    } finally {
      setPlacingOrder(false)
    }
  }

  if (loading) return <div className="p-20 text-center">Loading order details...</div>
  if (!orderDetails || orderDetails.items.length === 0) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl font-bold mb-4">No items to review</h2>
        <Button onClick={() => router.push('/cart')}>Back to Cart</Button>
      </div>
    )
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {[
              { step: 1, label: 'Address' },
              { step: 2, label: 'Shipping' },
              { step: 3, label: 'Payment' },
              { step: 4, label: 'Review' },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  item.step === 4 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  {item.step === 4 && <Check className="h-5 w-5" />}
                  {item.step < 4 && <Check className="h-5 w-5" />}
                  {item.step > 4 && <span className="font-semibold">{item.step}</span>}
                </div>
                <span className="text-sm font-medium">{item.label}</span>
                {item.step < 4 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Review Your Order</h1>
            <p className="text-muted-foreground">
              Please review your order details before confirming
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column - Order Items & Summary */}
            <div className="space-y-6">
              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items ({orderDetails.items.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y max-h-96 overflow-y-auto">
                    {orderDetails.items.map((item) => (
                      <div key={item.id} className="p-4 flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="font-semibold">{formatPrice(item.price * item.quantity, 'USD')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">{formatPrice(orderDetails.summary.subtotal, 'USD')}</span>
                  </div>
                  
                  {orderDetails.summary.savings > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>You Save</span>
                      <span className="font-semibold">-{formatPrice(orderDetails.summary.savings, 'USD')}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold">
                      {orderDetails.summary.shipping === 0 ? 'Free' : formatPrice(orderDetails.summary.shipping, 'USD')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-semibold">{formatPrice(orderDetails.summary.tax, 'USD')}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(orderDetails.summary.total, 'USD')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Shipping & Payment */}
            <div className="space-y-6">
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="font-semibold">{orderDetails.shippingAddress.fullName}</p>
                    <p className="text-sm text-muted-foreground">{orderDetails.shippingAddress.phone}</p>
                    <p className="text-sm">{orderDetails.shippingAddress.address}</p>
                    <p className="text-sm">{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.postalCode}</p>
                    <p className="text-sm">{orderDetails.shippingAddress.country}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-semibold">{orderDetails.shippingMethod.name}</p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Estimated Delivery:</span> {orderDetails.shippingMethod.eta}
                    </p>
                    {orderDetails.shippingMethod.cost === 0 && (
                      <Badge variant="secondary" className="text-xs">Free Shipping</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white rounded-lg">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-900">{orderDetails.paymentMethod.name}</p>
                        <p className="text-sm text-green-700">Pay with cash on delivery</p>
                      </div>
                    </div>
                    
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription className="text-sm text-green-800">
                        <p className="font-medium">Important:</p>
                        <p>
                          Have exact cash ready when your order arrives. The delivery courier 
                          will collect payment before handing over your items.
                        </p>
                      </AlertDescription>
                    </Alert>

                    <div className="border-t pt-3">
                        <p className="text-sm text-muted-foreground mb-1">Amount to Pay:</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatPrice(Number(orderDetails.summary.total), 'USD')}
                        </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Terms Checkbox */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      className="rounded border-gray-300 mt-1"
                      defaultChecked
                    />
                    <label htmlFor="terms" className="text-sm leading-6">
                      <span className="font-medium">I agree to the</span>{' '}
                      <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
                      {' '}and{' '}
                      <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                      <p className="text-muted-foreground mt-1">
                        I understand that by placing this order, I agree to pay the total amount 
                        in cash upon delivery.
                      </p>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.back()}>
              <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
              Back
            </Button>
            <Button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              size="lg"
              className="px-8"
            >
              {placingOrder ? (
                'Placing Order...'
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Place Order
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      <LoaderComponent />
    </PageLayout>
  )
}
