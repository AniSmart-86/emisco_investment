'use client';

import { useCartStore } from '@/lib/store/cartStore';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotal, getDeliveryFee } = useCartStore();
  const subtotal = getTotal();
  const deliveryFee = getDeliveryFee();
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <div className="w-24 h-24 bg-pure-green/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="w-12 h-12 text-pure-green" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-12 italic">
            Looks like you haven&apos;t added any spare parts to your truck yet.
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-pure-green hover:bg-pure-green-hover text-white px-12 rounded-2xl group">
              Start Shopping
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-bold">Shopping Cart</h1>
        <Button variant="ghost" className="text-muted-foreground hover:text-red-500" onClick={clearCart}>
          <Trash2 className="w-4 h-4 mr-2" /> Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-card/40 backdrop-blur-sm border border-border/50 rounded-3xl"
              >
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                
                <div className="grow">
                  <div className="text-[10px] font-bold text-pure-green uppercase tracking-widest mb-1">{item.category}</div>
                  <h3 className="text-lg font-bold mb-2">{item.name}</h3>
                  <div className="text-2xl font-bold text-foreground mb-4">
                    ₦{item.price.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-8">
                   <div className="flex items-center gap-1 bg-background border border-border p-1 rounded-2xl">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-xl"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-xl text-pure-green"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          <Link href="/products" className="inline-flex items-center text-sm text-pure-green font-bold group mt-4">
            <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
            Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-dark-green text-white p-8 rounded-[2.5rem] sticky top-32 shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-pure-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <h2 className="text-2xl font-bold mb-8 relative z-10">Order Summary</h2>
            
            <div className="space-y-4 mb-8 border-b border-emerald-800 pb-8 relative z-10">
              <div className="flex justify-between text-emerald-100/70">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-100/70">
                <span>Delivery Fee</span>
                <span className="text-pure-green font-bold">₦{deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-100/70">
                <span>Tax</span>
                <span>₦0.00</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-12 relative z-10">
               <div>
                 <div className="text-xs uppercase tracking-[0.2em] text-emerald-100/40 font-bold mb-1">Total Amount</div>
                 <div className="text-4xl font-bold">₦{total.toLocaleString()}</div>
               </div>
            </div>

            <Link href="/checkout">
              <Button size="lg" className="w-full bg-pure-green hover:bg-pure-green-hover text-white py-8 rounded-2xl text-xl font-bold group relative z-10">
                Check Out
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
