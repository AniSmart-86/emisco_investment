'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Package, ArrowRight, Truck} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';


interface PaymentInfo {
  amount: number;
  email: string;
  orderId: string;
}

export default function OrderConfirmationPage({reference, orderId, amount, email}:{reference: string, orderId: string, amount: number, email: string}) {
  // 1. Initialize state from localStorage ONLY as a fallback
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(() => {
    // If props are provided, use them immediately
    if (amount && email && orderId) {
        return { amount, email, orderId };
    }
    // Otherwise fallback to localStorage (only runs on mount)
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem("paymentInfo");
        return stored ? JSON.parse(stored) : null;
    }
    return null;
  });
  
  const refNumber = `${reference}`;

  // 2. Synchronize localStorage as a side effect (no setState here)
  useEffect(() => {
    if (amount && email && orderId) {
        localStorage.setItem("paymentInfo", JSON.stringify({ amount, email, orderId }));
    }
  }, [amount, email, orderId]);

  // Determine what data to actually display (prioritize props)
  const displayData = (amount && email && orderId) ? { amount, email, orderId } : paymentInfo;

  if (!displayData) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-muted-foreground animate-pulse italic text-lg">Verifying your order details...</p>
      </div>
    );
  }

  
  return (
    <>
          <div className="container mx-auto px-4 py-24 text-center">
             <Confetti 
       width={window.innerWidth}
       height={window.innerHeight}
       gravity={0.1}
       style={{zIndex: 99}}
       numberOfPieces={700}
       recycle={false} />

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 200 }}
              className="max-w-2xl mx-auto"
              >
          <div className="w-24 h-24 bg-pure-green rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-pure-green/40">
           <CheckCircle2 className="text-white w-12 h-12" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Order Received!</h1>
        <p className="text-muted-foreground text-lg md:text-xl mb-12 italic">
          Thank you for trusting Emisco Investment Limited. Your heavy-duty truck parts are being prepared for dispatch.
        </p>

        <div className="bg-card border border-border/50 rounded-[2.5rem] p-8 md:p-12 mb-12 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pure-green/5 rounded-full blur-3xl" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-8 border-b border-border pb-8">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Order Number</span>
              <span className="text-sm font-bold text-pure-green">{orderId}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Payment Reference Number</span>
              <span className="text-sm font-bold text-pure-green">{refNumber}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Estimated Delivery</span>
              <span className="text-xl font-bold italic">2-4 Business Days</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Amount</span>
              <span className="text-xl font-bold italic">{amount}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Email</span>
              <span className="text-xl font-bold italic">{email}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl border border-border">
                <Truck className="w-6 h-6 text-pure-green" />
                <div className="text-left">
                   <h4 className="font-bold text-sm">Real-time Tracking Available</h4>
                   <p className="text-xs text-muted-foreground">You will receive an email with tracking details once shipped.</p>
                </div>
             </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link href={`/orders/${orderId}`}>
            <Button size="lg" variant="outline" className="px-10 py-8 rounded-2xl font-bold text-lg border-border">
              <Package className="mr-2 w-5 h-5" /> View Order details
            </Button>
          </Link>
          <Link href="/products">
            <Button size="lg" className="px-10 py-8 rounded-2xl font-bold text-lg bg-pure-green hover:bg-pure-green-hover text-white group">
              Continue Shopping
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        
      </motion.div>
    </div>
      
        
    </>
  );
}


