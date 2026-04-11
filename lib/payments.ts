
import prisma from './prisma';

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
    customer: {
      email: string;
    };
  };
}

/**
 * Shared utility to verify a Paystack transaction and update the order in the database.
 * This can be safely called from both API routes and Server Components.
 */
export async function verifyPaystackPayment(reference: string, orderId: string) {
  try {
    // 1. Verify with Paystack
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
      // 2. Update Order in Database if not already paid
      // We fetch the order with its user data for a reliable UI fallback
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          user: {
            select: {
              email: true,
              name: true,
            }
          }
        }
      });

      if (!order) {
        throw new Error('Order not found in database');
      }

      if (order.paymentStatus !== 'PAID') {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: 'PAID',
            reference: reference, 
          },
        });
      }

      return {
        success: true,
        data: result.data,
        order: {
            id: order.id,
            amount: order.totalAmount,
            email: order.user.email,
            name: order.user.name,
        }
      };
    }

    return {
      success: false,
      message: result.message || 'Payment verification failed',
      data: result.data,
    };
  } catch (error) {
    console.error('PAYMENT_VERIFICATION_ERROR:', error);
    return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}
