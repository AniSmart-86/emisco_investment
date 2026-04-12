'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useCartStore, CartItem } from '@/lib/store/cartStore';

interface ProductCardProps {
  product: Omit<CartItem, 'quantity'>;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({ ...product, quantity: 1 });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-pure-green/10">
        <div className="relative aspect-square overflow-hidden">
          <Link href={`/products/${product.id}`} className="block relative w-full h-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
              <Button size="icon" variant="secondary" className="rounded-full">
                <Eye className="w-4 h-4" />
              </Button>
            <Button size="icon" className="bg-pure-green hover:bg-pure-green-hover rounded-full" onClick={handleAddToCart}>
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
          </Link>
          {product.oldPrice && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
              SALE
            </div>
          )}
        </div>
        <CardHeader className="p-4 pb-2">
          <div className="text-[10px] font-bold text-pure-green uppercase tracking-wider mb-1">
            {product.category}
          </div>
          <CardTitle className="text-sm line-clamp-1 group-hover:text-pure-green transition-colors">
            {product.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">
              ₦{product.price.toLocaleString()}
            </span>
            {product.oldPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₦{product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
           <Button className="w-full bg-pure-green hover:bg-pure-green-hover text-white rounded-xl gap-2 font-semibold" onClick={handleAddToCart}>
             Add to Cart
           </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
