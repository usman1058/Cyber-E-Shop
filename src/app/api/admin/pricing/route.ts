import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slugify } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';

    const now = new Date();
    const deals = await db.deal.findMany({
      orderBy: {
        createdAt: 'desc',
      }
    });

    if (!deals) {
        return NextResponse.json({ success: true, data: [] });
    }

    const formattedDeals = deals.map(d => {
      let currentStatus: 'active' | 'scheduled' | 'expired' | 'paused' = 'active';

      const start = d.startDate ? new Date(d.startDate) : null;
      const end = d.endDate ? new Date(d.endDate) : null;

      if (!d.active) currentStatus = 'paused';
      else if (start && start > now) currentStatus = 'scheduled';
      else if (end && end < now) currentStatus = 'expired';

      return {
        id: d.id,
        name: d.name,
        type: d.type,
        value: d.value,
        scope: d.scope,
        scopeValue: d.scopeValue,
        startDate: start ? start.toISOString().split('T')[0] : '',
        endDate: end ? end.toISOString().split('T')[0] : '',
        status: currentStatus,
        usage: d.usageCount,
        minPurchase: d.minPurchase,
      };
    });

    // Filter by status if requested
    const filtered = status === 'all'
      ? formattedDeals
      : formattedDeals.filter(d => d.status === status);

    return NextResponse.json({
      success: true,
      data: formattedDeals,
    });
  } catch (error: any) {
    console.error('Error fetching admin pricing:', error);
    return NextResponse.json(
      { success: false, message: `Failed: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, value, scope, scopeValue, startDate, endDate, minPurchase } = body;

    const deal = await db.deal.create({
      data: {
        name,
        slug: slugify(name) + '-' + Math.random().toString(36).substring(2, 7),
        type,
        value: parseFloat(value),
        scope,
        scopeValue,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        minPurchase: minPurchase ? parseFloat(minPurchase) : 0,
        active: true,
      }
    });

    return NextResponse.json({
      success: true,
      data: deal,
    });
  } catch (error) {
    console.error('Error creating deal:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create pricing deal' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, active } = body;

    const deal = await db.deal.update({
      where: { id },
      data: { active }
    });

    return NextResponse.json({
      success: true,
      data: deal,
    });
  } catch (error) {
    console.error('Error updating deal:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update deal' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });

    await db.deal.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Deal deleted'
    });
  } catch (error) {
    console.error('Error deleting deal:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete deal' },
      { status: 500 }
    );
  }
}
