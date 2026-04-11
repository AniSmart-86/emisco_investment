import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, amount, orderId } = await request.json();

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount,
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

    return NextResponse.json(result);
  } catch (error) {
    console.error("Paystack init error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}