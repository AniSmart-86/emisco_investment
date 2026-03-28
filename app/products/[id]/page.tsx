'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Truck, ShieldCheck, BadgeCheck, Minus, Plus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/cartStore';
import { toast } from 'sonner';
import { ProductCard } from '@/components/ProductCard';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';

// Data fetched from API

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // We don't call setIsLoading(true) synchronously here to avoid cascading renders.
    // Since isLoading is initialized to true, the first fetch is covered.
    // If the ID changes later, we set it then.
    
    let isDataFetched = false;

    const fetchProduct = async () => {
      if (isDataFetched) return;
      isDataFetched = true;
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        
        const relatedRes = await api.get(`/products?category=${res.data.category}`);
        setRelatedProducts(relatedRes.data.filter((p: Product) => p.id !== id).slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-20 text-center"><p className="text-muted-foreground animate-pulse">Loading parts data...</p></div>;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
        <Button onClick={() => router.push('/products')}>Back to Shop</Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({ ...product, quantity });
    toast.success(`${quantity} ${product.name} added to cart!`);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Button
        variant="ghost"
        className="mb-8 hover:bg-pure-green/10 text-muted-foreground hover:text-pure-green transition-colors"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 w-4 h-4" /> Back to Catalog
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-24">
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-square rounded-3xl overflow-hidden bg-card border border-border/50 group"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <div className="bg-background/80 backdrop-blur-md p-2 rounded-xl border border-border shadow-xl">
               <ShieldCheck className="w-5 h-5 text-pure-green" />
            </div>
          </div>
        </motion.div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <div className="mb-8">
            <span className="inline-block py-1 px-3 rounded-full bg-pure-green/10 text-pure-green text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
              {product.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
               <span className="bg-linear-to-r from-purple-400 to-green-500 text-transparent bg-clip-text">
                 {product.name}
               </span>
            </h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-current" />)}
              </div>
              <span className="text-sm text-muted-foreground">(24 Reviews)</span>
              <span className="text-sm text-pure-green font-bold">In Stock</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold">₦{product.price.toLocaleString()}</span>
              {product.oldPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ₦{product.oldPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <p className="text-muted-foreground text-lg leading-relaxed mb-10">
            {product.description}
          </p>

          <div className="space-y-8 mb-10">
            {/* Quantity Selector */}
            <div className="flex items-center gap-6">
              <span className="font-bold">Quantity:</span>
              <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-2xl border border-border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl h-10 w-10"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="w-12 text-center font-bold">{quantity}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl h-10 w-10 text-pure-green"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="grow md:flex-initial px-10 py-8 bg-pure-green hover:bg-pure-green-hover text-white rounded-2xl font-bold text-xl group" onClick={handleAddToCart}>
                Add to Cart
                <ShoppingCart className="ml-3 w-6 h-6 group-hover:scale-110 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Key Advantages */}
          <div className="grid grid-cols-2 gap-4 border-t border-border pt-8">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-pure-green" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Fast Logistics</span>
            </div>
            <div className="flex items-center gap-3">
              <BadgeCheck className="w-5 h-5 text-pure-green" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">1-Year Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-24 border-t border-border">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Recommended for You</h2>
              <p className="text-muted-foreground">Similar parts from the {product.category} collection.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
