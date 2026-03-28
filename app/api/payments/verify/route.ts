import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const verifySchema = z.object({
  reference: z.string(),
  orderId: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = verifySchema.parse(body);

    // In a real application, you'd verify the transation with your payment gateway using the reference
    // await axios.get(`https://api.paystack.co/transaction/verify/${data.reference}`)
    
    // We mock verification process
    const isSuccessful = true; // Assuming successful mock

    if (isSuccessful) {
      const updatedOrder = await prisma.order.update({
        where: { id: data.orderId },
        data: { paymentStatus: 'PAID' },
      });
      return NextResponse.json({ success: true, order: updatedOrder });
    } else {
      await prisma.order.update({
        where: { id: data.orderId },
        data: { paymentStatus: 'FAILED' },
      });
      return NextResponse.json({ error: 'Payment failed' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
