import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const type = searchParams.get('type') || 'all' // all, products, brands, categories
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters' },
        { status: 400 }
      )
    }

    const searchTerm = query.trim()

    // Track search query
    const existingSearch = await db.searchQuery.findFirst({
      where: { query: searchTerm },
    })

    if (existingSearch) {
      await db.searchQuery.update({
        where: { id: existingSearch.id },
        data: {
          searchCount: existingSearch.searchCount + 1,
          lastSearchedAt: new Date(),
        },
      })
    } else {
      await db.searchQuery.create({
        data: {
          query: searchTerm,
          searchCount: 1,
          lastSearchedAt: new Date(),
        },
      })
    }

    const results: any = {}

    if (type === 'all' || type === 'products') {
      const [products, productTotal] = await Promise.all([
        db.product.findMany({
          where: {
            active: true,
            OR: [
              { name: { contains: searchTerm } },
              { description: { contains: searchTerm } },
            ],
          },
          include: { brand: true, category: true },
          take: limit,
          skip: (page - 1) * limit,
          orderBy: { createdAt: 'desc' },
        }),
        db.product.count({
          where: {
            active: true,
            OR: [
              { name: { contains: searchTerm } },
              { description: { contains: searchTerm } },
            ],
          },
        }),
      ])

      results.products = products.map(p => ({
        ...p,
        images: JSON.parse(p.images || '[]'),
        specs: p.specs ? JSON.parse(p.specs) : null,
      }))
      results.productCount = productTotal
    }

    if (type === 'all' || type === 'brands') {
      const brands = await db.brand.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm } },
            { description: { contains: searchTerm } },
          ],
        },
        orderBy: { name: 'asc' },
        take: 10,
      })

      results.brands = brands
    }

    if (type === 'all' || type === 'categories') {
      const categories = await db.category.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm } },
            { description: { contains: searchTerm } },
          ],
        },
        orderBy: { name: 'asc' },
        take: 10,
      })

      results.categories = categories
    }

    return NextResponse.json({
      query: searchTerm,
      type,
      ...results,
      pagination: type === 'products'
        ? {
            page,
            limit,
            total: results.productCount || 0,
            totalPages: Math.ceil((results.productCount || 0) / limit),
          }
        : undefined,
    })
  } catch (error) {
    console.error('Error performing search:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
