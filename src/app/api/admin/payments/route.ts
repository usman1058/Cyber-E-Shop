import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const payments = [
      { id: '1', orderId: 'ORD-5678', amount: 125.00, method: 'COD', status: 'paid', date: '2024-01-15' },
      { id: '2', orderId: 'ORD-5679', amount: 89.99, method: 'COD', status: 'paid', date: '2024-01-14' },
      { id: '3', orderId: 'ORD-5680', amount: 234.50, method: 'Card', status: 'refunded', date: '2024-01-10' },
    ];

    return NextResponse.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}
