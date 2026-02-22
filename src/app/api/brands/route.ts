import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sort = searchParams.get('sort') || 'name'
    const includeProductCount = searchParams.get('includeProductCount') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '24')

    const brands = await db.brand.findMany({
      include: {
        ...(includeProductCount && {
          _count: {
            select: { products: true },
          },
        }),
      },
      orderBy: { [sort]: 'asc' },
    })

    return NextResponse.json({
      brands: brands.map(brand => ({
        ...brand,
        productCount: brand._count?.products || 0,
        _count: undefined,
      })),
    })
  } catch (error) {
    console.error('Error fetching brands:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    )
  }
}
