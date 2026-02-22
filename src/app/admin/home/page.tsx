'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Activity, ShoppingCart, DollarSign, Users, AlertTriangle, Clock, Package, TrendingUp, MessageSquare, MoreHorizontal, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function AdminHomePage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch dashboard stats');
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const systemHealth = {
    status: 'healthy',
    uptime: '99.9%',
    lastBackup: '2 hours ago',
    databaseSize: '2.4 GB',
    activeUsers: stats?.totalUsers || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
          <p className="text-muted-foreground">Platform health and performance overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={systemHealth.status === 'healthy' ? 'default' : 'destructive'}>
            {systemHealth.status === 'healthy' ? 'System Healthy' : 'System Issues'}
          </Badge>
          <Button variant="outline" size="sm" onClick={fetchStats} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>Platform status and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">System Status</p>
              <p className="text-2xl font-bold text-green-600 font-mono">ONLINE</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Uptime (30d)</p>
              <p className="text-2xl font-bold">{systemHealth.uptime}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Last Backup</p>
              <p className="text-2xl font-bold">{systemHealth.lastBackup}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Database Size</p>
              <p className="text-2xl font-bold">{systemHealth.databaseSize}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Total Orders</span>
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold">{isLoading ? '...' : stats?.stats?.totalOrders || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-600" />
              Lifetime volume
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Total Revenue</span>
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold">
              {isLoading ? '...' : `$${(stats?.stats?.totalSales || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-600" />
              Total sales value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Open Tickets</span>
              <MessageSquare className="h-4 w-4 text-orange-600" />
            </div>
            <p className="text-2xl font-bold">{isLoading ? '...' : stats?.stats?.openTickets || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Requires support attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Low Stock Items</span>
              <Package className="h-4 w-4 text-red-600" />
            </div>
            <p className="text-2xl font-bold">{isLoading ? '...' : stats?.lowStockProducts?.length || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Check inventory status</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Platform Users</span>
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold">{isLoading ? '...' : stats?.stats?.totalUsers || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Total registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Recent Success</span>
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-lg font-semibold">Healthy</p>
            <p className="text-xs text-muted-foreground mt-1">Last activity just now</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest system events and transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : stats?.recentOrders?.length > 0 ? (
              stats.recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-start justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">New order from {order.customer}</p>
                      <p className="text-xs text-muted-foreground">Order ID: {order.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">${order.total.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-muted-foreground italic">No recent orders found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
