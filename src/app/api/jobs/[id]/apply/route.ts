import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params
    const body = await request.json()
    const { name, email, phone, resume, coverLetter } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    const application = await db.jobApplication.create({
      data: {
        jobId,
        name,
        email,
        phone,
        resume,
        coverLetter,
        status: 'pending',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      application,
    }, { status: 201 })
  } catch (error) {
    console.error('Error submitting application:', error)
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}
