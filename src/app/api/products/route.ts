import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category')
  const brand = searchParams.get('brand')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const sort = searchParams.get('sort') || 'createdAt'
  const order = searchParams.get('order') || 'desc'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')
  const featured = searchParams.get('featured') === 'true'
  const isNew = searchParams.get('isNew') === 'true'
  const onSale = searchParams.get('onSale') === 'true'
  const search = searchParams.get('search')

    const where: any = { active: true }

    if (category) {
      where.category = { slug: category }
    }

    if (brand) {
      where.brand = { slug: brand }
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (featured) {
      where.featured = true
    }

    if (isNew) {
      where.isNew = true
    }

    if (onSale) {
      where.comparePrice = { not: null }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const orderBy: any = {}
    orderBy[sort] = order

    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
        },
        orderBy,
        skip: onSale ? 0 : skip, // Don't skip for onSale, we'll filter after
        take: onSale ? 50 : limit, // Fetch more for onSale to filter
      }),
      db.product.count({ where }),
    ])

    let filteredProducts = products
    if (onSale) {
      filteredProducts = products
        .filter(p => p.comparePrice && p.price < p.comparePrice)
        .slice(0, limit)
    }

    return NextResponse.json({
      products: filteredProducts.map(p => ({
        ...p,
        images: JSON.parse(p.images || '[]'),
        specs: p.specs ? JSON.parse(p.specs) : null,
      })),
      pagination: {
        page,
        limit,
        total: onSale ? filteredProducts.length : total,
        totalPages: onSale ? 1 : Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
