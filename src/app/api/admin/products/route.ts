import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const status = searchParams.get('status') || 'all';
    const category = searchParams.get('category') || 'all';

    const products = await db.product.findMany({
      where: {
        AND: [
          query ? {
            OR: [
              { name: { contains: query } },
              { sku: { contains: query } },
            ]
          } : {},
          status !== 'all' ? { active: status === 'active' } : {},
          category !== 'all' ? { categoryId: category } : {},
        ]
      },
      include: {
        category: true,
        brand: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    const formattedProducts = products.map(p => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      price: p.price,
      stock: p.stock,
      category: p.category.name,
      status: p.active ? 'active' : 'inactive',
      image: p.images.split(',')[0],
    }));

    return NextResponse.json({
      success: true,
      data: formattedProducts,
    });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      sku,
      slug,
      description,
      price,
      comparePrice,
      cost,
      stock,
      categoryId,
      brandId,
      images,
      featured,
      active,
      isNew
    } = body;

    // Check if product with SKU or slug already exists
    const existingProduct = await db.product.findFirst({
      where: {
        OR: [
          { sku },
          { slug }
        ]
      }
    });

    if (existingProduct) {
      return NextResponse.json(
        { success: false, message: 'Product with this SKU or slug already exists' },
        { status: 400 }
      );
    }

    const product = await db.product.create({
      data: {
        name,
        sku,
        slug,
        description,
        price,
        comparePrice: comparePrice || null,
        cost: cost || null,
        stock,
        categoryId,
        brandId,
        images,
        featured,
        active,
        isNew,
      }
    });

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create product' },
      { status: 500 }
    );
  }
}
