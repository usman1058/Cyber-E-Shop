import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const products = await db.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        stock: 'asc',
      }
    });

    const threshold = 5;

    const inventoryItems = products.map(p => {
      let status: 'normal' | 'low' | 'critical' | 'warning' = 'normal';
      if (p.stock === 0) status = 'critical';
      else if (p.stock <= threshold) status = 'low';
      else if (p.stock <= threshold * 2) status = 'warning';

      return {
        id: p.id,
        name: p.name,
        sku: p.sku,
        category: p.category.name,
        stock: p.stock,
        threshold: threshold,
        status: status,
      };
    });

    return NextResponse.json({
      success: true,
      data: inventoryItems,
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, adjustment } = body;

    const product = await db.product.update({
      where: { id: productId },
      data: {
        stock: {
          increment: parseInt(adjustment)
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error adjusting inventory:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to adjust inventory' },
      { status: 500 }
    );
  }
}
