import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const sort = searchParams.get('sort') || 'recent'

    const product = await db.product.findUnique({
      where: { slug: slug }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const reviews = await db.review.findMany({
      where: {
        productId: product.id
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: (sort === 'recent' ? 'desc' : 'asc') as any
      },
      take: limit,
      skip: offset,
    })

    const total = await db.review.count({
      where: {
        productId: product.id
      }
    })

    // Calculate average rating and distribution
    const aggregate = await db.review.aggregate({
      where: {
        productId: product.id
      },
      _avg: {
        rating: true
      },
      _count: {
        id: true
      }
    })

    const distribution = await db.review.groupBy({
      by: ['rating'],
      where: {
        productId: product.id
      },
      _count: {
        id: true
      }
    })

    const distMap = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    distribution.forEach(d => {
      distMap[d.rating as keyof typeof distMap] = d._count.id
    })

    return NextResponse.json({
      success: true,
      reviews: reviews.map(r => ({
        id: r.id,
        author: (r as any).user?.name || 'Anonymous',
        rating: r.rating,
        title: r.title,
        comment: r.content,
        verified: r.verified,
        helpfulCount: r.helpful,
        createdAt: r.createdAt,
      })),
      total,
      averageRating: aggregate._avg?.rating || 0,
      distribution: distMap,
    })

  } catch (error) {
    console.error('Get product reviews error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve product reviews' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const { rating, title, comment, userId } = body

    if (!rating || !comment || !userId) {
      return NextResponse.json(
        { error: 'Rating, comment, and userId are required' },
        { status: 400 }
      )
    }

    const product = await db.product.findUnique({
      where: { slug }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const review = await db.review.create({
      data: {
        productId: product.id,
        productName: product.name,
        userId: userId,
        rating: parseInt(rating),
        title: title || '',
        content: comment,
        verified: true, // Assuming online purchase for now
      }
    })

    // Update product rating and count
    const allReviews = await db.review.findMany({
      where: { productId: product.id },
      select: { rating: true }
    })

    const totalRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0)
    const avgRating = totalRating / allReviews.length

    await db.product.update({
      where: { id: product.id },
      data: {
        rating: avgRating,
        reviewCount: allReviews.length
      }
    })

    return NextResponse.json({
      success: true,
      review
    })

  } catch (error) {
    console.error('Create review error:', error)
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    )
  }
}
