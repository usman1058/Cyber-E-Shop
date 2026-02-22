import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { products, requirements } = body

    if (!products || products.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 products are required for compatibility check' },
        { status: 400 }
      )
    }

    // TODO: Implement actual compatibility checking
    // In production:
    // 1. Retrieve product specifications
    // 2. Check compatibility rules
    // 3. Return detailed compatibility report

    // Mock compatibility check
    const compatibilityReport: any = {
      compatible: true,
      compatibilityScore: 95,
      products: products.map((p: any, index: number) => ({
        productId: p.productId,
        name: p.name || `Product ${index + 1}`,
        category: p.category || 'Unknown',
        specifications: {
          'Power Requirements': '100-240V, 50/60Hz',
          'Dimensions': p.dimensions || 'Standard',
          'Connectivity': p.connectivity || 'Standard',
          'Operating System': p.os || 'Compatible',
        },
      })),
      issues: [],
      recommendations: [
        'These products are fully compatible and work well together',
        'Consider using surge protection for optimal performance',
        'Ensure proper cable connections for best results',
      ],
    }

    // If requirements provided, check if products meet them
    if (requirements) {
      const requirementChecks = Object.entries(requirements).map(([key, value]) => {
        const met = true // Mock check
        return {
          requirement: key,
          value,
          met,
          notes: met ? 'Requirement satisfied' : 'Requirement not fully met',
        }
      })

      compatibilityReport.requirements = requirementChecks
      compatibilityReport.allRequirementsMet = requirementChecks.every(r => r.met)
    }

    return NextResponse.json({
      success: true,
      report: compatibilityReport,
    })

  } catch (error) {
    console.error('Compatibility check error:', error)
    return NextResponse.json(
      { error: 'Failed to check compatibility' },
      { status: 500 }
    )
  }
}

// Get compatibility info for a single product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const product = await db.product.findUnique({
      where: { id: productId },
      include: { category: true }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const compatibleProducts = await db.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        active: true,
      },
      take: 5
    })

    return NextResponse.json({
      success: true,
      compatibility: {
        productId,
        name: product.name,
        category: product.category.name,
        compatibleProducts: compatibleProducts.map(p => ({ id: p.id, name: p.name, slug: p.slug })),
        notes: [
          `This ${product.category.name} is compatible with most devices in its class.`,
          'Check specific connector requirements for full functionality.',
        ],
      },
    })

  } catch (error) {
    console.error('Get compatibility info error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve compatibility info' },
      { status: 500 }
    )
  }
}
