'use client';

import { useCartStore } from '@/lib/store/cartStore';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartClient() {
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();
  const subtotal = getTotal();
  const total = subtotal;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto space-y-6"
        >
          <div className="w-24 h-24 bg-pure-green/10 rounded-full flex items-center justify-center mx-auto text-pure-green">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
          <p className="text-muted-foreground leading-relaxed">
            Looks like you haven&apos;t added any heavy duty spare parts to your cart yet.
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-pure-green hover:bg-pure-green-hover text-white px-8 py-6 rounded-2xl text-base font-bold shadow-xl shadow-pure-green/20">
              Browse Spare Parts <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/products" className="inline-flex items-center text-sm text-pure-green font-bold group mb-2">
              <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
              Continue Shopping
            </Link>
            <h1 className="text-3xl md:text-5xl font-bold">Shopping Cart ({items.length})</h1>
          </div>
          <Button variant="ghost" onClick={clearCart} className="text-muted-foreground hover:text-red-500 text-xs font-bold">
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="p-6 rounded-3xl bg-card border border-border flex flex-col sm:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-background shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="grow text-center sm:text-left space-y-1">
                    <h3 className="font-bold text-lg line-clamp-1">{item.name}</h3>
                    <p className="text-sm font-bold text-pure-green">₦{item.price.toLocaleString()} each</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-border rounded-xl bg-background">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-2 hover:text-pure-green transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:text-pure-green transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Cart Summary */}
          <div className="p-8 rounded-[2.5rem] bg-card border border-border shadow-xl space-y-6">
            <h2 className="text-xl font-bold">Order Summary</h2>

            <div className="space-y-4 text-sm font-semibold border-y border-border py-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="text-amber-500 text-xs italic">Discussed at checkout</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Pay</span>
              <span className="text-2xl text-pure-green">₦{total.toLocaleString()}</span>
            </div>

            <Link href="/checkout" className="block">
              <Button size="lg" className="w-full bg-pure-green hover:bg-pure-green-hover text-white py-7 rounded-2xl text-lg font-bold shadow-xl shadow-pure-green/20">
                Proceed to Checkout <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
