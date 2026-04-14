'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { useOrderStore } from '@/lib/store/orderStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, User, LogOut, ChevronRight, Loader2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user, token, logout } = useAuthStore();
  const { orders, isLoading, fetchOrders } = useOrderStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      fetchOrders();
    }
  }, [user, router, fetchOrders]);

  // Get the order currently selected for tracking, or the most recent one if none selected
  const selectedOrder = selectedOrderId 
    ? orders.find(o => o.id === selectedOrderId) 
    : orders[0];

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handlePayNow = async (orderId: string, amount: number) => {
    if (!user || !token) return;
    
    setIsPaying(orderId);
    try {
      const res = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: user.email,
          amount: amount * 100, // Paystack expects kobo
          orderId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize payment');
      
      window.location.href = data.data.authorization_url;
    } catch (error) {
      console.error('Pay Now Error:', error);
      toast.error(error instanceof Error ? error.message : 'Could not initialize payment');
    } finally {
      setIsPaying(null);
    }
  };

  const getStatusSteps = (status: string) => {
    const steps = [
      { id: 'PENDING', label: 'Order Placed', done: true },
      { id: 'PROCESSING', label: 'Processing', done: false },
      { id: 'SHIPPED', label: 'Shipped', done: false },
      { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', done: false },
      { id: 'DELIVERED', label: 'Delivered', done: false },
    ];

    const statusOrder = ['PENDING', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIndex = statusOrder.indexOf(status);

    return steps.map((step, index) => ({
      ...step,
      done: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="bg-card border border-border/50 rounded-[2.5rem] p-8 shadow-xl sticky top-32">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-16 h-16 bg-pure-green rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-pure-green/20">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="font-bold text-xl">{user.name}</h2>
                <p className="text-xs text-muted-foreground italic uppercase tracking-widest">{user.role}</p>
              </div>
            </div>

            <nav className="space-y-2">
              {[
                { id: 'orders', label: 'My Orders', icon: Package },
                { id: 'tracking', label: 'Track Shipments', icon: Truck },
                { id: 'profile', label: 'Profile Settings', icon: User },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-semibold ${
                    activeTab === item.id ? 'bg-pure-green text-white shadow-lg shadow-pure-green/20' : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-semibold mt-8"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="grow space-y-8">
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl font-bold">Purchase History</h2>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{orders.length} Total Orders</p>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-pure-green" /></div>
              ) : orders.length === 0 ? (
                <p className="text-muted-foreground text-center py-20 italic">No orders found.</p>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <Card key={order.id} className="border-border/50 bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden group hover:border-pure-green/50 transition-colors">
                      <CardHeader className="flex flex-row items-center justify-between p-6 bg-muted/30">
                        <div className="flex items-center gap-4">
                           <div>
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Order #</span>
                              <CardTitle className="text-lg">{order.id.slice(0, 8).toUpperCase()}...</CardTitle>
                           </div>
                           <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.paymentStatus === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                           }`}>
                              {order.paymentStatus}
                           </div>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                          order.deliveryStatus === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-pure-green/10 text-pure-green'
                        }`}>
                          {order.deliveryStatus}
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
                          <div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Date</span>
                            <span className="text-sm font-semibold">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Items</span>
                            <span className="text-sm font-semibold">{order.orderItems?.length || 0} Parts</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Total</span>
                            <span className="text-sm font-bold">₦{order.totalAmount.toLocaleString()}</span>
                          </div>
                          <div className="col-span-2 md:col-span-2 flex flex-col sm:flex-row md:justify-end items-stretch sm:items-center gap-2 mt-4 md:mt-0">
                             {order.paymentStatus !== 'PAID' && (
                               <Button 
                                 size="sm"
                                 variant="default"
                                 className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[10px] uppercase shadow-lg shadow-emerald-500/20 w-full sm:w-auto"
                                 onClick={() => handlePayNow(order.id, order.totalAmount)}
                                 disabled={isPaying === order.id}
                               >
                                 {isPaying === order.id ? (
                                   <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                 ) : (
                                   <CreditCard className="w-3 h-3 mr-1" />
                                 )}
                                 {isPaying === order.id ? 'Processing...' : 'Pay Now'}
                               </Button>
                             )}
                             <Button 
                                variant="outline" 
                                size="sm"
                                className="rounded-xl font-bold text-[10px] uppercase border-border/50 hover:bg-pure-green hover:text-white transition-all w-full sm:w-auto"
                                onClick={() => {
                                  setSelectedOrderId(order.id);
                                  setActiveTab('tracking');
                                }}
                             >
                                <Truck className="w-3 h-3 mr-1" /> Track
                             </Button>
                             <Link href={`/orders/${order.id}`} className="w-full sm:w-auto">
                               <Button variant="ghost" size="sm" className="w-full text-pure-green font-bold group text-[10px] uppercase">
                                  Details <ChevronRight className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-1" />
                               </Button>
                             </Link>
                          </div>
                        </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        )}

          {activeTab === 'tracking' && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-3xl font-bold mb-8">Shipment Tracking</h2>
                {!selectedOrder ? (
                   <Card className="border-border/50 bg-card/50 backdrop-blur-sm rounded-3xl p-12 text-center">
                      <Truck className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                      <p className="text-muted-foreground italic">Select an order from your history to track progress.</p>
                      <Button onClick={() => setActiveTab('orders')} className="mt-6 bg-pure-green text-white rounded-xl font-bold">Go to Orders</Button>
                   </Card>
                ) : (
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm rounded-3xl p-8">
                  <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
                     <div className="w-12 h-12 bg-pure-green rounded-xl flex items-center justify-center shrink-0">
                        <Truck className="text-white w-6 h-6" />
                     </div>
                     <div className="grow">
                        <div className="flex justify-between items-start">
                           <div>
                              <h3 className="text-xl font-bold mb-1 uppercase tracking-tight">Order #{selectedOrder.id.slice(0, 8)}</h3>
                              <p className="text-muted-foreground text-sm italic">
                                 {selectedOrder.deliveryStatus === 'DELIVERED' ? 'Arrived at destination' : 'Your shipment is in progress'}
                              </p>
                           </div>
                           <div className="text-right">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Status</span>
                              <span className="text-sm font-bold text-pure-green">{selectedOrder.deliveryStatus}</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  {/* Stepper */}
                  <div className="space-y-12 ml-6 border-l-2 border-border pl-10 relative">
                     {getStatusSteps(selectedOrder.deliveryStatus).map((step, i) => (
                       <div key={i} className="relative">
                         <div className={`absolute -left-[3.1rem] top-0 w-8 h-8 rounded-full border-4 border-background flex items-center justify-center transition-colors duration-500 ${
                           step.done ? 'bg-pure-green' : 'bg-muted'
                         }`}>
                           {step.done && <div className={`w-2 h-2 rounded-full bg-white ${step.current ? 'animate-ping' : ''}`} />}
                         </div>
                         <div className={`transition-opacity duration-300 ${step.done ? 'opacity-100' : 'opacity-40'}`}>
                            <h4 className="font-bold">{step.label}</h4>
                            <p className="text-xs mt-1">
                               {step.current ? 'Most recent update' : step.done ? 'Completed' : 'Pending'}
                            </p>
                         </div>
                       </div>
                     ))}
                  </div>
                </Card>
                )}
             </motion.div>
          )}


          {activeTab === 'profile' && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-3xl font-bold mb-8">Profile Settings</h2>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm rounded-3xl p-8 space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
                        <input className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none" defaultValue={user.name} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
                        <input className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none" defaultValue={user.email} disabled />
                      </div>
                   </div>
                   <Button className="bg-pure-green hover:bg-pure-green-hover text-white rounded-xl px-8 py-6 font-bold">
                      Save Changes
                   </Button>
                </Card>
             </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
