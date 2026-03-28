import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string(),
  price: z.number().positive(),
  oldPrice: z.number().positive().optional().nullable(),
  category: z.string(),
  image: z.string().url(),
  stock: z.number().int().nonnegative(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = productSchema.parse(body);

    const product = await prisma.product.create({
      data,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
