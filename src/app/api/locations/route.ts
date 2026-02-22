import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country')
    const city = searchParams.get('city')

    // TODO: Retrieve store locations from database
    const where: any = { active: true }
    if (country) where.country = country
    if (city) where.city = { contains: city }

    const locations = await db.storeLocation.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    const allLocations = await db.storeLocation.findMany({
      where: { active: true },
      select: { country: true, city: true }
    })

    return NextResponse.json({
      success: true,
      locations,
      total: locations.length,
      countries: [...new Set(allLocations.map(loc => loc.country))],
      cities: [...new Set(allLocations.map(loc => loc.city))],
    })

  } catch (error) {
    console.error('Get locations error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve locations' },
      { status: 500 }
    )
  }
}
