import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: ticketId } = await params
    const body = await request.json();
    const { message, isAdmin } = body;

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          message: 'Message is required',
        },
        { status: 400 }
      );
    }

    // TODO: Implement actual database save using Prisma
    // const ticketMessage = await db.ticketMessage.create({
    //   data: {
    //     ticketId: params.id,
    //     senderId: user?.id,
    //     senderName: user?.name || 'Guest',
    //     isAdmin: isAdmin || false,
    //     message,
    //   },
    // });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      data: {
        messageId: Date.now().toString(),
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error adding message to ticket:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send message',
      },
      { status: 500 }
    );
  }
}
