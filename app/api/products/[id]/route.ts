import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const idSchema = z.string().uuid();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = idSchema.parse(rawId);
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }
}
