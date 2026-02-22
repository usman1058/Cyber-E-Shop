'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertCircle, Home, ChevronLeft, Package } from 'lucide-react'
import { CompleteProfileModal } from '@/components/checkout/complete-profile-modal'
import { useEffect } from 'react'

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const [orderId, setOrderId] = useState('ORD-2024-001')
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [tempPassword, setTempPassword] = useState('')
  const [userData, setUserData] = useState<{ email: string; name?: string }>({ email: '' })

  useEffect(() => {
    const lastOrder = localStorage.getItem('lastOrder')
    if (lastOrder) {
      const order = JSON.parse(lastOrder)
      setOrderId(order.orderNumber)
      
      if (order.isNewUser) {
        setShowProfileModal(true)
        setTempPassword(order.tempPassword || '')
        setUserData({
          email: order.guestEmail || order.userEmail || '',
          name: order.guestName || order.userName || '',
        })
      }
    }
  }, [])

  const handleTrackOrder = () => {
    router.push(`/track-order/${orderId}`)
  }

  const handleContinueShopping = () => {
    router.push('/')
  }

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

          {/* Success Message */}
          <Card className="mb-6">
            <CardContent className="p-8 text-center space-y-4">
              <h1 className="text-3xl font-bold">Order Placed Successfully!</h1>
              <p className="text-lg text-muted-foreground">
                Thank you for your order. Your order has been confirmed.
              </p>
              
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Order Reference:</p>
                <p className="text-2xl font-bold text-green-800">{orderId}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 text-left">
                  <Package className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Estimated Delivery:</p>
                    <p className="text-sm text-muted-foreground">January 22, 2024</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-left">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Payment Method:</p>
                    <p className="text-sm text-muted-foreground">Cash on Delivery (COD)</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Pay the total amount in cash when your order arrives
                    </p>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertDescription className="text-sm">
                  You will receive an email confirmation shortly with all order details. 
                  You can also track your order using the reference number above.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button onClick={handleTrackOrder} className="w-full" size="lg">
              <Package className="mr-2 h-5 w-5" />
              Track Your Order
            </Button>
            <Button variant="outline" onClick={handleContinueShopping} className="w-full">
              <Home className="mr-2 h-5 w-5" />
              Continue Shopping
            </Button>
            <Button variant="ghost" onClick={() => router.push('/account/orders')} className="w-full">
              <ChevronLeft className="mr-2 h-4 w-4" />
              View Order History
            </Button>
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
