import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { startOfDay, subDays, endOfDay } from 'date-fns';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const range = searchParams.get('range') || '30days';

        let days = 30;
        if (range === '7days') days = 7;
        else if (range === '90days') days = 90;
        else if (range === '1year') days = 365;

        const now = new Date();
        const startDate = startOfDay(subDays(now, days));
        const prevStartDate = startOfDay(subDays(startDate, days));

        // Core Metrics
        const currentOrders = await db.order.findMany({
            where: {
                createdAt: { gte: startDate },
                status: { notIn: ['cancelled', 'returned'] }
            },
            select: { total: true, createdAt: true }
        });

        const prevOrders = await db.order.findMany({
            where: {
                createdAt: { gte: prevStartDate, lt: startDate },
                status: { notIn: ['cancelled', 'returned'] }
            },
            select: { total: true }
        });

        const totalRevenue = currentOrders.reduce((acc, o) => acc + o.total, 0);
        const prevRevenue = prevOrders.reduce((acc, o) => acc + o.total, 0);
        const revenueChange = prevRevenue === 0 ? 100 : ((totalRevenue - prevRevenue) / prevRevenue) * 100;

        const totalOrders = currentOrders.length;
        const prevOrdersCount = prevOrders.length;
        const ordersChange = prevOrdersCount === 0 ? 100 : ((totalOrders - prevOrdersCount) / prevOrdersCount) * 100;

        const totalCustomers = await db.user.count({ where: { role: 'customer' } });
        const newCustomers = await db.user.count({
            where: {
                role: 'customer',
                createdAt: { gte: startDate }
            }
        });

        // Revenue Trend (grouped by day/month)
        // For simplicity, we'll return the last 'days' days of data
        const trend: { date: string; revenue: number }[] = [];
        for (let i = days; i >= 0; i--) {
            const d = subDays(now, i);
            const dayStart = startOfDay(d);
            const dayEnd = endOfDay(d);

            const dayRevenue = currentOrders
                .filter(o => o.createdAt >= dayStart && o.createdAt <= dayEnd)
                .reduce((acc, o) => acc + o.total, 0);

            trend.push({
                date: dayStart.toISOString().split('T')[0],
                revenue: dayRevenue
            });
        }

        // Category Performance
        const orderItems = await db.orderItem.findMany({
            where: { order: { createdAt: { gte: startDate } } },
            include: { order: true }
        });

        // We need to link items to categories. Since CategoryId is on Product, not OrderItem, we'd need to fetch products.
        // For performance, let's just use the product names or mock category grouping if we don't want to join too much.
        // Actually, let's do one more query for categories if we have many items.

        // Quick Category Summary
        const products = await db.product.findMany({
            select: { id: true, category: { select: { name: true } } }
        });

        const categoryMap: Record<string, { revenue: number, orders: number }> = {};
        orderItems.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            const catName = product?.category?.name || 'Uncategorized';

            if (!categoryMap[catName]) {
                categoryMap[catName] = { revenue: 0, orders: 0 };
            }
            categoryMap[catName].revenue += item.totalPrice;
            categoryMap[catName].orders += 1; // Count of items from this category
        });

        const topCategories = Object.entries(categoryMap)
            .map(([name, data]) => ({
                name,
                revenue: data.revenue,
                orders: data.orders,
                percentage: totalRevenue === 0 ? 0 : (data.revenue / totalRevenue) * 100
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        return NextResponse.json({
            success: true,
            data: {
                totalRevenue,
                revenueChange,
                totalOrders,
                ordersChange,
                totalCustomers,
                newCustomers,
                averageOrderValue: totalOrders === 0 ? 0 : totalRevenue / totalOrders,
                trend,
                topCategories,
                behavior: {
                    visitors: Math.max(totalOrders * 12, 100), // Estimate
                    carts: await db.cart.count({ where: { updatedAt: { gte: startDate } } }),
                    checkouts: totalOrders,
                    searches: (await db.searchQuery.aggregate({ _sum: { searchCount: true } }))._sum.searchCount || 0,
                },
                lastUpdated: now.toISOString()
            },
        });
    } catch (error) {
        console.error('Error fetching admin analytics:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}
