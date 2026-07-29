'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Truck, ShieldCheck, BadgeCheck, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/cartStore';
import { toast } from 'sonner';
import { ProductCard } from '@/components/ProductCard';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';

export default function ProductDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-pure-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">The spare part you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.push('/products')} className="bg-pure-green text-white">
          Back to Products
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      category: product.category,
    });
    toast.success(`Added ${quantity}× ${product.name} to cart!`);
  };

  return (
    <div className="container mx-auto px-4 py-12 space-y-20">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="flex items-center gap-2 hover:bg-muted/50 text-muted-foreground"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Search
      </Button>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left: Product Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative aspect-square rounded-[3rem] overflow-hidden bg-card border border-border/50 shadow-2xl"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
            priority
          />
          <span className="absolute top-6 left-6 px-4 py-2 rounded-full bg-pure-green text-white text-xs font-bold uppercase tracking-widest shadow-lg">
            {product.category}
          </span>
        </motion.div>

        {/* Right: Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-3xl md:text-4xl font-extrabold text-pure-green">
                ₦{product.price.toLocaleString()}
              </span>
              {product.oldPrice && (
                <span className="text-lg md:text-xl text-muted-foreground line-through">
                  ₦{product.oldPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <p className="text-muted-foreground text-base md:text-lg leading-relaxed border-y border-border/50 py-6">
            {product.description}
          </p>

          {/* Stock & Quantity Control */}
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                Quantity
              </span>
              <div className="flex items-center border border-border rounded-2xl bg-card">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:text-pure-green transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:text-pure-green transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              size="lg"
              className="w-full bg-pure-green hover:bg-pure-green-hover text-white py-8 rounded-2xl text-xl font-bold shadow-2xl shadow-pure-green/20 flex items-center justify-center gap-3"
            >
              <ShoppingCart className="w-6 h-6" /> Add to Cart (₦{(product.price * quantity).toLocaleString()})
            </Button>
          </div>

          {/* Guarantees Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/50">
              <ShieldCheck className="w-6 h-6 text-pure-green shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">Authentic OEM</h4>
                <p className="text-[10px] text-muted-foreground">100% Genuine guarantee</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/50">
              <Truck className="w-6 h-6 text-pure-green shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">Fast Dispatch</h4>
                <p className="text-[10px] text-muted-foreground">Pick-up or Delivery</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/50">
              <BadgeCheck className="w-6 h-6 text-pure-green shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">Quality Tested</h4>
                <p className="text-[10px] text-muted-foreground">Heavy duty inspected</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-16 border-t border-border/50 space-y-8">
          <h2 className="text-2xl font-bold">Related Spare Parts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
