import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['USER', 'ADMIN']).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || 'USER',
      },
    });

    const token = await signToken({ id: user.id, role: user.role });

    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    }, { status: 201 });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
