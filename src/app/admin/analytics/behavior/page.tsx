'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Activity,
  Eye,
  ShoppingCart,
  Clock,
  TrendingUp,
  Users,
  Download,
  MousePointer2,
  Search,
  ExternalLink,
} from 'lucide-react';

interface BehaviorData {
  visitors: number;
  carts: number;
  checkouts: number;
  searches: number;
}

export default function BehaviorAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30days');
  const [data, setData] = useState<BehaviorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBehaviorData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      const result = await response.json();
      if (result.success) {
        setData(result.data.behavior);
      } else {
        toast.error(result.message || 'Failed to fetch behavior data');
      }
    } catch (error) {
      console.error('Error fetching behavior analytics:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchBehaviorData();
  }, [fetchBehaviorData]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const metrics = [
    { name: 'Store Visitors', icon: Users, value: data?.visitors?.toLocaleString() || '0', change: '+5.2%', trend: 'up' },
    { name: 'Active Carts', icon: ShoppingCart, value: data?.carts?.toLocaleString() || '0', change: '+12.3%', trend: 'up' },
    { name: 'Total Searches', icon: Search, value: data?.searches?.toLocaleString() || '0', change: '+2.1%', trend: 'up' },
    { name: 'Checkouts', icon: Activity, value: data?.checkouts?.toLocaleString() || '0', change: '+8.4%', trend: 'up' },
  ];

  const funnelData = [
    { step: 'Visitors', count: data?.visitors || 0, conversion: '100' },
    { step: 'Add to Cart', count: data?.carts || 0, conversion: data?.visitors ? ((data.carts / data.visitors) * 100).toFixed(1) : '0' },
    { step: 'Checkout / Purchase', count: data?.checkouts || 0, conversion: data?.carts ? ((data.checkouts / data.carts) * 100).toFixed(1) : '0' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Behavior Analytics</h1>
          <p className="text-sm text-muted-foreground">Understanding how users interact with your store</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className={metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {metric.change}
                </span>
                {' '}from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages and their performance</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Avg. Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topPages.map((page) => (
                  <TableRow key={page.page}>
                    <TableCell className="font-medium text-primary">{page.page}</TableCell>
                    <TableCell className="text-right">{page.views.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{formatTime(page.avgTime)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { source: 'Direct', percentage: 45, value: '12.4k' },
                { source: 'Google', percentage: 32, value: '8.2k' },
                { source: 'Social Media', percentage: 15, value: '4.1k' },
                { source: 'Email', percentage: 8, value: '2.3k' },
              ].map((source) => (
                <div key={source.source} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{source.source}</span>
                    <span className="text-muted-foreground">{source.value} ({source.percentage}%)</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>User journey from visit to purchase</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">3.2%</div>
                <div className="text-xs text-muted-foreground">Total Conv. Rate</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 pt-4">
              {isLoading ? (
                <div className="flex justify-center py-12"><RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" /></div>
              ) : funnelData.map((step) => (
                <div key={step.step} className="flex items-center gap-4">
                  <div className="w-32 text-sm font-medium">{step.step}</div>
                  <div className="flex-1">
                    <div className="h-10 bg-muted/50 rounded-lg relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-primary/20 transition-all"
                        style={{ width: `${(step.count / (funnelData[0].count || 1)) * 100}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-between px-4 text-sm">
                        <span className="font-semibold">{step.count.toLocaleString()}</span>
                        <span className="text-muted-foreground">{step.conversion}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Session Insights</CardTitle>
            <CardDescription>Key interaction highlights from user sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg border bg-muted/10 space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <MousePointer2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Add to Cart</span>
                </div>
                <p className="text-2xl font-bold">8.4%</p>
                <p className="text-xs text-muted-foreground">Highest on Product Page</p>
              </div>
              <div className="p-4 rounded-lg border bg-muted/10 space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Search className="h-4 w-4" />
                  <span className="text-sm font-medium">Search Usage</span>
                </div>
                <p className="text-2xl font-bold">24.1%</p>
                <p className="text-xs text-muted-foreground">15.2% exit from search</p>
              </div>
              <div className="p-4 rounded-lg border bg-muted/10 space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <ExternalLink className="h-4 w-4" />
                  <span className="text-sm font-medium">Exit Rate</span>
                </div>
                <p className="text-2xl font-bold">42.8%</p>
                <p className="text-xs text-muted-foreground">Checkout page: 12.4%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
