'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { api } from '@/lib/api';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Search } from 'lucide-react';
import Link from 'next/link';

export default function CategoryDetailsPage() {
  const { name } = useParams();
  const decodedName = typeof name === 'string' ? decodeURIComponent(name) : '';
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!decodedName) return;
    
    api.get(`/products?category=${decodedName}`)
      .then(res => setProducts(res.data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [decodedName]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <Link href="/categories" className="inline-flex items-center text-sm text-pure-green font-bold group mb-4">
          <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
          Back to Categories
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
           <div>
              <span className="text-pure-green font-bold text-sm uppercase tracking-widest block mb-2">Collection</span>
              <h1 className="text-4xl md:text-6xl font-bold capitalize">{decodedName} Parts</h1>
           </div>
           <p className="text-muted-foreground font-mono text-sm">
             {products.length} Products Found in Inventory
           </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
           {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[400px] bg-muted animate-pulse rounded-3xl" />
           ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
           {products.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
           ))}
        </div>
      ) : (
        <div className="py-32 text-center bg-muted/30 rounded-[3rem] border-2 border-dashed border-border/50">
           <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
             <Search className="w-10 h-10 text-muted-foreground/30" />
           </div>
           <h3 className="text-2xl font-bold mb-2">No Parts Found</h3>
           <p className="text-muted-foreground mb-8 italic">We currently don&apos;t have stock for {decodedName} in our inventory.</p>
           <Link href="/products">
             <Button variant="outline" className="rounded-xl border-pure-green text-pure-green hover:bg-pure-green/10">Browse Full Catalog</Button>
           </Link>
        </div>
      )}
    </div>
  );
}
