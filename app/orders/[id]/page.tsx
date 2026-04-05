'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import axios from 'axios';
import { useAuthStore } from '@/lib/store/authStore';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  MapPin, 
  Calendar,
  ShieldCheck,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  productName?: string;
  productImage?: string;
  product: {
    name: string;
    image: string;
    category: string;
  };
}

interface Order {
  id: string;
  totalAmount: number;
  paymentStatus: string;
  deliveryStatus: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data.order);
      } catch (err) {
        console.error('Fetch order error:', err);
        const errorMessage = axios.isAxiosError(err) 
          ? err.response?.data?.error 
          : 'Failed to load order details';
        setError(errorMessage || 'Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id, user, router]);

  if (!user) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'SHIPPED': return <Truck className="w-5 h-5 text-blue-500" />;
      case 'PROCESSING': return <Clock className="w-5 h-5 text-amber-500" />;
      default: return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getPaymentStatusStyles = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-emerald-500/10 text-emerald-500';
      case 'FAILED': return 'bg-red-500/10 text-red-500';
      default: return 'bg-amber-500/10 text-amber-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="grow flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-pure-green" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="grow container mx-auto px-4 py-20 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">{error || 'Order not found'}</h1>
          <p className="text-muted-foreground mb-8">We couldn&apos;t retrieve the details for this order. It might have been deleted or you may not have permission to view it.</p>
          <Button onClick={() => router.push('/dashboard')} className="bg-pure-green text-white rounded-xl px-8 font-bold">
            Back to Dashboard
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      
      <main className="grow container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <Link href="/dashboard" className="flex items-center text-sm font-bold text-muted-foreground hover:text-pure-green transition-colors mb-4 group">
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Order Details</h1>
              <p className="text-muted-foreground font-mono mt-1 text-sm uppercase tracking-widest">#{order.id.toUpperCase()}</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${getPaymentStatusStyles(order.paymentStatus)}`}>
                <ShieldCheck className="w-4 h-4" />
                {order.paymentStatus}
              </div>
              <div className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest bg-pure-green/10 text-pure-green flex items-center gap-2`}>
                {getStatusIcon(order.deliveryStatus)}
                {order.deliveryStatus}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Items */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-border/50 bg-card rounded-[2.5rem] overflow-hidden shadow-xl">
                <CardHeader className="border-b border-border/50 bg-muted/30 p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-pure-green rounded-xl flex items-center justify-center text-white shadow-lg shadow-pure-green/20">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">Ordered Items</CardTitle>
                      <p className="text-xs text-muted-foreground font-semibold italic uppercase tracking-widest">{order.orderItems.length} Products Included</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border/50">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="p-8 flex gap-6 group hover:bg-muted/30 transition-colors">
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-muted flex items-center justify-center shadow-md">
                          {(item.productImage || item.product?.image) ? (
                            <Image 
                              src={item.productImage || item.product?.image} 
                              alt={item.productName || item.product?.name || 'Product'} 
                              fill 
                              className="object-cover group-hover:scale-110 transition-transform duration-500" 
                            />
                          ) : (
                            <Package className="w-8 h-8 text-muted-foreground/30" />
                          )}
                        </div>
                        <div className="grow space-y-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-bold text-pure-green uppercase tracking-widest block mb-1">{item.product?.category || 'Category'}</span>
                              <h3 className="font-bold text-lg">{item.productName || item.product?.name || 'Unknown Product'}</h3>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">₦{(item.price * item.quantity).toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground font-semibold italic">₦{item.price.toLocaleString()} each</p>
                            </div>
                          </div>
                          <div className="pt-4 flex items-center gap-4">
                            <span className="px-3 py-1 rounded-full bg-muted text-[10px] font-bold uppercase tracking-wider">Qty: {item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Timeline or Status - Simulating for now */}
              <Card className="border-border/50 bg-card rounded-[2.5rem] p-8 shadow-xl">
                 <h3 className="text-xl font-bold mb-8">Order Journey</h3>
                 <div className="space-y-10 ml-4 border-l-2 border-border pl-10 relative">
                    {[
                      { step: 'Order Placed', date: new Date(order.createdAt).toLocaleDateString(), desc: 'We have received your order.', active: true },
                      { step: 'Processing', date: '---', desc: 'Preparing your items for delivery.', active: order.deliveryStatus !== 'PENDING' },
                      { step: 'In Transit', date: '---', desc: 'Your package is on the way.', active: ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.deliveryStatus) },
                      { step: 'Delivered', date: '---', desc: 'Arrived at your destination.', active: order.deliveryStatus === 'DELIVERED' },
                    ].map((step, i) => (
                      <div key={i} className="relative">
                        <div className={`absolute -left-[3.1rem] top-0 w-8 h-8 rounded-full border-4 border-background flex items-center justify-center ${step.active ? 'bg-pure-green' : 'bg-muted'}`}>
                          {step.active && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div className={step.active ? 'opacity-100' : 'opacity-40'}>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold">{step.step}</h4>
                            <span className="text-[10px] font-mono text-muted-foreground font-bold uppercase">{step.date}</span>
                          </div>
                          <p className="text-xs text-muted-foreground italic">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </Card>
            </div>

            {/* Right Column: Summaries */}
            <div className="space-y-8">
              <Card className="border-border/50 bg-card rounded-[2.5rem] p-8 shadow-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-pure-green" /> Total Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-muted-foreground italic">Subtotal</span>
                    <span>₦{(order.totalAmount - (order.totalAmount > 100000 ? 10000 : 5000)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-muted-foreground italic">Shipping Fee</span>
                    <span>₦{(order.totalAmount > 100000 ? 10000 : 5000).toLocaleString()}</span>
                  </div>
                  <div className="pt-4 border-t border-border/50 flex justify-between items-end">
                    <span className="font-bold">Total Amount</span>
                    <span className="text-3xl font-extrabold text-pure-green">₦{order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
                <Button className="w-full mt-8 bg-dark-green hover:bg-emerald-900 text-white rounded-2xl py-6 font-bold shadow-lg shadow-emerald-500/10">
                  Download Invoice
                </Button>
              </Card>

              <Card className="border-border/50 bg-card rounded-[2.5rem] p-8 shadow-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-pure-green" /> Shipping Details
                </h3>
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Recipient</span>
                    <p className="font-bold">{user.name}</p>
                    <p className="text-sm text-muted-foreground italic">{user.email}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Status</span>
                    <div className="flex items-center gap-2 text-pure-green font-bold">
                      <Truck className="w-4 h-4" />
                      <span className="text-sm">{order.deliveryStatus}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="border-border/50 bg-card rounded-[2.5rem] p-8 shadow-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-pure-green" /> Key Dates
                </h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Placed On</span>
                    <p className="text-sm font-bold">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
