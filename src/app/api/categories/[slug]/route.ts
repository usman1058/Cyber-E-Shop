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

    const category = await db.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: true,
        ...(includeProducts && {
          products: {
            where: { active: true },
            include: { brand: true },
            take: limit,
            skip: (page - 1) * limit,
            orderBy: { createdAt: 'desc' },
          },
        }),
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    let pagination: any = null
    if (includeProducts) {
      const total = await db.product.count({
        where: { categoryId: category.id, active: true },
      })
      pagination = {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    }

    return NextResponse.json({
      category: {
        ...category,
        products: includeProducts
          ? category.products.map(p => ({
              ...p,
              images: JSON.parse(p.images || '[]'),
              specs: p.specs ? JSON.parse(p.specs) : null,
            }))
          : undefined,
      },
      pagination,
    })
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}
