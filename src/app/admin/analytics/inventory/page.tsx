'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Box, TrendingUp, AlertTriangle, Warehouse, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const inventoryData = {
  totalProducts: 1520,
  lowStockCount: 45,
  outOfStockCount: 8,
  totalStockValue: 245680.00,
  avgTurnoverDays: 14,
  deadStockValue: 15600.00,
  slowMovingCount: 23,
};

const topCategories = [
  { name: 'Electronics', value: 89000, percentage: 36 },
  { name: 'Accessories', value: 42500, percentage: 17 },
  { name: 'Gaming', value: 38000, percentage: 16 },
  { name: 'Wearables', value: 52000, percentage: 21 },
  { name: 'Audio', value: 24180, percentage: 10 },
];

export default function InventoryAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30days');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Analytics</h1>
          <p className="text-sm text-muted-foreground">Stock levels, turnover, and aging metrics</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Total Products</span>
              <Box className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold">{inventoryData.totalProducts}</p>
            <p className="text-xs text-muted-foreground">In catalog</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Stock Value</span>
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold">${inventoryData.totalStockValue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Low Stock</span>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </div>
            <p className="text-2xl font-bold">{inventoryData.lowStockCount}</p>
            <p className="text-xs text-muted-foreground">Items below threshold</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Out of Stock</span>
              <Warehouse className="h-4 w-4 text-red-600" />
            </div>
            <p className="text-2xl font-bold">{inventoryData.outOfStockCount}</p>
            <p className="text-xs text-muted-foreground">Zero inventory</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Stock Turnover</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-3xl font-bold">{inventoryData.avgTurnoverDays}d</p>
                <p className="text-sm text-muted-foreground">Average turnover</p>
              </div>
              <Badge variant="secondary">Good</Badge>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-4">
              <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }} />
            </div>
            <p className="text-sm text-muted-foreground">65% within 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Value by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCategories.slice(0, 5).map((cat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{cat.name}</p>
                    <div className="w-full bg-muted rounded-full h-2 mt-1">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${cat.percentage}%` }} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${cat.value.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{cat.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Health</CardTitle>
          <CardDescription>Products requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 bg-red-50/50 rounded-lg">
              <p className="text-sm font-medium mb-2">Dead Stock</p>
              <p className="text-2xl font-bold text-red-600">${inventoryData.deadStockValue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">0 sales last 90 days</p>
            </div>
            <div className="p-4 bg-orange-50/50 rounded-lg">
              <p className="text-sm font-medium mb-2">Slow Moving</p>
              <p className="text-2xl font-bold text-orange-600">{inventoryData.slowMovingCount}</p>
              <p className="text-xs text-muted-foreground">Over 60 days turnover</p>
            </div>
            <div className="p-4 bg-amber-50/50 rounded-lg">
              <p className="text-sm font-medium mb-2">Low Stock Alert</p>
              <p className="text-2xl font-bold text-amber-600">{inventoryData.lowStockCount}</p>
              <p className="text-xs text-muted-foreground">Below threshold</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
