import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [orders, totalProducts, totalUsers] = await Promise.all([
      prisma.order.findMany(),
      prisma.product.count(),
      prisma.user.count(),
    ]);

    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter((o) => o.paymentStatus === 'PAID')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
