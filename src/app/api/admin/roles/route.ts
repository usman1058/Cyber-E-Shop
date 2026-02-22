import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const roles = await db.adminRole.findMany({
            include: {
                _count: {
                    select: { users: true }
                }
            },
            orderBy: {
                name: 'asc',
            }
        });

        const formattedRoles = roles.map(r => ({
            id: r.id,
            name: r.name,
            description: r.description,
            userCount: r._count.users,
            permissions: r.permissions ? JSON.parse(r.permissions) : [],
        }));

        return NextResponse.json({
            success: true,
            data: formattedRoles,
        });
    } catch (error) {
        console.error('Error fetching admin roles:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch roles' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, permissions } = body;

        const existing = await db.adminRole.findUnique({
            where: { name }
        });

        if (existing) {
            return NextResponse.json(
                { success: false, message: 'Role with this name already exists' },
                { status: 400 }
            );
        }

        const role = await db.adminRole.create({
            data: {
                name,
                description,
                permissions: JSON.stringify(permissions),
            }
        });

        return NextResponse.json({
            success: true,
            data: role,
        });
    } catch (error) {
        console.error('Error creating role:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create role' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });

        // Check if super admin or has users
        const role = await db.adminRole.findUnique({
            where: { id },
            include: { _count: { select: { users: true } } }
        });

        if (role?.name === 'Super Admin') {
            return NextResponse.json({ success: false, message: 'Cannot delete Super Admin role' }, { status: 400 });
        }

        if (role?._count.users && role._count.users > 0) {
            return NextResponse.json({ success: false, message: 'Cannot delete role assigned to users' }, { status: 400 });
        }

        await db.adminRole.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            message: 'Role deleted'
        });
    } catch (error) {
        console.error('Error deleting role:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete role' },
            { status: 500 }
        );
    }
}
