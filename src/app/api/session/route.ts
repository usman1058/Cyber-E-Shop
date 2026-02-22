import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken' // Correct import for standard jsonwebtoken library
// import { cookies } from 'next/headers' // Not strictly needed if using request.cookies

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Generate JWT token using correct syntax
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
    
    // Calculate expiration date
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // Get user info
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Store session in database
    await db.session.create({
      data: {
        userId,
        token,
        expiresAt,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    // Set JWT as httpOnly cookie
    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isAdmin: user.role === 'admin',
      },
    })

    // Set cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      expires: expiresAt,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Fixed: sameSite must be 'strict', 'lax', or 'none', not a URL
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Session creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({
        success: true,
        isAuthenticated: false,
        user: null,
      })
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

      if (!decoded) {
        return NextResponse.json({
          success: true,
          isAuthenticated: false,
          user: null,
        })
      }

      // Get session from database
      const session = await db.session.findUnique({
        where: { token },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
            },
          },
        },
      })

      if (!session) {
        return NextResponse.json({
          success: true,
          isAuthenticated: false,
          user: null,
        })
      }

      if (session.expiresAt < new Date()) {
        await db.session.delete({ where: { id: session.id } }).catch(() => {})
        return NextResponse.json({
          success: true,
          isAuthenticated: false,
          user: null,
        })
      }

      const user = session.user

      if (!user) {
        return NextResponse.json({
          success: true,
          isAuthenticated: false,
          user: null,
        })
      }

      return NextResponse.json({
        success: true,
        isAuthenticated: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isAdmin: user.role === 'admin',
        },
        token,
        expiresAt: session.expiresAt,
      })
    } catch (jwtError) {
      // Invalid JWT
      return NextResponse.json({
        success: true,
        isAuthenticated: false,
        user: null,
      })
    }

  } catch (error) {
    console.error('Session verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify session' },
      { 
        status: 500,
        ...(process.env.NODE_ENV === 'development' && { details: (error as Error).message }) 
      }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      )
    }

    // Verify JWT to ensure it's valid before we try to delete it
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Delete session from database
    // Fixed Logic: We must query by the raw 'token' string, not decoded.sub (which is the userId)
    await db.session.deleteMany({
      where: { token: token },
    })

    // Clear cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })

    response.cookies.delete('auth-token')

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Failed to logout' }, // Fixed generic error message
      { status: 500 }
    )
  }
}