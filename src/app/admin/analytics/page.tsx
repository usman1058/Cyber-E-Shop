'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    BarChart3,
    TrendingUp,
    Users,
    ShoppingCart,
    ArrowRight,
    RefreshCw,
    DollarSign,
    MousePointer2,
    Package,
    MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface AnalyticsData {
    totalRevenue: number;
    revenueChange: number;
    totalOrders: number;
    ordersChange: number;
    totalCustomers: number;
    newCustomers: number;
    averageOrderValue: number;
    lastUpdated: string;
}

export default function AnalyticsLandingPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAnalytics = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/analytics?range=30days');
            const result = await response.json();
            if (result.success) {
                setData(result.data);
            } else {
                toast.error(result.message || 'Failed to fetch analytics');
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    const cards = [
        {
            title: 'Sales Analytics',
            description: 'Revenue, orders, and average transaction value.',
            href: '/admin/analytics/sales',
            icon: DollarSign,
            color: 'text-green-600',
            bg: 'bg-green-100',
        },
        {
            title: 'User Behavior',
            description: 'Conversion rates, page views, and user journeys.',
            href: '/admin/analytics/behavior',
            icon: MousePointer2,
            color: 'text-blue-600',
            bg: 'bg-blue-100',
        },
        {
            title: 'Customer Insights',
            description: 'Demographics, retention, and lifetime value.',
            href: '/admin/analytics/customers',
            icon: Users,
            color: 'text-purple-600',
            bg: 'bg-purple-100',
        },
        {
            title: 'Inventory Reports',
            description: 'Stock levels, turnover, and popular products.',
            href: '/admin/analytics/inventory',
            icon: Package,
            color: 'text-orange-600',
            bg: 'bg-orange-100',
        },
        {
            title: 'Support Metrics',
            description: 'Ticket volume, response times, and satisfaction.',
            href: '/admin/analytics/support',
            icon: MessageSquare,
            color: 'text-red-600',
            bg: 'bg-red-100',
        }
    ];

    if (isLoading && !data) {
        return <div className="flex justify-center items-center h-[60vh]"><RefreshCw className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analytics Overview</h1>
                    <p className="text-sm text-muted-foreground">Monitor your store's performance at a glance</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchAnalytics} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh Data
                </Button>
            </div>

            {/* Main Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${data?.totalRevenue?.toLocaleString() || '0.00'}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            <span className={data?.revenueChange && data.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {data?.revenueChange && data.revenueChange >= 0 ? '+' : ''}{data?.revenueChange?.toFixed(1)}%
                            </span>
                            {' '}from last 30 days
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.totalOrders || '0'}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            <span className={data?.ordersChange && data.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {data?.ordersChange && data.ordersChange >= 0 ? '+' : ''}{data?.ordersChange?.toFixed(1)}%
                            </span>
                            {' '}from last 30 days
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
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
                        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.totalCustomers || '0'}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            <Badge variant="secondary" className="text-[10px]">{data?.newCustomers} new this month</Badge>
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Analytics Exploder */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => (
                    <Link key={card.href} href={card.href}>
                        <Card className="h-full hover:shadow-md transition-all cursor-pointer group">
                            <CardContent className="p-6">
                                <div className={`p-3 rounded-lg w-fit ${card.bg} ${card.color} mb-4`}>
                                    <card.icon className="h-6 w-6" />
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-lg">{card.title}</h3>
                                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                </div>
                                <p className="text-sm text-muted-foreground">{card.description}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Quick Tips */}
            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="text-lg">Pro Tip</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm">
                        You can export detailed reports as PDF or CSV from each individual analytics page.
                        Scheduled reports can be managed in the <Link href="/admin/reports" className="text-primary font-medium hover:underline">Reports Section</Link>.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
