import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  oldPrice: z.number().positive().optional().nullable(),
  category: z.string().optional(),
  image: z.string().url().optional(),
  stock: z.number().int().nonnegative().optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = updateProductSchema.parse(body);

    const product = await prisma.product.update({
      where: { id },
      data,
    });

    return NextResponse.json({ product });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError<z.infer<typeof updateProductSchema>>;
      return NextResponse.json({ error: zodError.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
