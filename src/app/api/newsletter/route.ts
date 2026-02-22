import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, preferences, frequency } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      )
    }

    // Check if already subscribed
    const existing = await db.newsletterSubscription.findUnique({
      where: { email },
    })

    if (existing) {
      // Update existing subscription
      const updated = await db.newsletterSubscription.update({
        where: { email },
        data: {
          preferences: preferences ? JSON.stringify(preferences) : existing.preferences,
          frequency: frequency || existing.frequency,
          active: true,
        },
      })

      return NextResponse.json({
        message: 'Subscription updated successfully',
        subscription: updated,
      })
    }

    // Create new subscription
    const subscription = await db.newsletterSubscription.create({
      data: {
        email,
        preferences: preferences ? JSON.stringify(preferences) : null,
        frequency: frequency || 'weekly',
        active: true,
      },
    })

    return NextResponse.json({
      message: 'Subscription successful',
      subscription,
    })
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    )
  }
}
