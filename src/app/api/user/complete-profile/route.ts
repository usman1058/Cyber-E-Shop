import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, name, password, verifyEmail } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await db.user.update({
      where: { email },
      data: {
        name: name || user.name,
        password: hashedPassword,
        emailVerified: verifyEmail ? new Date() : user.emailVerified, 
      },
    })

    // Create success notification
    await db.notification.create({
      data: {
        userId: user.id,
        type: 'profile',
        title: 'Profile Completed!',
        message: 'Your account is now fully set up. You can now access all features of E-shop.',
        link: '/account'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
    })

  } catch (error) {
    console.error('Complete profile error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
