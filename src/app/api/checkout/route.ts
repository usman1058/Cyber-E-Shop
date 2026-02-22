import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      shippingAddress,
      shippingMethod,
      paymentMethod,
      promoCode,
      items,
      notes,
    } = body

    let finalUserId = userId
    let isNewUser = false

    // Validate required fields
    if (!shippingAddress || !shippingMethod || !paymentMethod || !items) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Validate shipping address
    const requiredAddressFields = ['fullName', 'phone', 'address', 'city', 'state', 'postalCode', 'country']
    const missingAddressFields = requiredAddressFields.filter(field => !shippingAddress[field])

    if (missingAddressFields.length > 0) {
      return NextResponse.json(
        { error: `Missing address fields: ${missingAddressFields.join(', ')}` },
        { status: 400 }
      )
    }

    // handle guest conversion if no userId
    let tempPassword = ''
    if (!finalUserId && shippingAddress.email) {
      // Check if user already exists
      let user = await db.user.findUnique({
        where: { email: shippingAddress.email },
      })

      if (!user) {
        // Create new account with a temporary password
        tempPassword = Math.random().toString(36).slice(-10)
        const hashedPassword = await bcrypt.hash(tempPassword, 10)
        
        user = await db.user.create({
          data: {
            email: shippingAddress.email,
            name: shippingAddress.fullName,
            password: hashedPassword,
            role: 'customer',
          }
        })
        isNewUser = true

        // Create welcome notification with default password
        await db.notification.create({
          data: {
            userId: user.id,
            type: 'account',
            title: 'Welcome to E-shop!',
            message: `Your account has been created. Your default password is: ${tempPassword}. Please change it for better security.`,
            link: '/account/profile'
          }
        })

        // Mock email send
        console.log(`[MOCK EMAIL] To: ${shippingAddress.email} - Welcome! Your password is ${tempPassword}`)
      }
      finalUserId = user.id
    }

    // Get cart - Search by BOTH userId and sessionId (from items)
    // Guest conversion might have already happened, so we prioritize the cart 
    // that actually HAS the items (usually linked to sessionId for guests)
    const sessionIdFromItems = items[0]?.sessionId || body.sessionId
    
    const cart = await db.cart.findFirst({
      where: {
        OR: [
          { userId: finalUserId ? (finalUserId as string) : undefined },
          { sessionId: sessionIdFromItems as string },
        ].filter(condition => condition.userId !== undefined || condition.sessionId !== undefined)
      },
      include: { items: true },
      orderBy: { updatedAt: 'desc' }, // Get the most recent one if multiple (unlikely)
    })

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // IMPORTANT: If we found a guest cart (linked to sessionId) but we now have a userId,
    // link the cart to the user before proceeding to avoid orphan carts.
    if (finalUserId && !cart.userId) {
      await db.cart.update({
        where: { id: cart.id },
        data: { userId: finalUserId }
      })
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum: number, item: any) => sum + item.totalPrice, 0)
    const shipping = subtotal > 50 ? 0 : 5.99
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-10)}`

    // Create order with CORRECT field name
    const order = await db.order.create({
      data: {
        orderNumber,
        userId: finalUserId || null,
        guestEmail: !finalUserId ? shippingAddress.email : null,
        guestName: !finalUserId ? shippingAddress.fullName : null,
        guestPhone: !finalUserId ? shippingAddress.phone : null,
        status: 'pending',
        total,
        subtotal,
        tax,
        shippingCost: shipping,
        shippingMethod,
        paymentMethod,
        paymentStatus: 'pending',
        notes,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    // Create order address
    await db.orderAddress.create({
      data: {
        orderId: order.id,
        fullName: shippingAddress.fullName,
        address: shippingAddress.address,
        apartment: shippingAddress.apartment,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country || 'USA',
        phone: shippingAddress.phone,
      },
    })

    // Create order items
    for (const item of cart.items) {
      await db.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          productName: item.productName,
          productSlug: item.productSlug,
          productImage: item.productImage,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        },
      })
    }

    // Clear cart items and cart
    await db.cartItem.deleteMany({ where: { cartId: cart.id } })
    await db.cart.delete({ where: { id: cart.id } })

    const response = NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber,
        userId: finalUserId || null,
        total,
        status: 'pending',
        createdAt: order.createdAt,
        estimatedDelivery: order.estimatedDelivery,
      },
      isNewUser,
      tempPassword,
      message: 'Order placed successfully',
    }, { status: 201 })

    // If we have a finalUserId (guest converted or already logged in), 
    // ensure they are logged in for this session if not already
    if (finalUserId) {
      const token = jwt.sign({ userId: finalUserId }, JWT_SECRET, { expiresIn: '7d' })
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)

      // Store/Update session in DB
      await db.session.upsert({
        where: { token },
        update: { expiresAt },
        create: {
          userId: finalUserId,
          token,
          expiresAt,
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
        },
      })

      // Set cookie
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        expires: expiresAt,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })
    }

    return response

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to process checkout' },
      { status: 500 }
    )
  }
}

// Apply promo code
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { promoCode, userId, sessionId } = body

    if (!promoCode) {
      return NextResponse.json(
        { error: 'Promo code is required' },
        { status: 400 }
      )
    }

    // Check if promo code exists in Deal model
    const promo = await db.deal.findUnique({
      where: { slug: promoCode.toUpperCase() },
    })

    if (!promo) {
      return NextResponse.json(
        { error: 'Invalid promo code' },
        { status: 404 }
      )
    }

    if (!promo.active) {
      return NextResponse.json(
        { error: 'Promo code is expired' },
        { status: 404 }
      )
    }

    const now = new Date()
    if (promo.startDate > now || promo.endDate < now) {
      return NextResponse.json(
        { error: 'Promo code is expired' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      promoCode: promoCode.toUpperCase(),
      discount: promo.discount,
      discountType: promo.discountType,
      description: `${promo.name}: ${promo.discountType === 'percentage' ? `${promo.discount * 100}% off` : `$${promo.discount} off`}`,
      message: `Promo code applied: ${promo.name}`,
    })

  } catch (error) {
    console.error('Promo code error:', error)
    return NextResponse.json(
      { error: 'Failed to apply promo code' },
      { status: 500 }
    )
  }
}
