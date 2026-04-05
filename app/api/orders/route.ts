import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

const orderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
});

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: payload.id },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const data = orderSchema.parse(body);

    const order = await prisma.$transaction(async (tx) => {
      // ✅ 1. Fetch all products in ONE query
      const productIds = data.items.map(i => i.productId);

      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      if (products.length !== productIds.length) {
        throw new Error('Some products not found');
      }

      let subtotal = 0;
      let totalItems = 0;

   
      for (const item of data.items) {
        const product = products.find(p => p.id === item.productId);

        if (!product || product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.productId}`);
        }

        subtotal += product.price * item.quantity;
        totalItems += item.quantity;
      }

      const deliveryFee = totalItems > 5 ? 10000 : 5000;
      const finalTotal = subtotal + deliveryFee;

      // ✅ 3. Atomic stock updates (safe)
      await Promise.all(
        data.items.map(item =>
          tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          })
        )
      );

      // ✅ 4. Create order with DB-verified prices
      const newOrder = await tx.order.create({
        data: {
          userId: payload.id,
          totalAmount: finalTotal,
          orderItems: {
            create: data.items.map(item => {
              const product = products.find(p => p.id === item.productId)!;

              return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price, // ✅ NEVER trust frontend price
                productName: product.name,
                productImage: product.image,
              };
            }),
          },
        },
        include: { orderItems: true },
      });

      return newOrder;
    }, {
      maxWait: 15000, // ✅ Wait up to 15s to get a connection (Prevents P2028)
      timeout: 30000, // ✅ Allow up to 30s for the transaction to complete
    });


    return NextResponse.json({ order }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    console.error('Order error:', error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}