import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({
        success: true,
        addresses: [],
      })
    }

    const addresses = await db.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      addresses,
    })

  } catch (error) {
    console.error('Get addresses error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve addresses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, fullName, phone, address, apartment, city, state, postalCode, country, isDefault = false } = body

    if (!userId || !fullName || !address || !city || !state || !postalCode || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    const newAddress = await db.address.create({
      data: {
        userId,
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
      message: 'Address added successfully',
      address: newAddress,
    }, { status: 201 })

  } catch (error) {
    console.error('Add address error:', error)
    return NextResponse.json(
      { error: 'Failed to add address' },
      { status: 500 }
    )
  }
}
