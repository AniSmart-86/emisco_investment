import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
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

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
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
    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: payload.id },
      data: { name: body.name },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
