import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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

    // Retrieve wishlist from database
    const where: any = userId ? { userId } : { sessionId };
    const wishlist = await db.wishlistItem.findMany({
      where,
      include: {
        product: true,
      },
    })

    return NextResponse.json({
      success: true,
      wishlist: wishlist.map(item => ({
        id: item.id,
        userId: item.userId,
        sessionId: item.sessionId,
        productId: item.productId,
        productName: item.productName,
        productSlug: item.productSlug,
        productPrice: item.productPrice,
        productImage: item.productImage,
        priceDrop: item.priceDrop,
        stockAlert: item.stockAlert,
        addedDate: item.createdAt,
        product: item.product,
      })),
    })

  } catch (error) {
    console.error('Get wishlist error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve wishlist' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, sessionId, productId, priceAlert, stockAlert } = body

    if ((!userId && !sessionId) || !productId) {
      return NextResponse.json(
        { error: 'User/Session ID and Product ID are required' },
        { status: 400 }
      )
    }

    // Get product details
    const product = await db.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if already in wishlist
    const where: any = userId
      ? { userId, productId }
      : { sessionId, productId };

    const existingItem = await db.wishlistItem.findFirst({
      where,
    })

    if (existingItem) {
      // Update alerts
      await db.wishlistItem.update({
        where: { id: existingItem.id },
        data: {
          priceDrop: priceAlert !== undefined ? priceAlert : existingItem.priceDrop,
          stockAlert: stockAlert !== undefined ? stockAlert : existingItem.stockAlert,
          updatedAt: new Date(),
        },
      })
    } else {
      // Add to wishlist
      await db.wishlistItem.create({
        data: {
          userId: userId || null,
          sessionId: sessionId || null,
          productId,
          productName: product.name,
          productSlug: product.slug,
          productImage: JSON.parse(product.images)[0],
          productPrice: product.price,
          priceDrop: priceAlert || false,
          stockAlert: stockAlert || false,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Item added to wishlist',
    }, { status: 201 })

  } catch (error) {
    console.error('Add to wishlist error:', error)
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const sessionId = searchParams.get('sessionId')
    const id = searchParams.get('id') // Support both 'id' and 'wishlistItemId'
    const wishlistItemId = searchParams.get('wishlistItemId') || id
    const productId = searchParams.get('productId')

    if (!wishlistItemId && !productId) {
      return NextResponse.json({ error: 'Item ID or Product ID required' }, { status: 400 })
    }

    if (wishlistItemId) {
      await db.wishlistItem.delete({
        where: { id: wishlistItemId },
      })
    } else if (productId) {
      const where: any = {};
      if (userId) where.userId = userId;
      else if (sessionId) where.sessionId = sessionId;
      where.productId = productId;

      await db.wishlistItem.deleteMany({
        where
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Item removed from wishlist',
    })

  } catch (error) {
    console.error('Remove from wishlist error:', error)
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    )
  }
}
