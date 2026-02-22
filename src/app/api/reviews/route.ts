import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // TODO: Retrieve reviews from database
    const mockReviews = [
      {
        id: '1',
        productId,
        userId: 'user-1',
        userName: 'John D.',
        rating: 5,
        title: 'Excellent product!',
        comment: 'Absolutely love this product. Great quality and fast delivery.',
        verified: true,
        helpfulCount: 24,
        images: [],
        createdAt: '2024-01-15T10:30:00Z',
      },
      {
        id: '2',
        productId,
        userId: 'user-2',
        userName: 'Sarah M.',
        rating: 4,
        title: 'Good value for money',
        comment: 'Very happy with the purchase. Minor issues with packaging.',
        verified: true,
        helpfulCount: 12,
        images: [],
        createdAt: '2024-01-10T14:20:00Z',
      },
    ]

    return NextResponse.json({
      success: true,
      reviews: mockReviews.slice(offset, offset + limit),
      total: mockReviews.length,
      averageRating: 4.5,
      distribution: {
        5: 120,
        4: 45,
        3: 12,
        2: 3,
        1: 2,
      },
    })

  } catch (error) {
    console.error('Get reviews error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve reviews' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, productId, rating, title, comment, verified } = body

    if (!userId || !productId || !rating || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // TODO: Save review to database
    // Check if user has purchased the product for verified badge

    const reviewId = `review-${Date.now()}`

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully',
      reviewId,
    }, { status: 201 })

  } catch (error) {
    console.error('Submit review error:', error)
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    )
  }
}
