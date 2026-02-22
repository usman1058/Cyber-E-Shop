import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const searchParams = request.nextUrl.searchParams
    const includeProducts = searchParams.get('includeProducts') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const brand = await db.brand.findUnique({
      where: { slug },
      ...(includeProducts && {
        include: {
          products: {
            where: { active: true },
            include: { category: true },
            take: limit,
            skip: (page - 1) * limit,
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
    })

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      )
    }

    let pagination: any = null
    if (includeProducts) {
      const total = await db.product.count({
        where: { brandId: brand.id, active: true },
      })
      pagination = {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    }

    return NextResponse.json({
      brand: {
        ...brand,
        products: includeProducts
          ? (brand as any).products.map((p: any) => ({
            ...p,
            images: JSON.parse(p.images || '[]'),
            specs: p.specs ? JSON.parse(p.specs) : null,
          }))
          : undefined,
      },
      pagination,
    })
  } catch (error) {
    console.error('Error fetching brand:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brand' },
      { status: 500 }
    )
  }
}
