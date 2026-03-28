import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // 1 & 2. Daily and Monthly Sales
    // Note: In a real heavy-duty production environment we would use SQL group-by
    // but for this implementation we can process it in memory since Prisma's
    // date groupings can be tricky across different DB engines.
    const allOrders = await prisma.order.findMany({
      where: { paymentStatus: 'PAID' },
      orderBy: { createdAt: 'asc' },
    });

    const dailyMap = new Map<string, number>();
    const monthlyMap = new Map<string, number>();

    allOrders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      const month = date.substring(0, 7); // YYYY-MM
      dailyMap.set(date, (dailyMap.get(date) || 0) + order.totalAmount);
      monthlyMap.set(month, (monthlyMap.get(month) || 0) + order.totalAmount);
    });

    const dailySales = Array.from(dailyMap.entries()).map(([date, revenue]) => ({ date, revenue }));
    const monthlySales = Array.from(monthlyMap.entries()).map(([month, revenue]) => ({ month, revenue }));

    // 3. Top Selling Products
    // Using Prisma groupBy on orderItems
    const topItems = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    // Fetch product names for the top items
    const topSellingProducts = await Promise.all(
      topItems.map(async (item) => {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        return {
          productName: product?.name || 'Unknown Product',
          quantitySold: item._sum.quantity || 0,
        };
      })
    );

    // 4. Recent Orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } },
    });

    return NextResponse.json({
      dailySales,
      monthlySales,
      topSellingProducts,
      recentOrders,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
