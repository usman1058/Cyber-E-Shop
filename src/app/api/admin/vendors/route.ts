import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query') || '';
        const status = searchParams.get('status') || 'all';

        const vendors = await db.vendor.findMany({
            where: {
                AND: [
                    query ? {
                        OR: [
                            { name: { contains: query } },
                            { email: { contains: query } },
                        ]
                    } : {},
                    status !== 'all' ? { status } : {},
                ]
            },
            include: {
                _count: {
                    select: { products: true, orders: true }
                }
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        const formattedVendors = vendors.map(v => ({
            id: v.id,
            name: v.name,
            email: v.email,
            phone: v.phone || '',
            status: v.status,
            category: v.category || 'N/A',
            productsCount: v._count.products,
            totalOrders: v._count.orders,
            averageRating: v.rating,
            joinedDate: v.joinedDate.toISOString().split('T')[0],
            logo: v.logo,
        }));

        return NextResponse.json({
            success: true,
            data: formattedVendors,
        });
    } catch (error) {
        console.error('Error fetching admin vendors:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch vendors' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, address, category, description, logo } = body;

        const existing = await db.vendor.findUnique({
            where: { email }
        });

        if (existing) {
            return NextResponse.json(
                { success: false, message: 'Vendor with this email already exists' },
                { status: 400 }
            );
        }

        const vendor = await db.vendor.create({
            data: {
                name,
                email,
                phone,
                address,
                category,
                description,
                logo,
                status: 'active',
            }
        });

        return NextResponse.json({
            success: true,
            data: vendor,
        });
    } catch (error) {
        console.error('Error creating vendor:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create vendor' },
            { status: 500 }
        );
    }
}
