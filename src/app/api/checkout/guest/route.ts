import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      phone,
      acceptCookies,
      acceptMarketing,
      shippingAddress,
      shippingMethod,
      paymentMethod,
      items,
    } = body

    // Validate required fields
    if (!email || !acceptCookies) {
      return NextResponse.json(
        { error: 'Email and cookie consent are required' },
        { status: 400 }
      )
    }

    if (!shippingAddress || !shippingMethod || !paymentMethod || !items) {
      return NextResponse.json(
        { error: 'Missing required fields for checkout' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Generate guest session
    const guestSessionId = `guest-${Date.now()}-${Math.random().toString(36).substring(7)}`

    // TODO: Implement guest checkout
    // In production:
    // 1. Create guest user record (if doesn't exist)
    // 2. Generate guest session token
    // 3. Store shipping address
    // 4. Process checkout (similar to authenticated checkout)
    // 5. Create order with guest reference
    // 6. Send confirmation email
    // 7. Add marketing subscription if opted in

    const orderId = `ORD-${Date.now().toString().slice(-10)}`
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    const shipping = subtotal > 50 ? 0 : 5.99
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax

    const order = {
      orderId,
      guestEmail: email,
      guestPhone: phone,
      sessionId: guestSessionId,
      items,
      shippingAddress,
      shippingMethod,
      paymentMethod,
      summary: {
        subtotal,
        savings: items.reduce((sum: number, item: any) => sum + ((item.comparePrice || item.price) - item.price) * item.quantity, 0),
        shipping,
        tax,
        total,
      },
      status: 'Pending',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }

    return NextResponse.json({
      success: true,
      sessionId: guestSessionId,
      order,
      message: 'Guest order placed successfully',
    }, { status: 201 })

  } catch (error) {
    console.error('Guest checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to process guest checkout' },
      { status: 500 }
    )
  }
}

// Get guest session info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // TODO: Retrieve guest session from database
    return NextResponse.json({
      success: true,
      sessionId,
      guest: {
        email: 'guest@example.com',
        phone: '+1 (555) 123-4567',
      },
    })

  } catch (error) {
    console.error('Get guest session error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve guest session' },
      { status: 500 }
    )
  }
}
