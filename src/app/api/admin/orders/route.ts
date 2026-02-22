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
          query ? {
            OR: [
              { orderNumber: { contains: query } },
              { guestName: { contains: query } },
              { user: { name: { contains: query } } },
            ]
          } : {},
          status !== 'all' ? { status: status } : {},
        ]
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    const formattedOrders = orders.map(o => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customer: o.user ? o.user.name : o.guestName || 'Guest Customer',
      email: o.user ? o.user.email : o.guestEmail,
      total: o.total,
      status: o.status,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      createdAt: o.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: formattedOrders,
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// PATCH for updating order status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    const order = await db.order.update({
      where: { id: orderId },
      data: { status }
    });

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update order' },
      { status: 500 }
    );
  }
}
