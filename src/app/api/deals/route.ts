import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const active = searchParams.get('active') !== 'false'
    const type = searchParams.get('type')

    const where: any = {}

    if (active) {
      where.active = true
      where.OR = [
        { endDate: { gte: new Date() } },
        { endDate: null },
      ]
    }

    if (type) {
      where.type = type
    }

    const deals = await db.deal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      deals: deals.map(deal => ({
        ...deal,
        products: deal.products ? JSON.parse(deal.products) : [],
      })),
    })
  } catch (error) {
    console.error('Error fetching deals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    )
  }
}
