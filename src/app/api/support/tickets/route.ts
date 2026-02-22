import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { category, subject, message, orderId, productId, email, userId: bodyUserId } = body;

    // Validate required fields
    if (!category || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: category, subject, and message are required',
        },
        { status: 400 }
      );
    }

    // Generate ticket ID
    const ticketId = `T-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900000) + 100000)}`;

    // Create ticket in database
    const ticket = await db.supportTicket.create({
      data: {
        ticketId,
        userId: bodyUserId || 'guest',
        subject,
        category,
        orderId,
        productId,
        status: 'open',
        priority: 'normal',
      },
    });

    // Create initial message
    await db.ticketMessage.create({
      data: {
        ticketId: ticket.id,
        senderId: bodyUserId || 'guest',
        senderName: 'Customer',
        message,
        isAdmin: false,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Ticket created successfully',
      data: ticket,
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create ticket. Please try again.',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'all';
    const category = searchParams.get('category') || 'all';
    const userId = searchParams.get('userId');

    const tickets = await db.supportTicket.findMany({
      where: {
        ...(status !== 'all' && { status }),
        ...(category !== 'all' && { category }),
        ...(userId && { userId }),
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: tickets.map(t => ({
        ...t,
        lastMessage: t.messages[0]?.message || 'No messages yet',
        lastMessageDate: t.messages[0]?.createdAt || t.createdAt,
      })),
      pagination: {
        total: tickets.length,
        page: 1,
        limit: 100,
      },
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch tickets',
      },
      { status: 500 }
    );
  }
}
