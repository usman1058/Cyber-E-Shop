'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  CheckCircle, 
  Package, 
  Truck, 
  DollarSign, 
  ArrowRight,
  Clock,
  MapPin
} from 'lucide-react'
import { CompleteProfileModal } from '@/components/checkout/complete-profile-modal'

export default function CODConfirmationPage() {
  const router = useRouter()
  const [orderId, setOrderId] = useState('')
  const [estimatedDelivery, setEstimatedDelivery] = useState('')
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [tempPassword, setTempPassword] = useState('')
  const [userData, setUserData] = useState<{ email: string; name?: string }>({ email: '' })

  useEffect(() => {
    // Get order ID from localStorage
    const lastOrder = localStorage.getItem('lastOrder')
    if (lastOrder) {
      const order = JSON.parse(lastOrder)
      setOrderId(order.orderNumber)
      
      if (order.isNewUser) {
        setShowProfileModal(true)
        setTempPassword(order.tempPassword || '')
        setUserData({
          email: order.guestEmail || order.email || '', 
          name: order.guestName || order.name || '',
        })
      }
      
      // Calculate estimated delivery
      const deliveryDate = new Date(order.estimatedDelivery || Date.now())
      deliveryDate.setDate(deliveryDate.getDate() + 7) // +7 days for standard shipping
      setEstimatedDelivery(deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }))
    }
  }, [])

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>

          {/* Confirmation Message */}
          <Card className="mb-6">
            <CardContent className="p-8 text-center space-y-4">
              <h1 className="text-3xl font-bold text-green-900">Order Confirmed!</h1>
              <p className="text-lg text-muted-foreground">
                Thank you for your order. We've received it successfully.
              </p>
              
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Order Reference:</p>
                <p className="text-xl font-bold text-green-800">{orderId || 'ORD-2024-XXX'}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <p className="font-medium text-green-900">Payment Method:</p>
                    <p className="text-sm text-green-700">Cash on Delivery (COD)</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <p className="font-medium text-green-900">Amount to Pay:</p>
                    <p className="text-2xl font-bold text-green-800">$2,051.97</p>
                    <p className="text-xs text-green-600">Pay exact amount in cash</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Estimated Delivery Date</p>
                  <p className="text-lg">{estimatedDelivery}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Delivery Address</p>
                  <div className="text-sm text-muted-foreground mt-1">
                    <p>John Doe</p>
                    <p>123 Cyber Street, Tech City, CA 90210</p>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What Happens Next */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 items-center justify-center bg-primary text-primary-foreground rounded-full flex-shrink-0 text-sm font-bold">1</span>
                  <p className="text-sm">You'll receive an order confirmation email shortly</p>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 items-center justify-center bg-primary text-primary-foreground rounded-full flex-shrink-0 text-sm font-bold">2</span>
                  <p className="text-sm">We'll prepare your order for shipment within 1-2 business days</p>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 items-center justify-center bg-primary text-primary-foreground rounded-full flex-shrink-0 text-sm font-bold">3</span>
                  <p className="text-sm">You'll receive a shipping notification with tracking number</p>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 items-center justify-center bg-primary text-primary-foreground rounded-full flex-shrink-0 text-sm font-bold">4</span>
                  <p className="text-sm">Courier will deliver to your address and collect payment</p>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card className="mb-6 bg-yellow-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <DollarSign className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-2">Cash on Delivery Reminder</p>
                  <p>
                    Please ensure you have the exact amount in cash when the courier arrives. 
                    The courier cannot provide change for large amounts.
                  </p>
                  <p className="mt-2">
                    Have questions? Contact us at{' '}
                    <a href="tel:+18001234567" className="font-medium hover:underline">
                      +1 (800) 123-4567
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button onClick={() => router.push(`/track-order/${orderId}`)} className="w-full" size="lg">
              <Truck className="mr-2 h-5 w-5" />
              Track Your Order
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button variant="outline" onClick={() => router.push('/')} className="w-full">
              Continue Shopping
            </Button>
          </div>

          {/* Contact Info */}
          <div className="text-center pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              Need help?{' '}
              <a href="/contact" className="text-primary hover:underline">Contact our support team</a>
            </p>
          </div>
        </div>
      </div>

      <CompleteProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)}
        userEmail={userData.email}
        userName={userData.name}
        tempPassword={tempPassword}
      />
    </PageLayout>
  )
}
