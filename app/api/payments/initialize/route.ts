import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

const initializeSchema = z.object({
  email: z.string().email(),
  amount: z.number().positive(),
  orderId: z.string().uuid(),
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
    const data = initializeSchema.parse(body);

    // In a real application, you'd call Paystack/Stripe API here
    // e.g., const response = await axios.post('https://api.paystack.co/transaction/initialize', ...)
    
    // We mock the response
    const mockReference = `txn_${Date.now()}`;
    const mockPaymentLink = `https://checkout.paystack.com/${mockReference}`;

    return NextResponse.json({
      authorization_url: mockPaymentLink,
      reference: mockReference,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
