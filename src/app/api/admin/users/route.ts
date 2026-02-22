import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const users = await db.user.findMany({
      include: {
        orders: {
          select: { total: true }
        },
        adminRole: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    const formattedUsers = users.map(u => ({
      id: u.id,
      name: u.name || 'Unknown User',
      email: u.email || 'No Email',
      role: u.role, // "admin" or "customer"
      adminRole: u.adminRole?.name || null,
      status: u.status,
      orderCount: u.orders.length,
      totalSpent: u.orders.reduce((acc, current) => acc + (current.total || 0), 0),
      lastLogin: u.updatedAt.toISOString(), // Simplified for now
    }));

    return NextResponse.json({
      success: true,
      data: formattedUsers,
    });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, status, role } = body;

    const user = await db.user.update({
      where: { id: userId },
      data: {
        status: status !== undefined ? status : undefined,
        role: role !== undefined ? role : undefined
      }
    });

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update user' },
      { status: 500 }
    );
  }
}
