'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, TrendingUp, ShoppingCart, Clock, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const customerData = {
  totalCustomers: 5678,
  newCustomers: 234,
  returningCustomers: 1256,
  vipCustomers: 156,
  avgLifetimeValue: 425.50,
  avgPurchaseFreq: 2.3,
};

const segmentData = [
  { segment: 'New', count: 234, percentage: 4.1, avgOrder: 89.50 },
  { segment: 'Returning', count: 1256, percentage: 22.1, avgOrder: 156.78 },
  { segment: 'VIP', count: 156, percentage: 2.7, avgOrder: 345.00 },
  { segment: 'Inactive', count: 4032, percentage: 71.1, avgOrder: 0 },
];

export default function CustomerAnalyticsPage() {
  const [dateRange, setDateRange] = useState('30days');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Analytics</h1>
          <p className="text-sm text-muted-foreground">Customer behavior and segmentation insights</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerData.totalCustomers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">All-time registered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerData.newCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Returning Customers</CardTitle>
            <ShoppingCart className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerData.returningCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">22% of total base</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">VIP Customers</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerData.vipCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">$1000+ lifetime value</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {segmentData.map((segment, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{segment.segment}</span>
                    <Badge variant="outline">{segment.count} customers</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${segment.percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{segment.percentage}% of total</span>
                    <span className="font-medium">Avg Order: ${segment.avgOrder.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Average Lifetime Value</p>
                <p className="text-2xl font-bold">${customerData.avgLifetimeValue.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Purchase Frequency (90 days)</p>
                <p className="text-2xl font-bold">{customerData.avgPurchaseFreq} orders</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Retention Rate</p>
                <p className="text-2xl font-bold">68.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
