'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Users,
  MessageSquare,
  AlertTriangle,
  Package,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ArrowRight,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface KPICard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
  color: string;
}

interface AlertItem {
  id: string;
  type: 'stock' | 'order' | 'system';
  message: string;
  time: string;
  severity: 'low' | 'medium' | 'high';
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = data?.stats || {
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    openTickets: 0,
  };

  const kpiData: KPICard[] = [
    {
      title: 'Total Sales',
      value: `$${stats.totalSales.toLocaleString()}`,
      change: '+0%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      change: '+0%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-blue-600',
    },
    {
      title: 'Active Users',
      value: stats.totalUsers.toString(),
      change: '+0%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600',
    },
    {
      title: 'Open Tickets',
      value: stats.openTickets.toString(),
      change: '+0%',
      trend: 'down',
      icon: MessageSquare,
      color: 'text-orange-600',
    },
  ];

  const lowStockProducts = data?.lowStockProducts || [];
  const recentOrders = data?.recentOrders || [];
  const alerts: AlertItem[] = data?.alerts || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back! Here's what's happening across your store today.</p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className={`text-xs ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.trend === 'up' ? <TrendingUp className="inline h-3 w-3 mr-1" /> : <TrendingDown className="inline h-3 w-3 mr-1" />}
                  {kpi.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {alerts.some((a) => a.severity === 'high') && (
        <Card className="border-orange-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.filter((a) => a.severity === 'high').map((alert) => (
                <div key={alert.id} className="flex items-start justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Low Stock Alert</CardTitle>
              <CardDescription>Products that need restocking</CardDescription>
            </div>
            <Link href="/admin/inventory">
              <Button variant="outline" size="sm">View All <ArrowRight className="h-4 w-4 ml-2" /></Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockProducts.map((product: any) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sku}</p>
                  </div>
                  <Badge variant="destructive">{product.stock} left</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </div>
            <Link href="/admin/orders">
              <Button variant="outline" size="sm">View All <ArrowRight className="h-4 w-4 ml-2" /></Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{order.total}</p>
                    <Badge variant={order.status === 'delivered' ? 'secondary' : order.status === 'shipped' ? 'default' : 'outline'} className="text-xs capitalize">{order.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/products/new"><Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2"><Package className="h-6 w-6" /><span>Add Product</span></Button></Link>
            <Link href="/admin/orders"><Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2"><ShoppingCart className="h-6 w-6" /><span>Process Orders</span></Button></Link>
            <Link href="/admin/inventory"><Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2"><AlertTriangle className="h-6 w-6" /><span>Check Inventory</span></Button></Link>
            <Link href="/admin/tickets"><Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2"><MessageSquare className="h-6 w-6" /><span>View Tickets</span></Button></Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
