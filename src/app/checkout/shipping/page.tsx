'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageLayout } from '@/components/layout/page-layout'
import { useNavigationLoader } from '@/hooks/use-navigation-loader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Truck, Zap, Clock, ArrowRight, Check, ChevronRight } from 'lucide-react'

export default function CheckoutShippingPage() {
  const router = useRouter()
  const { navigateWithLoader, LoaderComponent } = useNavigationLoader()
  const [selectedMethod, setSelectedMethod] = useState('standard')
  const [loading, setLoading] = useState(false)
  const [shippingAddress, setShippingAddress] = useState<any>(null)

  useEffect(() => {
    // Retrieve shipping address from previous step
    const savedAddress = localStorage.getItem('selectedAddress')
    if (savedAddress) {
      setShippingAddress(JSON.parse(savedAddress))
    }
  }, [])

  const shippingMethods = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: 'Reliable delivery at no extra cost',
      icon: <Truck className="h-6 w-6" />,
      eta: '5-7 business days',
      cost: 0,
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: 'Faster delivery for urgent orders',
      icon: <Zap className="h-6 w-6" />,
      eta: '2-3 business days',
      cost: 12.99,
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      description: 'Next business day delivery',
      icon: <Clock className="h-6 w-6" />,
      eta: '1 business day',
      cost: 24.99,
    },
  ]

  const handleContinue = () => {
    setLoading(true)
    // Save selected shipping method
    const method = shippingMethods.find(m => m.id === selectedMethod)
    if (method) {
      const { icon, ...serializableMethod } = method
      localStorage.setItem('shippingMethod', JSON.stringify(serializableMethod))
    }
    
    navigateWithLoader('/checkout/payment')
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
                  item.step === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  {item.step === 2 && <Check className="h-5 w-5" />}
                  {item.step < 2 && <Check className="h-5 w-5" />}
                  {item.step > 2 && <span className="font-semibold">{item.step}</span>}
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
            <h1 className="text-3xl font-bold mb-2">Shipping Method</h1>
            <p className="text-muted-foreground">
              Choose how you'd like to receive your order
            </p>
          </div>

          {/* Shipping Methods */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Shipping Option</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {shippingMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedMethod === method.id
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-lg ${
                        selectedMethod === method.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}>
                        {method.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{method.name}</h3>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{method.eta}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {method.cost === 0 ? (
                        <span className="text-lg font-bold text-green-600">Free</span>
                      ) : (
                        <span className="text-lg font-bold">
                          ${method.cost.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p>
                    <span className="font-medium">Free Shipping:</span> Orders over $50 qualify for free standard shipping
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p>
                    <span className="font-medium">Express Options:</span> Upgrade to express or overnight shipping for faster delivery
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p>
                    <span className="font-medium">Order Tracking:</span> Track your order in real-time once shipped
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address Summary */}
          <Card className="mb-6 bg-muted/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Truck className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Delivering to:</h3>
              </div>
              {shippingAddress ? (
                <div className="text-sm space-y-1 pl-8">
                  <p><strong>{shippingAddress.fullName}</strong></p>
                  <p>{shippingAddress.address}</p>
                  <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
                  <p>{shippingAddress.phone}</p>
                </div>
              ) : (
                <div className="text-sm pl-8 text-muted-foreground italic">
                  Address information not found
                </div>
              )}
              <Button variant="link" className="pl-8" onClick={() => router.push('/checkout/address')}>
                Change address
              </Button>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.push('/checkout/address')}>
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
                  Continue to Payment
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
