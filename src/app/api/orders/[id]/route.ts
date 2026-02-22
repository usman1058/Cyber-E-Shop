import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params
    const cleanId = orderId.trim().replace(/^#/, '')

    // Common include object
    const include = {
      items: true,
      address: true,
      user: {
        select: {
          name: true,
          email: true,
        }
      }
    }

    // 1. Try by direct ID (CUID)
    let order = await db.order.findUnique({
      where: { id: cleanId },
      include
    })

    // 2. If not found, try by orderNumber (with variations)
    if (!order) {
      order = await db.order.findFirst({
        where: {
          OR: [
            { orderNumber: cleanId },
            { orderNumber: cleanId.toUpperCase() },
            { orderNumber: `ORD-${cleanId}` },
            { orderNumber: `ORD-${cleanId.toUpperCase()}` },
          ]
        },
        include
      })
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      order,
    })

  } catch (error) {
    console.error('Get order details error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve order details' },
      { status: 500 }
    )
  }
}
