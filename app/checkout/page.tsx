'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store/cartStore';
import { Button } from '@/components/ui/button';
import Image from 'next/image'
import { ShieldCheck, Truck, CreditCard, ChevronLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';


export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, getTotal, getDeliveryFee, clearCart } = useCartStore();
  const subtotal = getTotal();
  const deliveryFee = getDeliveryFee();




  useEffect(()=>{
localStorage.removeItem("paymentInfo");
  },[]);
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
  });
  
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Delivery Suggestion Logic
  const showDeliverySuggestion = form.state.toLowerCase() !== 'lagos' && form.state !== '';
  const transportCompanies = ['Okeyson Motors', 'GIG Logistics', 'Ifesinachi Motors'];



     const finalTotal =   showDeliverySuggestion ? subtotal + deliveryFee : subtotal;

  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handlePlaceOrder = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!form.name || !form.email || !form.address) {
    toast.error('Please fill in all required fields');
    return;
  }

  if (!user) {
    toast.error('You must be logged in');
    router.push('/login');
    return;
  }

  setLoading(true);

  try {

    const orderItems = items.map(item => ({
      productId: item.id,
      quantity: item.quantity,
    price: item.price,
    }));

    const orderRes = await api.post('/orders', {
      items: orderItems,
      totalAmount: finalTotal,
    });

    const order = orderRes.data.order;
    
    // ✅ 2. INITIALIZE PAYMENT WITH ORDER ID
    const paystackRes = await fetch('/api/payments/initialize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        amount: finalTotal * 100,
        orderId: order.id, 
      }),
    });

    const paystackData = await paystackRes.json();

    if (!paystackRes.ok) {
      throw new Error('Payment initialization failed');
    }

    // ✅ 3. SAVE FOR CLIENT CHECK (OPTIONAL)
    localStorage.setItem('paymentInfo', JSON.stringify({
      amount: finalTotal,
      email: user.email,
      orderId: order.id,
    }));


    clearCart();
   
    window.location.href = paystackData.data.authorization_url;

  } catch (error) {
    console.error(error);
    toast.error('Something went wrong');
  } finally {
    setLoading(false);
  }
};



  if (items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/cart" className="inline-flex items-center text-sm text-muted-foreground hover:text-pure-green mb-8 group">
        <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
        Back to Cart
      </Link>

      <h1 className="text-4xl font-bold mb-12">Complete Your Order</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Form Section */}
        <div className="space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-pure-green/10 rounded-xl flex items-center justify-center">
                <ShieldCheck className="text-pure-green w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Shipping Details</h2>
            </div>
            
            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pure-green/50"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Email Address</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleInputChange}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pure-green/50"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Phone Number</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pure-green/50"
                  placeholder="+234..."
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Residential Address</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleInputChange}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pure-green/50"
                  placeholder="Street, Building, etc."
                  required
                />
              </div>
              <div>
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2 block">State</label>
                <input
                  name="state"
                  value={form.state}
                  onChange={handleInputChange}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pure-green/50"
                  placeholder="Lagos, Abuja, etc."
                  required
                />
              </div>
              <div>
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2 block">City</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleInputChange}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pure-green/50"
                  placeholder="Ikeja, Garki, etc."
                  required
                />
              </div>
            </form>
          </section>

          {/* Delivery Suggestion */}
          <AnimatePresence>
            {showDeliverySuggestion && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-pure-green/5 border border-pure-green/20 rounded-[2rem] p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-pure-green rounded-xl flex items-center justify-center">
                    <Truck className="text-white w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold">Logistics Suggestion</h2>
                </div>
                <p className="text-muted-foreground mb-6">
                  Since you are outside Lagos, we recommend shipping via our trusted transport partners for safer and faster delivery of heavy-duty parts.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {transportCompanies.map((company) => (
                    <button
                      key={company}
                      onClick={() => setDeliveryMethod(company)}
                      className={`p-4 rounded-2xl border transition-all text-sm font-bold ${
                        deliveryMethod === company
                          ? 'bg-pure-green border-pure-green text-white shadow-lg shadow-pure-green/20'
                          : 'bg-card border-border hover:border-pure-green/50'
                      }`}
                    >
                      {company}
                    </button>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <CreditCard className="text-purple-500 w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Payment Method</h2>
            </div>
            
            <div className="p-8 border border-border rounded-3xl bg-muted/30">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold">Secure Payment via Paystack</span>
                <div className="flex gap-2">
                   <div className="w-8 h-5 bg-card rounded" />
                   <div className="w-8 h-5 bg-card rounded" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic mb-6">
                You will be redirected to Paystack secure checkout to complete your transaction.
              </p>
              <Button 
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-pure-green hover:bg-pure-green-hover text-white py-8 rounded-2xl text-xl font-bold shadow-2xl shadow-pure-green/20"
              >
                {loading ? 'Processing...' : `Pay ₦${finalTotal.toLocaleString()}`}
              </Button>
            </div>
          </section>
        </div>

        {/* Order Summary Slider */}
        <div className="lg:sticky lg:top-32 h-fit">
           <div className="bg-card border border-border/50 rounded-[3rem] p-8 shadow-xl">
             <h2 className="text-2xl font-bold mb-8">Order Summary</h2>
             <div className="space-y-6 mb-8 max-h-80 overflow-y-auto pr-2 scrollbar-hide">
               {items.map((item) => (
                 <div key={item.id} className="flex gap-4">
                   <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                     <Image src={item.image} alt={item.name} fill className="object-cover" />
                   </div>
                   <div className="grow">
                     <h4 className="text-sm font-bold line-clamp-1">{item.name}</h4>
                     <p className="text-xs text-muted-foreground">{item.quantity} x ₦{item.price.toLocaleString()}</p>
                   </div>
                   <div className="font-bold text-sm">₦{(item.price * item.quantity).toLocaleString()}</div>
                 </div>
               ))}
             </div>
             
             <div className="space-y-4 pt-8 border-t border-border">
               <div className="flex justify-between text-muted-foreground">
                 <span>Subtotal</span>
                 <span className="text-foreground font-bold">₦{subtotal.toLocaleString()}</span>
               </div>
               {showDeliverySuggestion ? (
                <div className="flex justify-between text-muted-foreground">
                 <span>Delivery Fee</span>
                 <span className="text-pure-green font-bold">₦{deliveryFee.toLocaleString()}</span>
               </div>
               ): (
                <div className="flex justify-between text-muted-foreground">
                 <span>Delivery Fee</span>
                 <span className="text-pure-green font-bold">Free</span>
               </div>
               )}
               <div className="flex justify-between items-end pt-4">
                 <span className="text-lg font-bold">Grand Total</span>
                 <span className="text-3xl font-bold text-pure-green">₦{finalTotal.toLocaleString()}</span>
               </div>
             </div>
             
             <div className="mt-12 flex items-center gap-4 p-4 bg-muted/50 rounded-2xl text-xs text-muted-foreground border border-border">
                <AlertCircle className="w-5 h-5 text-pure-green shrink-0" />
                <span>By placing an order, you agree to Emisco&apos;s Terms of Service and Privacy Policy.</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
