import { NextRequest, NextResponse } from 'next/server'

// In a real app, you'd fetch this from something like https://api.exchangerate-api.com
const FALLBACK_RATES = {
  USD: 1,
  PKR: 280,
  EUR: 0.92,
  GBP: 0.79,
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      rates: FALLBACK_RATES,
      base: 'USD'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch rates' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { rates } = await request.json()
    return NextResponse.json({ success: true, message: 'Rates updated' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update rates' }, { status: 500 })
  }
}