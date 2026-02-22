'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Package, 
  MapPin, 
  Truck, 
  DollarSign, 
  Download, 
  RefreshCw,
  ChevronLeft,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Simulate fetching order details
    setOrder({
      id: orderId,
      date: '2024-01-15',
      status: 'Delivered',
      total: 1299.99,
      subtotal: 1199.99,
      shipping: 0,
      tax: 100.00,
      paymentMethod: 'COD',
      estimatedDelivery: '2024-01-22',
      actualDelivery: '2024-01-21',
      items: [
        {
          id: '1',
          name: 'Ultra HD 4K Smart TV 65"',
          price: 1299.99,
          quantity: 1,
          image: '/images/products/tv.jpg',
          status: 'Delivered',
        },
      ],
      shippingAddress: {
        fullName: 'John Doe',
        phone: '+1 (555) 123-4567',
        address: '123 Cyber Street',
        city: 'Tech City',
        state: 'CA',
        postalCode: '90210',
        country: 'USA',
      },
      tracking: {
        carrier: 'FedEx',
        trackingNumber: '123456789012',
        status: 'Delivered',
        history: [
          { date: '2024-01-15', status: 'Order Placed', description: 'Your order has been confirmed' },
          { date: '2024-01-17', status: 'Shipped', description: 'Order picked up by courier' },
          { date: '2024-01-21', status: 'Out for Delivery', description: 'Package is out for delivery' },
          { date: '2024-01-21', status: 'Delivered', description: 'Package delivered successfully' },
        ],
      },
    })
  }, [orderId])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
      case 'Shipped':
        return <Badge className="bg-blue-100 text-blue-800">Shipped</Badge>
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const downloadInvoice = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert('Invoice downloaded!')
    }, 1000)
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Order Details</h1>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">Order ID:</span>
              <span className="text-xl font-semibold">{order?.id}</span>
              {getStatusBadge(order?.status)}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Items ({order?.items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {order?.items.map((item) => (
                      <div key={item.id} className="p-6 flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold">{item.name}</h3>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                            <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                          <div className="mt-1">
                            {getStatusBadge(item.status)}
                          </div>
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
                    <span className="font-semibold">${order?.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold">
                      {order?.shipping === 0 ? 'Free' : `$${order?.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-semibold">${order?.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ${order?.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-muted-foreground">
                      Paid via <span className="font-medium">Cash on Delivery</span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Shipping & Tracking */}
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
                    <p className="font-semibold">{order?.shippingAddress?.fullName}</p>
                    <p className="text-sm text-muted-foreground">{order?.shippingAddress?.phone}</p>
                    <p className="text-sm">{order?.shippingAddress?.address}</p>
                    <p className="text-sm">{order?.shippingAddress?.city}, {order?.shippingAddress?.state} {order?.shippingAddress?.postalCode}</p>
                    <p className="text-sm">{order?.shippingAddress?.country}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Tracking */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Track Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Carrier</p>
                      <p className="font-semibold">{order?.tracking?.carrier}</p>
                    </div>
                    <a href={`https://www.fedex.com/tracking/${order?.tracking?.trackingNumber}`} 
                       target="_blank" rel="noopener noreferrer"
                       className="text-primary text-sm hover:underline">
                      Track on carrier site
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tracking Number</p>
                    <p className="font-semibold">{order?.tracking?.trackingNumber}</p>
                  </div>
                  
                  {/* Tracking Timeline */}
                  <div className="space-y-3">
                    {order?.tracking?.history?.map((event, index) => (
                      <div key={index} className="flex gap-3">
                        <div className={`p-2 rounded-full ${
                          index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          {index === 0 && <CheckCircle className="h-3 w-3" />}
                          {index > 0 && <Clock className="h-3 w-3" />}
                        </div>
                        <div className="flex-1 text-sm">
                          <p className="font-medium">{event.status}</p>
                          <p className="text-muted-foreground">{event.description}</p>
                          <p className="text-xs text-muted-foreground">{event.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="space-y-3">
                  <Button
                    onClick={downloadInvoice}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Download Invoice
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/account/return-request">
                      Return Item
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/contact">
                      Contact Support
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
