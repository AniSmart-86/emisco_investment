import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

/* ================= VALIDATION ================= */

const verifySchema = z.object({
  reference: z.string().min(1),
  orderId: z.string().uuid(),
});

/* ================= TYPES ================= */

interface PaystackVerificationResponse {
  status: boolean;
  message: string;
  data: {
    status: 'success' | 'failed' | 'abandoned';
    reference: string;
    amount: number;
    paid_at: string | null;
    channel: string;
    currency: string;
  };
}

/* ================= HANDLER ================= */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ✅ Validate input
    const { reference, orderId } = verifySchema.parse(body);

    /* ================= VERIFY WITH PAYSTACK ================= */

    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) {
      throw new Error('Failed to verify payment with Paystack');
    }

    const result: PaystackVerificationResponse = await res.json();

    if (result.status && result.data.status === 'success') {
      // ✅ Update Order in Database
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'PAID',
          reference: reference, // Save reference to prevent duplicate processing
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Payment verified and order updated',
        order: updatedOrder,
      });
    }

    return NextResponse.json(
      { success: false, message: 'Payment verification failed', details: result },
      { status: 400 }
    );

  } catch (error) {
    console.error('VERIFY ERROR:', error);

    // Zod error handling
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}