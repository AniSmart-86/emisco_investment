import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyToken(token);

    if (!payload?.id) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const { email, amount, orderId } = await request.json();

    // ✅ Security Check: Ensure the order belongs to the authenticated user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.userId !== payload.id) {
      return NextResponse.json({ error: "Unauthorized access to this order" }, { status: 403 });
    }

    // Paystack expects amount in Kobo (NGN * 100)
    // Safety check: if amount is already > 1,000,000 (likely pre-multiplied by 100), use as-is; otherwise multiply by 100
    const numericAmount = Number(amount);
    const amountInKobo = numericAmount > 1000000 ? Math.round(numericAmount) : Math.round(numericAmount * 100);

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amountInKobo,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-confirmation?orderId=${orderId}`,
        metadata: {
          orderId,
        },
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: result.message || "Failed to initialize payment" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ...result,
      authorization_url: result.data?.authorization_url,
    });





    if (!res.ok) {
      return NextResponse.json(
        { error: result.message || "Failed to initialize payment" },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Paystack init error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}