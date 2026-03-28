import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

const orderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  totalAmount: z.number().positive(),
});

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const data = orderSchema.parse(body);

    // Verify stock and create order in a transaction
    const order = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      let totalItems = 0;

      for (const item of data.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product || product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.productId}`);
        }
        
        // Use verified price from DB
        subtotal += product.price * item.quantity;
        totalItems += item.quantity;

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - item.quantity },
        });
      }

      const deliveryFee = totalItems > 5 ? 10000 : 5000;
      const finalTotal = subtotal + deliveryFee;

      const newOrder = await tx.order.create({
        data: {
          userId: payload.id,
          totalAmount: finalTotal,
          orderItems: {
            create: data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: { orderItems: true },
      });

      return newOrder;
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
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
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
