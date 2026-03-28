import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.product.groupBy({
      by: ['category'],
      _count: {
        _all: true
      }
    });

    // Transform into a nicer format
    const formattedCategories = categories.map(cat => ({
      name: cat.category,
      count: cat._count._all,
      // We can use a default image or map it based on name
      image: getCategoryImage(cat.category)
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function getCategoryImage(name: string) {
  const images: Record<string, string> = {
    'Mack': 'https://images.unsplash.com/photo-1591768793355-74d7ca6e974e?q=80&w=800',
    'MAN Diesel': 'https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=800',
    'DAF': 'https://images.unsplash.com/photo-1586191128543-98960f78df25?q=80&w=800',
    'Volvo': 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=800',
    'Scania': 'https://images.unsplash.com/photo-1542442828-287217bfb8e1?q=80&w=800',
    'HOWO': 'https://images.unsplash.com/photo-1605152276890-449e798fbb38?q=80&w=800',
  };
  return images[name] || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800';
}
