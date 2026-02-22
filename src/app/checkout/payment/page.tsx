'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageLayout } from '@/components/layout/page-layout'
import { useCart } from '@/hooks/use-cart'
import { useCurrency } from '@/hooks/use-currency'
import { useNavigationLoader } from '@/hooks/use-navigation-loader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, DollarSign, ArrowRight, Check, ChevronRight, Tag, AlertCircle } from 'lucide-react'

export default function CheckoutPaymentPage() {
  const router = useRouter()
  const { summary: cartSummary, loading: cartLoading } = useCart()
  const { formatPrice } = useCurrency()
  const { navigateWithLoader, LoaderComponent } = useNavigationLoader()
  const [selectedPayment, setSelectedPayment] = useState('cod')
  const [loading, setLoading] = useState(false)

  const paymentMethods = [
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay with cash when your order is delivered',
      icon: <DollarSign className="h-6 w-6" />,
      isDefault: true,
      badges: ['Default', 'No Fees'],
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Pay securely with your saved cards',
      icon: <CreditCard className="h-6 w-6" />,
      isDefault: false,
      badges: ['Coming Soon'],
    },
  ]

  useEffect(() => {
    // State managed by useCart
  }, [])

  const handleContinue = () => {
    setLoading(true)
    // Save payment method
    const method = paymentMethods.find(m => m.id === selectedPayment)
    if (method) {
      const { icon, ...serializableMethod } = method
      localStorage.setItem('paymentMethod', JSON.stringify(serializableMethod))
    }

    setTimeout(() => {
      if (selectedPayment === 'cod') {
        navigateWithLoader('/checkout/review')
      } else {
        // For card payments, would integrate with bank API in future
        alert('Card payments coming soon. Please use COD for now.')
      }
    }, 500)
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
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${item.step === 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                  {item.step === 3 && <Check className="h-5 w-5" />}
                  {item.step < 3 && <Check className="h-5 w-5" />}
                  {item.step > 3 && <span className="font-semibold">{item.step}</span>}
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
            <h1 className="text-3xl font-bold mb-2">Payment Method</h1>
            <p className="text-muted-foreground">
              Choose how you'd like to pay for your order
            </p>
          </div>

          {/* Payment Methods */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Payment Option</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-colors ${selectedPayment === method.id
                    ? 'border-primary bg-primary/5'
                    : method.id === 'card'
                      ? 'border-muted opacity-50'
                      : 'border-muted hover:border-primary/50'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-lg ${selectedPayment === method.id
                        ? 'bg-primary text-primary-foreground'
                        : method.id === 'card'
                          ? 'bg-muted'
                          : 'bg-muted'
                        }`}>
                        {method.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{method.name}</h3>
                          {method.badges.map((badge) => (
                            <Badge
                              key={badge}
                              variant={badge === 'Default' ? 'default' : 'secondary'}
                              className="ml-2"
                            >
                              {badge}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </div>
                    {method.id === 'card' && (
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* COD Info */}
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 rounded-full flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-2">Cash on Delivery (COD)</p>
                  <p className="mb-2">
                    Your default payment option. No credit card required. Pay the exact amount in cash when your order arrives.
                  </p>
                  <ul className="space-y-1">
                    <li>• No additional fees or surcharges</li>
                    <li>• Payment collected by delivery courier</li>
                    <li>• Receipt provided for your records</li>
                    <li>• Available for all orders within service area</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatPrice(cartSummary.subtotal, 'USD')}</span>
              </div>

              {cartSummary.savings > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>You Save</span>
                  <span className="font-semibold">-{formatPrice(cartSummary.savings, 'USD')}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-semibold">
                  {cartSummary.shipping === 0 ? 'Free' : formatPrice(cartSummary.shipping, 'USD')}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-semibold">{formatPrice(cartSummary.tax, 'USD')}</span>
              </div>

              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(cartSummary.total, 'USD')}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  * Final amount to be paid in cash upon delivery
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Promo Code */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-sm font-medium">Have a Promo Code?</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Enter code"
                      className="flex-1"
                    />
                    <Button variant="outline">Apply</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.back()}>
              <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
              Back
            </Button>
            <Button
              onClick={handleContinue}
              disabled={loading}
              size="lg"
            >
              {loading ? 'Processing...' : (
                <>
                  Review Order
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
