'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { 
  Package, 
  Calendar, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Truck, 
  Eye,
  Filter,
  ChevronRight
} from 'lucide-react'

// Define a type for the Order object for better type safety
type OrderStatus = 'Delivered' | 'Shipped' | 'Pending' | 'Processing' | 'Cancelled'

interface Order {
  id: string
  date: string
  status: OrderStatus
  total: number
  items: number
  paymentMethod: string
  estimatedDelivery: string
}

export default function OrderHistoryPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Simulate fetching orders with recent dates for filtering to work
    const today = new Date()
    const mockData: Order[] = [
      {
        id: 'ORD-2024-001',
        date: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days ago
        status: 'Delivered',
        total: 1299.99,
        items: 3,
        paymentMethod: 'COD',
        estimatedDelivery: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      {
        id: 'ORD-2024-002',
        date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days ago
        status: 'Shipped',
        total: 599.99,
        items: 2,
        paymentMethod: 'Credit Card',
        estimatedDelivery: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      {
        id: 'ORD-2024-003',
        date: new Date().toISOString().split('T')[0], // Today
        status: 'Pending',
        total: 249.99,
        items: 1,
        paymentMethod: 'COD',
        estimatedDelivery: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      {
        id: 'ORD-2023-150',
        date: new Date(today.getTime() - 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 40 days ago
        status: 'Cancelled',
        total: 899.99,
        items: 1,
        paymentMethod: 'COD',
        estimatedDelivery: new Date(today.getTime() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
    ]
    setOrders(mockData)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Delivered</Badge>
      case 'Shipped':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Shipped</Badge>
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>
      case 'Processing':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Processing</Badge>
      case 'Cancelled':
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'Shipped':
        return <Truck className="h-5 w-5 text-blue-600" />
      case 'Pending':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'Processing':
        return <Clock className="h-5 w-5 text-purple-600" />
      case 'Cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Package className="h-5 w-5 text-gray-600" />
    }
  }

  const filteredOrders = orders.filter(order => {
    // Filter by Status
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter

    // Filter by Search Query
    const matchesSearch = !searchQuery || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by Date Range
    let matchesDate = true
    if (dateRange !== 'all') {
      const days = parseInt(dateRange)
      const orderDate = new Date(order.date)
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)
      matchesDate = orderDate >= cutoffDate
    }

    return matchesStatus && matchesSearch && matchesDate
  })

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Order History</h1>
            <p className="text-muted-foreground">
              View and manage all your orders
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-6 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders by ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">Status:</span>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Orders</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">Time Period:</span>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Filter by date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="30">Last 30 Days</SelectItem>
                        <SelectItem value="90">Last 90 Days</SelectItem>
                        <SelectItem value="180">Last 6 Months</SelectItem>
                        <SelectItem value="365">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or place a new order
                </p>
                <Button onClick={() => router.push('/')}>
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6">
                    {/* Use flex-col for mobile, flex-row for desktop */}
                    <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                      
                      {/* Left Side: Order Info */}
                      <div className="flex-1 space-y-4 w-full">
                        
                        {/* Order Header: ID, Status, Date */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 pb-4 border-b">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Package className="h-5 w-5 text-primary" />
                              <h3 className="font-semibold text-lg">{order.id}</h3>
                              {getStatusBadge(order.status)}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(order.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                        </div>

                        {/* Order Details Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Items</p>
                            <p className="font-medium">{order.items} item{order.items !== 1 ? 's' : ''}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Payment</p>
                            <p className="font-medium">{order.paymentMethod}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Total</p>
                            <p className="font-medium text-base">${order.total.toFixed(2)}</p>
                          </div>
                          <div>
                            {order.estimatedDelivery && order.status !== 'Cancelled' && (
                              <>
                                <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Est. Delivery</p>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(order.status)}
                                  <p className="font-medium">{new Date(order.estimatedDelivery).toLocaleDateString('en-US')}</p>
                                </div>
                              </>
                            )}
                            {order.status === 'Cancelled' && (
                              <>
                                <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Status</p>
                                <div className="flex items-center gap-1 text-red-600">
                                   <XCircle className="h-4 w-4" />
                                   <p className="font-medium">Cancelled</p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Action Button */}
                      <div className="flex-shrink-0 w-full md:w-auto">
                         <Button
                          variant="outline"
                          onClick={() => router.push(`/account/orders/${order.id}`)}
                          className="w-full md:w-auto"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Help Info */}
          <Card className="mt-6 bg-muted/50">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Need help with an order?{' '}
                <Link href="/contact" className="text-primary hover:underline font-medium">
                  Contact our support team
                </Link>{' '}
                or track your order{' '}
                <Link href="/track-order" className="text-primary hover:underline font-medium">
                  here
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}