'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Truck,
  CheckCircle,
  Clock,
  Package,
  MapPin,
  RefreshCw
} from 'lucide-react'

export default function OrderTrackingPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [trackingResult, setTrackingResult] = useState<any>(null)

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Please enter an order ID or tracking number')
      return
    }

    setLoading(true)
    setTrackingResult(null)

    try {
      const res = await fetch(`/api/orders/${searchQuery.trim()}`)
      const data = await res.json()

      if (data.success && data.order) {
        const order = data.order
        setTrackingResult({
          orderId: order.orderNumber,
          trackingNumber: order.trackingNumber || 'Pending',
          carrier: order.carrier || 'Standard',
          status: order.status,
          estimatedDelivery: order.estimatedDelivery || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          actualDelivery: order.actualDelivery,
          shippingAddress: {
            fullName: order.address?.fullName || order.guestName || 'Customer',
            address: `${order.address?.address}, ${order.address?.city}, ${order.address?.state} ${order.address?.postalCode}`,
          },
          timeline: [
            {
              date: new Date(order.createdAt).toLocaleDateString(),
              time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'Order Placed',
              description: 'Your order has been confirmed',
              icon: <Package className="h-5 w-5" />
            },
            ...(order.status !== 'pending' ? [{
              date: new Date(order.updatedAt).toLocaleDateString(),
              time: new Date(order.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: order.status,
              description: `Order status updated to ${order.status}`,
              icon: <Truck className="h-5 w-5" />
            }] : [])
          ],
        })
      } else {
        alert(data.error || 'Order not found')
      }
    } catch (err) {
      console.error('Tracking error:', err)
      alert('Failed to track order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
      case 'Out for Delivery':
        return <Badge className="bg-blue-100 text-blue-800">Out for Delivery</Badge>
      case 'In Transit':
        return <Badge className="bg-purple-100 text-purple-800">In Transit</Badge>
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
            <p className="text-muted-foreground">
              Enter your order ID or tracking number to get real-time updates
            </p>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Enter Order ID or Tracking Number"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-12 h-12 text-lg"
                    />
                  </div>
                </div>
                <Button onClick={handleSearch} disabled={loading} size="lg">
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                      Tracking...
                    </>
                  ) : (
                    <>
                      Track Order
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Result */}
          {trackingResult && (
            <>
              {/* Status Card */}
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Order Status</CardTitle>
                    {getStatusBadge(trackingResult.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="font-semibold">{trackingResult.orderId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tracking Number</p>
                      <p className="font-semibold">{trackingResult.trackingNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Carrier</p>
                      <p className="font-semibold">{trackingResult.carrier}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                      <p className="font-semibold">{new Date(trackingResult.estimatedDelivery).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {trackingResult.actualDelivery && trackingResult.status === 'Delivered' && (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="font-semibold text-green-900">Delivered!</p>
                          <p className="text-sm text-green-700">
                            Delivered on {new Date(trackingResult.actualDelivery).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Address */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="font-semibold">{trackingResult.shippingAddress.fullName}</p>
                    <p className="text-sm">{trackingResult.shippingAddress.address}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trackingResult.timeline.map((event, index) => (
                      <div key={index} className="flex gap-4">
                        <div className={`p-3 rounded-full ${index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          }`}>
                          {event.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold">{event.status}</p>
                              <p className="text-sm text-muted-foreground">{event.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">{event.date}</p>
                              <p className="text-xs text-muted-foreground">{event.time}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Help */}
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Need help with your order? Contact our support team
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/account/orders">View All Orders</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
