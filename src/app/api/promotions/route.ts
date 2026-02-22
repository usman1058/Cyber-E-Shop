import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const active = searchParams.get('active') !== 'false' // default to true

    // TODO: Retrieve promotions from database
    const mockPromotions = [
      {
        id: 'promo-1',
        title: 'Flash Sale - Electronics',
        description: 'Get up to 40% off on select electronics',
        type: 'flash-sale',
        discount: {
          type: 'percentage',
          value: 0.40,
          maxAmount: 500,
        },
        code: 'FLASH40',
        startDate: '2024-01-15T00:00:00Z',
        endDate: '2024-01-17T23:59:59Z',
        isActive: true,
        categories: ['Electronics', 'Computers', 'Gaming'],
        products: [],
        minPurchase: 0,
        maxUsage: null,
        currentUsage: 1250,
        image: '/images/promotions/flash-sale.jpg',
        featured: true,
      },
      {
        id: 'promo-2',
        title: 'Free Shipping Weekend',
        description: 'Enjoy free shipping on all orders this weekend',
        type: 'shipping',
        discount: {
          type: 'shipping',
          value: 0,
        },
        code: 'FREESHIP',
        startDate: '2024-01-20T00:00:00Z',
        endDate: '2024-01-21T23:59:59Z',
        isActive: true,
        categories: [],
        products: [],
        minPurchase: 0,
        maxUsage: null,
        currentUsage: 2340,
        image: '/images/promotions/free-shipping.jpg',
        featured: false,
      },
      {
        id: 'promo-3',
        title: 'New Customer Special',
        description: '20% off your first order',
        type: 'welcome',
        discount: {
          type: 'percentage',
          value: 0.20,
          maxAmount: 100,
        },
        code: 'WELCOME20',
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-12-31T23:59:59Z',
        isActive: true,
        categories: [],
        products: [],
        minPurchase: 50,
        maxUsage: 1,
        currentUsage: 0,
        image: '/images/promotions/welcome.jpg',
        featured: false,
      },
      {
        id: 'promo-4',
        title: '$50 Off All Orders',
        description: 'Get $50 off on all orders over $200',
        type: 'fixed',
        discount: {
          type: 'fixed',
          value: 50,
        },
        code: 'SAVE50',
        startDate: '2024-01-10T00:00:00Z',
        endDate: '2024-01-31T23:59:59Z',
        isActive: true,
        categories: [],
        products: [],
        minPurchase: 200,
        maxUsage: null,
        currentUsage: 890,
        image: '/images/promotions/flat50.jpg',
        featured: true,
      },
    ]

    let filteredPromotions = mockPromotions

    if (active) {
      const now = new Date().toISOString()
      filteredPromotions = filteredPromotions.filter(
        promo => promo.isActive && now >= promo.startDate && now <= promo.endDate
      )
    }

    if (type) {
      filteredPromotions = filteredPromotions.filter(promo => promo.type === type)
    }

    return NextResponse.json({
      success: true,
      promotions: filteredPromotions,
      total: filteredPromotions.length,
      featured: filteredPromotions.filter(p => p.featured),
    })

  } catch (error) {
    console.error('Get promotions error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve promotions' },
      { status: 500 }
    )
  }
}

// Apply promotion code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, userId, cartValue } = body

    if (!code) {
      return NextResponse.json(
        { error: 'Promotion code is required' },
        { status: 400 }
      )
    }

    // TODO: Validate and apply promotion code
    // In production:
    // 1. Check if code exists and is active
    // 2. Check expiration date
    // 3. Check usage limits
    // 4. Check minimum purchase requirements
    // 5. Check if user has already used (for one-time codes)
    // 6. Calculate discount amount

    // Mock promotion validation
    const validPromoCodes = {
      'FLASH40': { discount: 0.40, type: 'percentage', maxAmount: 500 },
      'FREESHIP': { discount: 0, type: 'shipping' },
      'WELCOME20': { discount: 0.20, type: 'percentage', maxAmount: 100 },
      'SAVE50': { discount: 50, type: 'fixed' },
    }

    const promo = validPromoCodes[code.toUpperCase()]

    if (!promo) {
      return NextResponse.json(
        { error: 'Invalid promotion code' },
        { status: 404 }
      )
    }

    let discountAmount = 0
    if (promo.type === 'percentage') {
      discountAmount = cartValue * promo.discount
      if (promo.maxAmount && discountAmount > promo.maxAmount) {
        discountAmount = promo.maxAmount
      }
    } else if (promo.type === 'fixed') {
      discountAmount = promo.discount
    }

    return NextResponse.json({
      success: true,
      message: 'Promotion applied successfully',
      promotion: {
        code: code.toUpperCase(),
        type: promo.type,
        discount: promo.discount,
        discountAmount: discountAmount.toFixed(2),
        maxAmount: promo.maxAmount,
      },
    })

  } catch (error) {
    console.error('Apply promotion error:', error)
    return NextResponse.json(
      { error: 'Failed to apply promotion' },
      { status: 500 }
    )
  }
}
