import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // TODO: Retrieve payment methods from database
    const mockPaymentMethods = [
      {
        id: 'pm-1',
        userId,
        type: 'cod',
        name: 'Cash on Delivery',
        isDefault: true,
        createdAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'pm-2',
        userId,
        type: 'card',
        name: 'Visa ending in 4242',
        cardType: 'Visa',
        lastFour: '4242',
        expiryMonth: '12',
        expiryYear: '25',
        isDefault: false,
        createdAt: '2024-01-10T00:00:00Z',
      },
    ]

    return NextResponse.json({
      success: true,
      paymentMethods: mockPaymentMethods,
    })

  } catch (error) {
    console.error('Get payment methods error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve payment methods' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, cardDetails } = body

    if (!userId || !type) {
      return NextResponse.json(
        { error: 'User ID and type are required' },
        { status: 400 }
      )
    }

    if (type === 'card' && !cardDetails) {
      return NextResponse.json(
        { error: 'Card details are required for card payment method' },
        { status: 400 }
      )
    }

    // TODO: Save payment method to database
    // For cards, tokenize with payment processor first

    const newPaymentMethodId = `pm-${Date.now()}`

    return NextResponse.json({
      success: true,
      message: 'Payment method added successfully',
      paymentMethodId: newPaymentMethodId,
    }, { status: 201 })

  } catch (error) {
    console.error('Add payment method error:', error)
    return NextResponse.json(
      { error: 'Failed to add payment method' },
      { status: 500 }
    )
  }
}
