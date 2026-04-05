import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text(); // 🔥 RAW BODY (IMPORTANT)

    const signature = req.headers.get('x-paystack-signature') || '';

    // 🔐 VERIFY PAYSTACK SIGNATURE
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    const reference = event.data.reference;
    const orderId = event.data.metadata?.orderId;

    if (!orderId) {
      console.warn('Webhook received without orderId in metadata:', reference);
      return NextResponse.json({ error: 'No orderId in metadata' }, { status: 400 });
    }

    // ✅ HANDLE SUCCESSFUL PAYMENT
    if (event.event === 'charge.success') {
      // 🔥 Prevent duplicate updates - check if reference already exists for this order or another
      const alreadyPaid = await prisma.order.findUnique({
          where: { id: orderId }
      });

      if (alreadyPaid?.paymentStatus === 'PAID') {
          return NextResponse.json({ message: 'Order already marked as paid' });
      }

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'PAID',
          reference,
        },
      });

      return NextResponse.json({
        success: true,
        order: updatedOrder,
      });
    }

    // ❌ HANDLE FAILED PAYMENT (or other events)
    if (event.event === 'charge.failed') {
        await prisma.order.update({
            where: { id: orderId },
            data: {
                paymentStatus: 'FAILED',
            },
        });

        return NextResponse.json({ success: false, message: 'Payment failed updated in DB' });
    }

    return NextResponse.json({ message: 'Event received' });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}