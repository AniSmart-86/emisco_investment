'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store/cartStore';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  ShieldCheck,
  CreditCard,
  ChevronLeft,
  AlertCircle,
  MapPin,
  Truck,
  Store,
  Phone,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import { EMISCO_OFFICE_ADDRESS } from '@/lib/logistics-data';


type DeliveryMethod = 'pickup' | 'delivery' | '';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const { items, getTotal, clearCart } = useCartStore();
  const subtotal = getTotal();

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Pre-fill from user profile
  useEffect(() => {
    localStorage.removeItem('paymentInfo');

    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        address: user.address || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!deliveryMethod) {
      toast.error('Please select Pick-up or Delivery before proceeding.');
      return;
    }

    if (deliveryMethod === 'delivery' && !form.address) {
      toast.error('Please enter a delivery address.');
      return;
    }

    if (!form.name || !form.email || !form.phone) {
      toast.error('Please fill in all required contact fields.');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to complete your checkout.');
      router.push('/login?callbackUrl=/checkout');
      return;
    }

    setLoading(true);

    try {
      const orderItems = items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      // For pickup, we use the shop address. For delivery, we use the entered address.
      const shippingAddress = deliveryMethod === 'pickup'
        ? EMISCO_OFFICE_ADDRESS
        : form.address;

      const orderRes = await api.post('/orders', {
        items: orderItems,
        totalAmount: subtotal,
        address: shippingAddress,
        phone: form.phone,
        deliveryMethod,
        // No transport company, no delivery fee from frontend
      });

      const order = orderRes.data.order;

      // Initialize Payment with Paystack
      const paystackRes = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: user.email,
          amount: subtotal * 100,
          orderId: order.id,
        }),
      });

      const paystackData = await paystackRes.json();

      if (!paystackRes.ok) {
        throw new Error('Payment initialization failed');
      }

      clearCart();
      window.location.href = paystackData.data.authorization_url;

    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/cart"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-pure-green mb-8 group"
      >
        <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
        Back to Cart
      </Link>

      <h1 className="text-4xl font-bold mb-12">Complete Your Order</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* ─── LEFT: FORM ───────────────────────────────────────── */}
        <div className="space-y-10">

          {/* STEP 1: Contact Details */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-pure-green/10 rounded-xl flex items-center justify-center">
                <ShieldCheck className="text-pure-green w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Contact Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pure-green/50"
                  placeholder="John Smith"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                  Email Address <span className="text-red-500">*</span>
                </label>
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
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pure-green/50"
                  placeholder="+234..."
                  required
                />
              </div>
            </div>
          </section>

          {/* STEP 2: How would you like to receive your order? */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Truck className="text-blue-500 w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Fulfilment Method</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pick-up Card */}
              <button
                type="button"
                onClick={() => setDeliveryMethod('pickup')}
                className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-200 group ${
                  deliveryMethod === 'pickup'
                    ? 'border-pure-green bg-pure-green/5 shadow-lg shadow-pure-green/10'
                    : 'border-border bg-card hover:border-pure-green/40'
                }`}
              >
                {deliveryMethod === 'pickup' && (
                  <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-pure-green" />
                )}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                  deliveryMethod === 'pickup' ? 'bg-pure-green' : 'bg-muted'
                }`}>
                  <Store className={`w-6 h-6 ${deliveryMethod === 'pickup' ? 'text-white' : 'text-muted-foreground'}`} />
                </div>
                <h3 className="font-bold text-lg mb-1">Store Pick-up</h3>
                <p className="text-sm text-muted-foreground">Collect from our Apapa office</p>
              </button>

              {/* Delivery Card */}
              <button
                type="button"
                onClick={() => setDeliveryMethod('delivery')}
                className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-200 group ${
                  deliveryMethod === 'delivery'
                    ? 'border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/10'
                    : 'border-border bg-card hover:border-blue-500/40'
                }`}
              >
                {deliveryMethod === 'delivery' && (
                  <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-blue-500" />
                )}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                  deliveryMethod === 'delivery' ? 'bg-blue-500' : 'bg-muted'
                }`}>
                  <Truck className={`w-6 h-6 ${deliveryMethod === 'delivery' ? 'text-white' : 'text-muted-foreground'}`} />
                </div>
                <h3 className="font-bold text-lg mb-1">Delivery</h3>
                <p className="text-sm text-muted-foreground">We ship to your location</p>
              </button>
            </div>

            {/* ── Pick-up Info Panel ── */}
            <AnimatePresence>
              {deliveryMethod === 'pickup' && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-5 bg-emerald-500/5 border border-emerald-500/20 rounded-[1.5rem] p-6 space-y-4"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-5 h-5 text-pure-green" />
                    <span className="font-bold text-base">Shop Address</span>
                  </div>
                  <p className="text-sm text-foreground font-semibold leading-relaxed bg-emerald-500/10 px-4 py-3 rounded-xl border border-emerald-500/20">
                    {EMISCO_OFFICE_ADDRESS}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
                      <div className="w-8 h-8 bg-pure-green/10 rounded-lg flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-pure-green" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Working Hours</div>
                        <div className="text-sm font-bold">Mon – Sat, 8am – 5pm</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
                      <div className="w-8 h-8 bg-pure-green/10 rounded-lg flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-pure-green" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Before You Come</div>
                        <div className="text-sm font-bold">Bring your Order ID</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Delivery Address Form ── */}
            <AnimatePresence>
              {deliveryMethod === 'delivery' && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-5 space-y-4"
                >
                  <div>
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                      Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                      placeholder="Enter your full delivery address — Street, City, State…"
                    />
                    {user?.address && form.address === user.address && (
                      <p className="mt-1.5 text-xs text-pure-green font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Auto-filled from your saved profile
                      </p>
                    )}
                  </div>

                  {/* Delivery Price Hint */}
                  <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-amber-700 dark:text-amber-400 mb-0.5">Delivery Price Not Included</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        You will pay for your items now. Our team will <strong>call you</strong> to discuss the delivery price before we ship your order.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* STEP 3: Payment */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <CreditCard className="text-purple-500 w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Payment</h2>
            </div>

            <div className="p-8 border border-border rounded-3xl bg-muted/30">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold">Secure Payment via Paystack</span>
                <div className="flex gap-2">
                  <div className="w-8 h-5 bg-card rounded border border-border" />
                  <div className="w-8 h-5 bg-card rounded border border-border" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic mb-6">
                You will be redirected to Paystack&apos;s secure page to complete your transaction.
              </p>
              <Button
                onClick={handlePlaceOrder}
                disabled={loading || !deliveryMethod}
                className="w-full bg-pure-green hover:bg-pure-green-hover text-white py-8 rounded-2xl text-xl font-bold shadow-2xl shadow-pure-green/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing…' : `Pay ₦${subtotal.toLocaleString()}`}
              </Button>
              {!deliveryMethod && (
                <p className="text-center text-xs text-muted-foreground mt-3">
                  Select Pick-up or Delivery above to enable payment.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* ─── RIGHT: ORDER SUMMARY ─────────────────────────────── */}
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
                    <p className="text-xs text-muted-foreground">{item.quantity} × ₦{item.price.toLocaleString()}</p>
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

              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Fee</span>
                <span className="font-bold">
                  {deliveryMethod === 'pickup'
                    ? <span className="text-pure-green">Free (Pick-up)</span>
                    : deliveryMethod === 'delivery'
                    ? <span className="text-amber-500">To be discussed</span>
                    : <span className="text-muted-foreground">—</span>
                  }
                </span>
              </div>

              <div className="flex justify-between items-end pt-4">
                <span className="text-lg font-bold">Total (items)</span>
                <span className="text-3xl font-bold text-pure-green">₦{subtotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-10 flex items-start gap-4 p-4 bg-muted/50 rounded-2xl text-xs text-muted-foreground border border-border">
              <AlertCircle className="w-5 h-5 text-pure-green shrink-0 mt-0.5" />
              <span>By placing an order, you agree to Emisco&apos;s Terms of Service and Privacy Policy.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
