import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: addressId } = await params
    const body = await request.json()
    const { userId, fullName, phone, address, apartment, city, state, postalCode, country, isDefault } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // If setting as default, unset others
    if (isDefault) {
      await db.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      })
    }

    const updatedAddress = await db.address.update({
      where: { id: addressId },
      data: {
        fullName,
        phone,
        address,
        apartment,
        city,
        state,
        postalCode,
        country,
        isDefault,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Address updated successfully',
      address: updatedAddress,
    })

  } catch (error) {
    console.error('Update address error:', error)
    return NextResponse.json(
      { error: 'Failed to update address' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: addressId } = await params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    await db.address.delete({
      where: { id: addressId },
    })

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully',
    })

  } catch (error) {
    console.error('Delete address error:', error)
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    )
  }
}
