'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Download, Calendar, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AnalyticsData {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  averageOrderValue: number;
  trend: { date: string, revenue: number }[];
  topCategories: { name: string, revenue: number, orders: number, percentage: number }[];
}

const salesData = {
  totalRevenue: 456789.00,
  revenueChange: 12.5,
  totalOrders: 1234,
  ordersChange: 8.2,
  averageOrderValue: 156.78,
  aovChange: 4.3,
  conversionRate: 3.2,
  conversionChange: 0.5,
};

const monthlyData = [
  { month: 'Jan', revenue: 125000, orders: 800 },
  { month: 'Feb', revenue: 138000, orders: 920 },
  { month: 'Mar', revenue: 142000, orders: 950 },
  { month: 'Apr', revenue: 128000, orders: 860 },
  { month: 'May', revenue: 156000, orders: 1020 },
  { month: 'Jun', revenue: 148000, orders: 980 },
];

const categoryData = [
  { name: 'Electronics', revenue: 145000, percentage: 32, orders: 450 },
  { name: 'Wearables', revenue: 125000, percentage: 27, orders: 520 },
  { name: 'Gaming', revenue: 98000, percentage: 21, orders: 380 },
  { name: 'Accessories', revenue: 88889, percentage: 20, orders: 650 },
];

export default function SalesAnalyticsPage() {
  const [dateRange, setDateRange] = useState('30days');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSalesData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?range=${dateRange}`);
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        toast.error(result.message || 'Failed to fetch sales analytics');
      }
    } catch (error) {
      console.error('Error fetching sales analytics:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Analytics</h1>
          <p className="text-sm text-muted-foreground">Revenue and order performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${data?.totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className={data?.revenueChange && data.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                {data?.revenueChange && data.revenueChange >= 0 ? <TrendingUp className="inline h-3 w-3" /> : <TrendingDown className="inline h-3 w-3" />}
                {Math.abs(data?.revenueChange || 0).toFixed(1)}%
              </span>
              {' '}from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalOrders || '0'}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className={data?.ordersChange && data.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                {data?.ordersChange && data.ordersChange >= 0 ? <TrendingUp className="inline h-3 w-3" /> : <TrendingDown className="inline h-3 w-3" />}
                {Math.abs(data?.ordersChange || 0).toFixed(1)}%
              </span>
              {' '}from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data?.averageOrderValue?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on {data?.totalOrders} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Data Freshness</CardTitle>
            <RefreshCw className={`h-4 w-4 text-orange-600 ${isLoading ? 'animate-spin' : ''}`} />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">Real-time</div>
            <p className="text-xs text-muted-foreground mt-1">
              Auto-sync enabled
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2 px-2">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center"><RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" /></div>
              ) : data?.trend.map((d, index) => {
                const maxValue = Math.max(...data.trend.map(t => t.revenue), 1);
                const height = (d.revenue / maxValue) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center group relative">
                    <div className="w-full bg-primary rounded-t transition-all hover:bg-primary/80" style={{ height: `${Math.max(height, 5)}%` }} />
                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-popover border p-2 rounded text-[10px] whitespace-nowrap z-10">
                      {new Date(d.date).toLocaleDateString()}: ${d.revenue.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
            {!isLoading && <div className="flex justify-between mt-4 px-2 text-[10px] text-muted-foreground italic">
              <span>Start: {data?.trend[0]?.date}</span>
              <span>End: {data?.trend[data.trend.length - 1]?.date}</span>
            </div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
            <CardDescription>Top performing product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-12"><RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : data?.topCategories.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No category data found</div>
              ) : data?.topCategories.map((category, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-sm font-bold">${category.revenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${category.percentage}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                    <span>{category.orders} order items</span>
                    <span>{category.percentage.toFixed(1)}% of revenue</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method Distribution</CardTitle>
          <CardDescription>Revenue breakdown by payment type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'COD', revenue: 178450, percentage: 39, orders: 482 },
              { name: 'Credit Card', revenue: 195230, percentage: 43, orders: 568 },
              { name: 'PayPal', revenue: 83109, percentage: 18, orders: 184 },
            ].map((method, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{method.name}</span>
                  <span className="text-lg font-bold">${method.revenue.toLocaleString()}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${method.percentage}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{method.orders} orders</span>
                  <span>{method.percentage}% of total</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
