import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const includeSubcategories = searchParams.get('includeSubcategories') === 'true'
    const parentId = searchParams.get('parentId')

    const where: any = {}

    if (parentId) {
      where.parentId = parentId
    } else if (searchParams.get('topLevel') === 'true') {
      where.parentId = null
    }

    const categories = await db.category.findMany({
      where,
      include: {
        ...(includeSubcategories && { children: true }),
        ...(searchParams.get('includeProductCount') === 'true' && {
          _count: {
            select: { products: true },
          },
        }),
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({
      categories: categories.map(cat => ({
        ...cat,
        productCount: cat._count?.products || 0,
        _count: undefined,
      })),
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
