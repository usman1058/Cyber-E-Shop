import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';

    const tickets = await db.supportTicket.findMany({
      where: status !== 'all' ? { status } : {},
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    const formattedTickets = tickets.map(t => ({
      id: t.id,
      ticketId: `TICK-${t.id.substring(0, 8).toUpperCase()}`,
      subject: t.subject,
      category: 'General', // Default for now
      status: t.status,
      priority: t.priority,
      userId: t.userId,
      userName: t.user.name || 'Unknown User',
      createdAt: t.createdAt.toISOString(),
      assignedTo: 'Support Team', // Default for now
    }));

    return NextResponse.json({
      success: true,
      data: formattedTickets,
    });
  } catch (error) {
    console.error('Error fetching admin tickets:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticketId, status, priority } = body;

    const ticket = await db.supportTicket.update({
      where: { id: ticketId },
      data: { 
        status: status !== undefined ? status : undefined,
        priority: priority !== undefined ? priority : undefined
      }
    });

    return NextResponse.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update ticket' },
      { status: 500 }
    );
  }
}
