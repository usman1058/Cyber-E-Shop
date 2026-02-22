import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// In a real app, you'd fetch this from something like https://api.exchangerate-api.com
const FALLBACK_RATES = {
  PKR: 1,
  USD: 1 / 280,
  EUR: 1 / 300,
  GBP: 1 / 350,
}

export async function GET() {
  try {
    // Check if we have overrides in DB
    // const settings = await db.systemSettings.findUnique({ where: { key: 'currency_rates' } })
    
    return NextResponse.json({
      success: true,
      rates: FALLBACK_RATES,
      base: 'PKR'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch rates' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { rates } = await request.json()
    // Update DB with new rates
    // This would be called from the Admin panel
    
    return NextResponse.json({ success: true, message: 'Rates updated' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update rates' }, { status: 500 })
  }
}
