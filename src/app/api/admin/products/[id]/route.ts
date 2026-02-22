import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await db.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        brand: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if another product with the same SKU or slug exists
    const existingProduct = await db.product.findFirst({
      where: {
        OR: [
          { sku },
          { slug }
        ],
        NOT: { id: params.id }
      }
    });

    if (existingProduct) {
      return NextResponse.json(
        { success: false, message: 'Another product with this SKU or slug already exists' },
        { status: 400 }
      );
    }

    const product = await db.product.update({
      where: { id: params.id },
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
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.product.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
