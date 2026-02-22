import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const [
            totalSales,
            totalOrders,
            totalUsers,
            openTickets,
            recentOrders,
            lowStockProducts,
        ] = await Promise.all([
            db.order.aggregate({
                _sum: {
                    total: true,
                },
            }),
            db.order.count(),
            db.user.count(),
            db.supportTicket.count({
                where: {
                    status: 'open',
                },
            }),
            db.order.findMany({
                take: 5,
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    user: true,
                },
            }),
            db.product.findMany({
                where: {
                    stock: {
                        lt: 10,
                    },
                },
                take: 5,
            }),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                stats: {
                    totalSales: totalSales._sum.total || 0,
                    totalOrders,
                    totalUsers,
                    openTickets,
                },
                recentOrders: recentOrders.map(o => ({
                    id: o.id,
                    customer: o.user?.name || o.guestName || 'Guest',
                    total: o.total,
                    status: o.status,
                    createdAt: o.createdAt,
                })),
                lowStockProducts: lowStockProducts.map(p => ({
                    id: p.id,
                    name: p.name,
                    stock: p.stock,
                    sku: p.sku,
                })),
                alerts: [
                    ...(lowStockProducts.length > 0 ? [{
                        id: 'low-stock-alert',
                        message: `${lowStockProducts.length} items are low in stock`,
                        severity: lowStockProducts.some(p => p.stock === 0) ? 'high' : 'medium',
                        time: 'Just now'
                    }] : [])
                ]
            },
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch dashboard stats' },
            { status: 500 }
        );
    }
}
