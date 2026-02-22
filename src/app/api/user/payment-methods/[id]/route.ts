import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paymentMethodId } = await params
    const body = await request.json()
    const { userId, isDefault } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // TODO: Update payment method in database
    // If isDefault is true, set all other payment methods to false

    return NextResponse.json({
      success: true,
      message: 'Payment method updated successfully',
    })

  } catch (error) {
    console.error('Update payment method error:', error)
    return NextResponse.json(
      { error: 'Failed to update payment method' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paymentMethodId } = await params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // TODO: Delete payment method from database
    // Prevent deletion of default payment method if it's the only one

    return NextResponse.json({
      success: true,
      message: 'Payment method deleted successfully',
    })

  } catch (error) {
    console.error('Delete payment method error:', error)
    return NextResponse.json(
      { error: 'Failed to delete payment method' },
      { status: 500 }
    )
  }
}
