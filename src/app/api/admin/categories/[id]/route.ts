import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, image, parentId } = body;

    const existing = await db.category.findFirst({
      where: {
        slug,
        NOT: { id }
      }
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Another category with this slug already exists' },
        { status: 400 }
      );
    }

    const category = await db.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        image,
        parentId
      }
    });

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if category has products
    const productsCount = await db.product.count({
      where: { categoryId: id }
    });

    if (productsCount > 0) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete category with associated products' },
        { status: 400 }
      );
    }

    await db.category.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
