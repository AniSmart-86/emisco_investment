import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id: rawId },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (payload.role !== 'ADMIN' && order.userId !== payload.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
