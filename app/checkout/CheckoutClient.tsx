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

export default function CheckoutClient() {
  const { items, getTotal, clearCart } = useCartStore();
  const subtotal = getTotal();
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  // Delivery Choice: 'pickup' | 'delivery'
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');

  // Address & Contact Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    nearestBusStop: '',
  });

  // Pre-fill from user profile
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        nearestBusStop: '',
      });
    }
  }, [user]);

  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!deliveryMethod) {
      toast.error('Please select Pick-up or Home Delivery');
      return;
    }

    if (deliveryMethod === 'delivery' && !form.address.trim()) {
      toast.error('Please enter your delivery address');
      return;
    }

    setLoading(true);

    try {
      // Address string to save
      const shippingAddress =
        deliveryMethod === 'pickup'
          ? EMISCO_OFFICE_ADDRESS
          : form.address.trim();

      const orderItems = items.map((i) => ({
        productId: i.id,
        quantity: i.quantity,
      }));

      // 1. Create Order
      const orderRes = await api.post('/orders', {
        items: orderItems,
        totalAmount: subtotal,
        address: shippingAddress,
        phone: form.phone,
        deliveryMethod,
        nearestBusStop: deliveryMethod === 'delivery' ? form.nearestBusStop : undefined,
      });

      const newOrder = orderRes.data.order;

      // 2. Initialize Paystack Payment
      const payRes = await api.post('/payments/initialize', {
        orderId: newOrder.id,
        email: user?.email || form.email,
        amount: subtotal, // Customer pays items only
      });

      const { authorization_url } = payRes.data;

      // Clear cart & Redirect to Paystack checkout
      clearCart();
      window.location.href = authorization_url;
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.error || 'Failed to process order. Try again.'
      );
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">
          Add some truck spare parts to your cart before proceeding to checkout.
        </p>
        <Link href="/products">
          <Button className="bg-pure-green text-white font-bold py-4 px-8 rounded-2xl">
            Browse Parts Catalog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <Link
          href="/cart"
          className="inline-flex items-center text-sm font-bold text-pure-green hover:underline"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Return to Cart
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT FORM */}
          <div className="lg:col-span-2 space-y-8">
            {/* STEP 1: Contact Information */}
            <section className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="w-7 h-7 bg-pure-green/10 text-pure-green rounded-full flex items-center justify-center text-xs">
                  1
                </span>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pure-green/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    placeholder="+234..."
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pure-green/50"
                  />
                </div>
              </div>
            </section>

            {/* STEP 2: Fulfilment Method (Pick-up or Delivery) */}
            <section className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="w-7 h-7 bg-pure-green/10 text-pure-green rounded-full flex items-center justify-center text-xs">
                  2
                </span>
                Fulfilment Option
              </h2>

              {/* Delivery Choice Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pick-up Option */}
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
                    deliveryMethod === 'pickup'
                      ? 'border-pure-green bg-pure-green/5 shadow-lg shadow-pure-green/10'
                      : 'border-border bg-card hover:border-muted-foreground/30'
                  }`}
                >
                  {deliveryMethod === 'pickup' && (
                    <span className="absolute top-4 right-4 w-5 h-5 bg-pure-green text-white rounded-full flex items-center justify-center">
                      ✓
                    </span>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-pure-green/10 rounded-xl text-pure-green">
                      <Store className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">Store Pick-up</h3>
                      <span className="text-xs text-pure-green font-semibold">FREE</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Collect your order directly from our Lagos office. No delivery fee.
                  </p>
                </button>

                {/* Delivery Option */}
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`p-5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
                    deliveryMethod === 'delivery'
                      ? 'border-pure-green bg-pure-green/5 shadow-lg shadow-pure-green/10'
                      : 'border-border bg-card hover:border-muted-foreground/30'
                  }`}
                >
                  {deliveryMethod === 'delivery' && (
                    <span className="absolute top-4 right-4 w-5 h-5 bg-pure-green text-white rounded-full flex items-center justify-center">
                      ✓
                    </span>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">Home / Doorstep Delivery</h3>
                      <span className="text-xs text-amber-500 font-semibold">Discussed via call</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We will ship your parts to your specified location across Nigeria.
                  </p>
                </button>
              </div>

              {/* Conditional Display: Pick-up Info */}
              <AnimatePresence>
                {deliveryMethod === 'pickup' && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="p-5 bg-muted/40 rounded-2xl border border-border space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-pure-green shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Store Office Address</div>
                        <div className="text-sm font-bold text-foreground mt-0.5">{EMISCO_OFFICE_ADDRESS}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
                        <Clock className="w-4 h-4 text-pure-green shrink-0" />
                        <div>
                          <div className="text-[10px] font-bold uppercase text-muted-foreground">Hours</div>
                          <div className="text-xs font-bold">Mon – Sat, 8am – 5pm</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
                        <Phone className="w-4 h-4 text-pure-green shrink-0" />
                        <div>
                          <div className="text-[10px] font-bold uppercase text-muted-foreground">Bring Order ID</div>
                          <div className="text-xs font-bold">Show code at pickup</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Conditional Display: Delivery Form */}
              <AnimatePresence>
                {deliveryMethod === 'delivery' && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-4 pt-2"
                  >
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                        Delivery Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="address"
                        value={form.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pure-green/50 resize-none"
                        placeholder="Enter full address — Street, Building, City, State…"
                      />
                      {user?.address && form.address === user.address && (
                        <p className="mt-1.5 text-xs text-pure-green font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Auto-filled from profile
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                        Nearest Bus Stop / Landmark
                      </label>
                      <input
                        name="nearestBusStop"
                        value={form.nearestBusStop}
                        onChange={handleInputChange}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pure-green/50"
                        placeholder="e.g. Berger Bus Stop, Total Station, Trade Fair…"
                      />
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Pay for your items now. Our logistics team will <strong>call you</strong> to discuss and finalize the delivery price before shipping.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* STEP 3: Payment */}
            <section className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="w-7 h-7 bg-pure-green/10 text-pure-green rounded-full flex items-center justify-center text-xs">
                  3
                </span>
                Payment
              </h2>

              <p className="text-sm text-muted-foreground">
                You will be redirected to Paystack&apos;s encrypted portal to complete your payment securely.
              </p>

              <Button
                onClick={handlePlaceOrder}
                disabled={loading || !deliveryMethod}
                className="w-full bg-pure-green hover:bg-pure-green-hover text-white py-7 rounded-2xl text-xl font-bold shadow-xl shadow-pure-green/20"
              >
                {loading ? 'Processing…' : `Pay ₦${subtotal.toLocaleString()}`}
              </Button>
            </section>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-xl h-fit space-y-6">
            <h2 className="text-2xl font-bold">Order Summary</h2>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-background">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="grow">
                    <h4 className="text-xs font-bold line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-xs font-bold">₦{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2 text-sm font-semibold">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fulfilment</span>
                <span className="text-pure-green font-bold uppercase text-xs">
                  {deliveryMethod === 'pickup' ? 'Pick-up (Free)' : 'Delivery'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border text-base font-bold">
                <span>Total Due</span>
                <span className="text-xl text-pure-green">₦{subtotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
