'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Category } from '@/lib/types';
import { CategoryCard } from '@/components/CategoryCard';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div>
          <Link href="/" className="inline-flex items-center text-sm text-pure-green font-bold group mb-4">
            <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold">All Categories</h1>
          <p className="text-muted-foreground mt-4 italic">Discover our full range of official spare parts by brand.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {categories.map((cat, index) => (
            <CategoryCard key={index} name={cat.name} count={cat.count} image={cat.image} />
          ))}
        </div>
      )}
    </div>
  );
}
