import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message: 'Reset link sent to email',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to send reset link' },
      { status: 500 }
    );
  }
}
