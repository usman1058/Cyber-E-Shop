'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from '@/hooks/use-session'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ShoppingCart,
  Heart,
  Package,
  MessageSquare,
  Bell,
  Settings,
  CreditCard,
  MapPin,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  AlertCircle,
  ChevronRight,
  ShoppingBag,
  User,
  Shield
} from 'lucide-react'

export default function AccountDashboard() {
  const router = useRouter()
  const { session, loading: sessionLoading, guestId } = useSession()
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    wishlistItems: 0,
    activeWarranties: 0,
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.isAuthenticated || guestId) {
      fetchUserData()
    }
  }, [session, guestId])

  const fetchUserData = async () => {
    if (!session?.user?.id && !guestId) return

    try {
      setLoading(true)

      // Fetch user data from APIs
      const userId = session?.user?.id || ''
      
      const [ordersRes, wishlistRes, notificationsRes] = await Promise.all([
        fetch(`/api/orders?userId=${userId}&sessionId=${guestId || ''}`),
        fetch(`/api/wishlist?userId=${userId}&sessionId=${guestId || ''}`),
        fetch(`/api/user/notifications?userId=${userId}&sessionId=${guestId || ''}`)
      ])

      const ordersData = await ordersRes.json()
      const wishlistData = await wishlistRes.json()
      const notificationsData = await notificationsRes.json()

      setStats({
        totalOrders: ordersData.orders?.length || 0,
        pendingOrders: ordersData.orders?.filter((o: any) => o.status === 'Pending').length || 0,
        wishlistItems: wishlistData.wishlist?.length || 0,
        activeWarranties: 0,
      })

      setRecentOrders(ordersData.orders?.slice(0, 5) || [])
      setNotifications(notificationsData.notifications || [])
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      // Fallback to placeholder if API fails or is not yet fully compatible
      setStats({
        totalOrders: 0,
        pendingOrders: 0,
        wishlistItems: 0,
        activeWarranties: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'Shipped':
        return <Truck className="h-4 w-4 text-blue-600" />
      case 'Pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'Cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
      case 'Shipped':
        return <Badge className="bg-blue-100 text-blue-800">Shipped</Badge>
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'Cancelled':
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const quickLinks = [
    { icon: ShoppingBag, label: 'My Orders', href: '/account/orders', count: stats.totalOrders },
    { icon: Heart, label: 'Wishlist', href: '/account/wishlist', count: stats.wishlistItems },
    { icon: MessageSquare, label: 'Support Tickets', href: '/account/tickets', count: 0 },
    { icon: Bell, label: 'Notifications', href: '/account/notifications', count: notifications.filter(n => n.unread).length },
  ]

  const accountSettings = [
    { icon: User, label: 'Profile Settings', href: '/account/profile' },
    { icon: MapPin, label: 'Address Book', href: '/account/addresses' },
    { icon: CreditCard, label: 'Payment Methods', href: '/account/payment-methods' },
    { icon: Shield, label: 'Security', href: '/account/security' },
  ]

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {(sessionLoading || loading) ? (
          <div className="space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
              <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Guest Welcome / Login CTA */}
            {!session?.isAuthenticated && (
              <Alert className="mb-8 border-primary/20 bg-primary/5">
                <User className="h-5 w-5 text-primary" />
                <AlertDescription className="flex items-center justify-between w-full">
                  <span>
                    <strong>Guest Session:</strong> You are currently browsing as a guest. 
                    Login to sync your orders and wishlist across devices.
                  </span>
                  <Button size="sm" onClick={() => router.push('/login')} className="ml-4">
                    Login / Sign Up
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">
                {session?.isAuthenticated 
                  ? `Welcome back, ${session.user?.name?.split(' ')[0] || 'there'}!` 
                  : 'Welcome, Guest!'}
              </h1>
              <p className="text-muted-foreground">
                {session?.isAuthenticated 
                  ? "Here's an overview of your account and recent activity"
                  : "Track your current guest session activity below"}
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Sidebar - Account Info */}
              <div className="lg:col-span-1 space-y-6">
                {/* Profile Card */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">
                          {session?.user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{session?.user?.name || 'Guest User'}</h3>
                        <p className="text-sm text-muted-foreground">{session?.user?.email || 'No email associated'}</p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Email</span>
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          Verified
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Default Payment</span>
                        <Badge variant="secondary">COD</Badge>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full mt-4" asChild disabled={!session?.isAuthenticated}>
                      <Link href="/account/profile">
                        <Settings className="mr-2 h-4 w-4" />
                        {session?.isAuthenticated ? 'Edit Profile' : 'Login to Edit'}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Links */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Links</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    {quickLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <link.icon className="h-5 w-5 text-primary" />
                          <span className="font-medium">{link.label}</span>
                        </div>
                        {link.count !== undefined && (
                          <Badge variant="secondary">{link.count}</Badge>
                        )}
                      </Link>
                    ))}
                  </CardContent>
                </Card>

                {/* Account Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    {accountSettings.map((setting) => (
                      <Link
                        key={setting.href}
                        href={setting.href}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <setting.icon className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{setting.label}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Stats Cards */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <Package className="h-5 w-5 text-primary" />
                        <Badge variant="secondary" className="text-xs">{stats.pendingOrders} Pending</Badge>
                      </div>
                      <div className="text-2xl font-bold">{stats.totalOrders}</div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <Heart className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-2xl font-bold">{stats.wishlistItems}</div>
                      <p className="text-sm text-muted-foreground">Wishlist Items</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-2xl font-bold">{stats.activeWarranties}</div>
                      <p className="text-sm text-muted-foreground">Active Warranties</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <Truck className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-2xl font-bold">5</div>
                      <p className="text-sm text-muted-foreground">Active Shipments</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Orders */}
                <Card>
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle>Recent Orders</CardTitle>
                    <Button variant="ghost" asChild>
                      <Link href="/account/orders">
                        View All
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{order.id}</span>
                                {getStatusBadge(order.status)}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Package className="h-4 w-4" />
                                  {order.items} item{order.items > 1 ? 's' : ''}
                                </div>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(order.status)}
                                  {order.date}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg">${order.total.toFixed(2)}</div>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/account/orders/${order.id}`}>
                                  View Details
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle>Recent Notifications</CardTitle>
                    <Button variant="ghost" asChild>
                      <Link href="/account/notifications">
                        View All
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-muted/50 transition-colors ${notification.unread ? 'bg-primary/5' : ''
                            }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${notification.type === 'promotion' ? 'bg-orange-100' :
                              notification.type === 'shipping' ? 'bg-blue-100' :
                                notification.type === 'stock' ? 'bg-green-100' : 'bg-gray-100'
                              }`}>
                              <Bell className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="font-semibold">{notification.title}</h4>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {notification.date}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {notification.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  )
}
