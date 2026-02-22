import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Code is required' },
        { status: 400 }
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message: 'MFA verified successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to verify code' },
      { status: 500 }
    );
  }
}
