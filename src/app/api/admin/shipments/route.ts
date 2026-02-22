import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query') || '';
        const status = searchParams.get('status') || 'all';

        const orders = await db.order.findMany({
            where: {
                AND: [
                    { trackingNumber: { not: null } },
                    query ? {
                        OR: [
                            { orderNumber: { contains: query } },
                            { trackingNumber: { contains: query } },
                            { address: { address: { contains: query } } },
                        ]
                    } : {},
                    status !== 'all' ? { status: status } : {},
                ]
            },
            include: {
                address: true,
            },
            orderBy: {
                updatedAt: 'desc',
            }
        });

        const formattedShipments = orders.map(o => ({
            id: `ship-${o.id}`,
            orderNumber: o.orderNumber,
            orderId: o.id,
            carrier: o.carrier || 'N/A',
            trackingNumber: o.trackingNumber || '',
            status: o.status === 'delivered' ? 'delivered' : o.status === 'shipped' ? 'shipped' : 'in_transit',
            weight: 0, // Not in schema
            dimensions: '', // Not in schema
            shippingMethod: o.shippingMethod || 'Standard',
            cost: o.shippingCost,
            fromAddress: 'Warehouse A',
            toAddress: o.address ? `${o.address.address}, ${o.address.city}, ${o.address.state} ${o.address.postalCode}` : 'N/A',
            estimatedDelivery: o.estimatedDelivery ? o.estimatedDelivery.toISOString().split('T')[0] : 'N/A',
            actualDelivery: o.actualDelivery ? o.actualDelivery.toISOString().split('T')[0] : undefined,
            createdAt: o.createdAt.toISOString().split('T')[0],
            shippedAt: o.updatedAt.toISOString().split('T')[0],
        }));

        return NextResponse.json({
            success: true,
            data: formattedShipments,
        });
    } catch (error) {
        console.error('Error fetching admin shipments:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch shipments' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId, carrier, trackingNumber, estimatedDelivery } = body;

        const order = await db.order.update({
            where: { id: orderId },
            data: {
                carrier,
                trackingNumber,
                estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : undefined,
                status: 'shipped'
            }
        });

        return NextResponse.json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.error('Error creating shipment:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create shipment' },
            { status: 500 }
        );
    }
}
