import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { birthDate, sessionId, userId } = body

    if (!birthDate) {
      return NextResponse.json(
        { error: 'Birth date is required' },
        { status: 400 }
      )
    }

    if (!userId && !sessionId) {
      return NextResponse.json(
        { error: 'User ID or Session ID is required' },
        { status: 400 }
      )
    }

    // Parse and validate birth date
    const birth = new Date(birthDate)
    const today = new Date()

    if (isNaN(birth.getTime())) {
      return NextResponse.json(
        { error: 'Invalid birth date' },
        { status: 400 }
      )
    }

    // Calculate age
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    // Minimum age requirement (adjust based on your jurisdiction)
    const minimumAge = 18
    const isOfAge = age >= minimumAge

    // TODO: Save age verification to database
    // In production:
    // 1. Record age verification
    // 2. Store verification method and timestamp
    // 3. Store in session/cookie
    // 4. For GDPR, may need explicit consent tracking

    const verificationId = `age-verify-${Date.now()}`

    return NextResponse.json({
      success: true,
      verified: isOfAge,
      age,
      minimumAge,
      verificationId,
      message: isOfAge
        ? 'Age verification successful'
        : `You must be at least ${minimumAge} years old to continue`,
    })

  } catch (error) {
    console.error('Age verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify age' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const sessionId = searchParams.get('sessionId')

    if (!userId && !sessionId) {
      return NextResponse.json(
        { error: 'User ID or Session ID is required' },
        { status: 400 }
      )
    }

    // TODO: Retrieve age verification status from database
    // Check session or user record for previous verification

    return NextResponse.json({
      success: true,
      verified: false, // Default to requiring verification
      message: 'Age verification required',
    })

  } catch (error) {
    console.error('Get age verification error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve age verification status' },
      { status: 500 }
    )
  }
}
