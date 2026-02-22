import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const order = await db.order.findUnique({
            where: { id: params.id },
            include: {
                user: true,
                address: true,
                items: true,
            },
        });

        if (!order) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            );
        }

        // Map timeline from some events or just mock for now if no timeline model
        // In our schema, we don't have a timeline model yet, so we'll simulate it based on status
        const timeline = [
            { id: '1', status: 'placed', message: 'Order placed', timestamp: order.createdAt.toISOString() },
        ];
        if (order.status !== 'pending') {
            timeline.push({ id: '2', status: order.status, message: `Status changed to ${order.status}`, timestamp: order.updatedAt.toISOString() });
        }

        const formattedOrder = {
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            createdAt: order.createdAt.toISOString(),
            customer: {
                name: order.user ? order.user.name : order.guestName || 'Guest',
                email: order.user ? order.user.email : order.guestEmail || '',
                phone: order.user ? order.user.phone : order.guestPhone || '',
            },
            shippingAddress: {
                fullName: order.address?.fullName || '',
                addressLine1: order.address?.address || '',
                city: order.address?.city || '',
                state: order.address?.state || '',
                postalCode: order.address?.postalCode || '',
                country: order.address?.country || 'USA',
            },
            items: order.items.map(i => ({
                id: i.id,
                productId: i.productId,
                productName: i.productName,
                productImage: i.productImage || '',
                variant: '', // Not in schema for items yet
                quantity: i.quantity,
                price: i.unitPrice,
                subtotal: i.totalPrice,
            })),
            subtotal: order.subtotal,
            shipping: order.shippingCost,
            tax: order.tax,
            discount: 0, // Not in schema yet
            total: order.total,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            timeline: timeline,
            notes: order.notes || '',
        };

        return NextResponse.json({
            success: true,
            data: formattedOrder,
        });
    } catch (error) {
        console.error('Error fetching order details:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch order details' },
            { status: 500 }
        );
    }
}
