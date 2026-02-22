import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Get cart items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const sessionId = searchParams.get('sessionId')

    if (!userId && !sessionId) {
      return NextResponse.json(
        { error: 'User ID or Session ID is required' },
        { status: 400 }
      )
    }

    // Query cart from database
    const cart = await db.cart.findFirst({
      where: userId ? { userId: userId as string } : { sessionId: sessionId as string },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                brand: true,
              },
            },
          },
        },
      },
    })

    if (!cart) {
      return NextResponse.json({
        success: true,
        items: [],
        summary: { subtotal: 0, savings: 0, tax: 0, shipping: 0, total: 0 },
      })
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0)
    const savings = 0 // Can be expanded later
    const shipping = subtotal > 50 ? 0 : 5.99
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax

    return NextResponse.json({
      success: true,
      items: cart.items.map(item => ({
        id: item.id,
        productId: item.productId,
        name: item.productName,
        slug: item.productSlug,
        price: item.unitPrice,
        image: item.productImage,
        quantity: item.quantity,
        stock: item.product?.stock || 0,
        category: item.product?.category?.name || '',
        brand: item.product?.brand?.name || '',
      })),
      summary: {
        subtotal,
        savings,
        tax,
        shipping,
        total,
      },
    })

  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve cart' },
      { status: 500 }
    )
  }
}

// Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, sessionId, productId, quantity = 1 } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    if (quantity < 1 || quantity > 10) {
      return NextResponse.json(
        { error: 'Quantity must be between 1 and 10' },
        { status: 400 }
      )
    }

    // Get product details
    const product = await db.product.findUnique({ where: { id: productId } })
    if (!product || !product.active) {
      return NextResponse.json(
        { error: 'Product not available' },
        { status: 404 }
      )
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      )
    }

    if (!userId && !sessionId) {
      return NextResponse.json(
        { error: 'User ID or Session ID is required' },
        { status: 400 }
      )
    }

    // Find or create cart
    const cart = await db.cart.upsert({
      where: userId ? { userId: userId as string } : { sessionId: sessionId as string },
      update: { updatedAt: new Date() },
      create: {
        userId: userId || null,
        sessionId: (sessionId || `session_${Date.now()}`) as string,
        updatedAt: new Date(),
      },
    })

    // Check if item already in cart
    const existingItem = await db.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    })

    if (existingItem) {
      // Update quantity
      await db.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
          totalPrice: (existingItem.quantity + quantity) * product.price,
          updatedAt: new Date(),
        },
      })
    } else {
      // Add new item
      await db.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          productName: product.name,
          productSlug: product.slug,
          productImage: product.images,
          quantity,
          unitPrice: product.price,
          totalPrice: quantity * product.price,
        },
      })
    }

    // Update cart updatedAt
    await db.cart.update({
      where: { id: cart.id },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json({
      success: true,
      message: 'Item added to cart',
      cartItemId: `ci-${Date.now()}`,
    }, { status: 201 })

  } catch (error: any) {
    console.error('Add to cart error:', error)
    return NextResponse.json(
      { error: 'Failed to add item to cart', details: error.message },
      { status: 500 }
    )
  }
}

// Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, sessionId, cartItemId, quantity } = body

    if (!cartItemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Cart item ID and quantity are required' },
        { status: 400 }
      )
    }

    if (quantity < 1 || quantity > 10) {
      return NextResponse.json(
        { error: 'Quantity must be between 1 and 10' },
        { status: 400 }
      )
    }

    // Verify cart item exists
    const cartItem = await db.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        product: true,
      },
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    // Verify stock
    if (cartItem.product.stock < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      )
    }

    // Update quantity
    await db.cartItem.update({
      where: { id: cartItemId },
      data: {
        quantity,
        totalPrice: quantity * cartItem.product.price,
        updatedAt: new Date(),
      },
    })

    // Update cart updatedAt
    await db.cart.update({
      where: { id: cartItem.cartId },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json({
      success: true,
      message: 'Cart item updated',
    })

  } catch (error) {
    console.error('Update cart error:', error)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}

// Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cartItemId = searchParams.get('cartItemId')
    const userId = searchParams.get('userId')
    const sessionId = searchParams.get('sessionId')

    if (!cartItemId) {
      return NextResponse.json(
        { error: 'Cart item ID is required' },
        { status: 400 }
      )
    }

    // Verify cart item exists
    const cartItem = await db.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true,
      },
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    // Get cart ID before deleting item
    const cartId = cartItem.cartId

    // Remove from database
    await db.cartItem.delete({
      where: { id: cartItemId },
    })

    // Update cart updatedAt
    await db.cart.update({
      where: { id: cartId },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart',
    })

  } catch (error) {
    console.error('Remove from cart error:', error)
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    )
  }
}
