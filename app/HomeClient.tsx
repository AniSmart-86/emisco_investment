'use client';

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';
import { Product, Category } from '@/lib/types';
import { CategoryCard } from '@/components/CategoryCard';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import {
  ChevronRight, ShieldCheck, Zap, PenTool, Phone, MessageSquare,
  MapPin, Clock, Star, Package, Truck, CheckCircle2, ArrowRight,
  Wrench, Building2, Award, Users, ShoppingCart
} from 'lucide-react';

// Animated counter hook
function useCounter(target: number, inView: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 20);
    return () => clearInterval(timer);
  }, [inView, target]);
  return count;
}

const brands = ['Mack', 'Volvo', 'DAF', 'Mercedes', 'MAN', 'Scania', 'Hino', 'Isuzu'];



const testimonials = [
  { name: 'Chukwuemeka A.', role: 'Fleet Manager, Abuja', stars: 5, text: 'Emisco saved us weeks of downtime. Got a genuine Mack engine head delivered in 2 days. Absolutely professional.' },
  { name: 'Tunde B.', role: 'Transport Company Owner', stars: 5, text: 'I have been buying parts here for 3 years. 100% authentic every time. No fake parts, no stress.' },
  { name: 'Ifeanyi O.', role: 'Truck Mechanic, Lagos', stars: 5, text: 'The customer support team knows their parts. They helped me find the exact DAF gearbox I was searching for.' },
];

const faqs = [
  { q: 'Are all your parts 100% genuine?', a: 'Yes. Every part we stock is sourced directly from verified OEM manufacturers and authorized distributors. We do not sell counterfeit or substandard components.' },
  { q: 'Do you deliver outside Lagos?', a: 'Yes. We ship nationwide across Nigeria. Our logistics team will contact you to arrange delivery pricing before dispatch.' },
  { q: 'Can I pick up my order?', a: 'Absolutely. You can collect from our Lagos office Monday to Saturday, 8 AM to 5 PM. Just bring your Order ID.' },
  { q: 'What truck brands do you carry parts for?', a: 'We stock parts for Mack, Volvo, DAF, Mercedes-Benz, MAN, Scania, Hino, Isuzu and many more heavy-duty brands.' },
  { q: 'How do I track my order?', a: 'After purchase, you can log in to your account and view real-time order status updates from our dashboard.' },
];

export default function HomeClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true });

  const c1 = useCounter(5000, statsInView);
  const c2 = useCounter(12, statsInView);
  const c3 = useCounter(98, statsInView);
  const c4 = useCounter(500, statsInView);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories'),
        ]);
        setProducts(prodRes.data.slice(0, 8));
        setCategories(catRes.data.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80"
            alt="Heavy Duty Truck Parts Warehouse"
            fill
            className="object-cover brightness-[0.25]"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent" />
        </div>

        {/* Floating decorators */}
        <div className="absolute top-1/4 right-10 w-72 h-72 bg-pure-green/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl space-y-8"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pure-green/10 text-pure-green text-xs font-bold uppercase tracking-widest border border-pure-green/20"
            >
              <span className="w-2 h-2 rounded-full bg-pure-green animate-pulse" />
              Nigeria&apos;s #1 Heavy Duty Truck Parts Distributor
            </motion.span>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.05]">
              Keep Your Fleet{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-pure-green to-emerald-400">
                Moving
              </span>
              <br />
              <span className="text-4xl md:text-5xl font-bold text-white/70">
                with Genuine OEM Parts
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-xl">
              Authorized distributor of 100% genuine heavy-duty components for Mack, Volvo, DAF, Mercedes and more. Same-day pick-up available in Lagos.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/products">
                <Button size="lg" className="bg-pure-green hover:bg-pure-green-hover text-white px-8 py-7 rounded-2xl text-base font-bold shadow-2xl shadow-pure-green/30 group">
                  Shop Spare Parts
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-7 rounded-2xl text-base font-bold backdrop-blur-sm">
                  <Phone className="mr-2 w-5 h-5" /> Talk to an Expert
                </Button>
              </Link>
            </div>

            {/* Quick trust badges */}
            <div className="flex flex-wrap gap-6 pt-4">
              {['100% Genuine Parts', 'Nationwide Delivery', 'Expert Support'].map((badge) => (
                <div key={badge} className="flex items-center gap-2 text-white/60 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-pure-green" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          BRAND MARQUEE
      ══════════════════════════════════════════════ */}
      <div className="bg-card border-y border-border/50 py-5 overflow-hidden">
        <div className="flex items-center gap-3 mb-1.5 justify-center">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Genuine Parts For</span>
        </div>
        <div className="relative flex overflow-hidden">
          <motion.div
            className="flex gap-12 items-center whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          >
            {[...brands, ...brands].map((brand, i) => (
              <span key={i} className="text-xl font-black text-foreground/20 uppercase tracking-widest hover:text-pure-green/60 transition-colors cursor-default px-2">
                {brand}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          STATS COUNTER SECTION
      ══════════════════════════════════════════════ */}
      <section ref={statsRef} className="py-20 bg-dark-green relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-pure-green/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: c1, suffix: '+', label: 'Parts In Stock', icon: Package },
              { value: c2, suffix: '+', label: 'Years Experience', icon: Award },
              { value: c3, suffix: '%', label: 'Customer Satisfaction', icon: Star },
              { value: c4, suffix: '+', label: 'Happy Clients', icon: Users },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-pure-green/10 flex items-center justify-center text-pure-green mx-auto mb-3">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-4xl md:text-5xl font-black text-white">
                  {stat.value.toLocaleString()}<span className="text-pure-green">{stat.suffix}</span>
                </div>
                <div className="text-sm font-semibold text-white/50 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CATEGORIES GRID
      ══════════════════════════════════════════════ */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-pure-green font-bold text-xs uppercase tracking-[0.3em] mb-2 block">Browse By Type</span>
            <h2 className="text-3xl md:text-5xl font-bold">Explore Categories</h2>
            <p className="text-muted-foreground mt-2">Genuine parts organized for your convenience</p>
          </div>
          <Link href="/categories" className="hidden md:flex text-pure-green font-bold items-center hover:underline gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-card/50 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id || index}
                name={category.name}
                count={category.count}
                image={category.image}
              />
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link href="/categories">
            <Button variant="outline" className="rounded-2xl border-pure-green/30 text-pure-green">
              View All Categories <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════════════════ */}
      <section className="py-20 bg-card/50 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-pure-green font-bold text-xs uppercase tracking-[0.3em] mb-2 block">Ready to Ship</span>
              <h2 className="text-3xl md:text-5xl font-bold">Featured Products</h2>
              <p className="text-muted-foreground mt-2">Top-stocked genuine spare parts available now</p>
            </div>
            <Link href="/products" className="hidden md:flex text-pure-green font-bold items-center hover:underline gap-1">
              All Products <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-96 bg-card/50 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link href="/products">
              <Button className="bg-pure-green hover:bg-pure-green-hover text-white px-10 py-6 rounded-2xl font-bold shadow-lg shadow-pure-green/20 text-base">
                Browse Full Catalog <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════ */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-pure-green font-bold text-xs uppercase tracking-[0.3em] mb-2 block">Simple Process</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground">Get your parts in 3 easy steps — order online and we handle the rest.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-linear-to-r from-pure-green/30 via-pure-green to-pure-green/30" />

          {[
            { num: '01', title: 'Browse Our Catalog', desc: 'Search by brand, category, or part name across hundreds of genuine OEM components.', icon: Package },
            { num: '02', title: 'Add to Cart & Checkout', desc: 'Select your parts, choose pick-up or delivery, and pay securely with Paystack.', icon: Wrench },
            { num: '03', title: 'Pick Up or Get Delivery', desc: 'Collect from our Lagos office Mon–Sat or we ship to your location nationwide.', icon: Truck },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center p-8 rounded-3xl bg-card border border-border hover:border-pure-green/30 transition-colors group"
            >
              <div className="w-16 h-16 rounded-2xl bg-pure-green/10 flex items-center justify-center text-pure-green mb-6 group-hover:bg-pure-green group-hover:text-white transition-all duration-300">
                <step.icon className="w-8 h-8" />
              </div>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-pure-green text-white text-xs font-black px-3 py-1 rounded-full">
                STEP {step.num}
              </span>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          WHY CHOOSE US
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-dark-green relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pure-green/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-pure-green font-bold text-xs uppercase tracking-[0.3em] block">Our Advantage</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white">Why Industry Leaders Choose Emisco</h2>
              <p className="text-white/50 text-lg leading-relaxed">
                We&apos;ve built our reputation on trust, authenticity, and speed. When your fleet is down, every hour counts.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  { icon: ShieldCheck, title: '100% Genuine Parts', desc: 'Direct from verified OEM manufacturers with full authenticity.' },
                  { icon: Zap, title: 'Fast Fulfilment', desc: 'Same-day pick-up or rapid delivery across Nigeria.' },
                  { icon: PenTool, title: 'Technical Expertise', desc: 'Our specialists assist with part number identification.' },
                  { icon: Building2, title: 'Trusted Distributor', desc: 'Over a decade of serving Nigeria\'s transport industry.' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-pure-green/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-pure-green/10 flex items-center justify-center text-pure-green shrink-0">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm mb-1">{item.title}</h4>
                      <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link href="/about">
                <Button variant="outline" className="border-pure-green/30 text-pure-green hover:bg-pure-green/10 rounded-2xl mt-4">
                  Learn More About Us <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Right side: image collage */}
            <div className="relative h-125 hidden lg:block">
              <div className="absolute top-0 right-0 w-72 h-72 rounded-3xl overflow-hidden border-2 border-pure-green/20 shadow-2xl">
                <Image src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80" alt="Truck engine parts" fill className="object-cover brightness-75" />
              </div>
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-3xl overflow-hidden border-2 border-pure-green/20 shadow-2xl">
                <Image src="https://images.unsplash.com/photo-1546961342-ea5f62d5a27f?auto=format&fit=crop&q=80" alt="Spare parts warehouse" fill className="object-cover brightness-75" />
              </div>
              <div className="absolute top-1/2 left-1/3 -translate-y-1/2 bg-dark-green border border-pure-green/30 rounded-3xl p-6 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-pure-green animate-pulse" />
                  <span className="text-xs font-bold text-pure-green uppercase tracking-wider">Always In Stock</span>
                </div>
                <div className="text-3xl font-black text-white">5,000+</div>
                <div className="text-xs text-white/40 mt-1">OEM Parts Ready to Ship</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════ */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-pure-green font-bold text-xs uppercase tracking-[0.3em] mb-2 block">Customer Reviews</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-muted-foreground">Trusted by fleet managers, mechanics, and transport companies across Nigeria.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-card border border-border hover:border-pure-green/20 transition-colors space-y-4"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(t.stars)].map((_, s) => (
                  <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-pure-green/10 flex items-center justify-center text-pure-green font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FAQ SECTION
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-card/50 border-y border-border/50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <span className="text-pure-green font-bold text-xs uppercase tracking-[0.3em] mb-2 block">Common Questions</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know before ordering.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl border border-border overflow-hidden bg-card"
              >
                <button
                  className="w-full flex items-center justify-between p-6 text-left gap-4 hover:bg-muted/30 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-bold text-sm md:text-base">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-6 h-6 rounded-full border border-pure-green/30 flex items-center justify-center text-pure-green shrink-0"
                  >
                    +
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CONTACT CTA STRIP
      ══════════════════════════════════════════════ */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[3rem] bg-dark-green border border-pure-green/20 p-10 md:p-16 overflow-hidden text-center"
        >
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-pure-green/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-black text-white">
              Can&apos;t Find the Part You Need?
            </h2>
            <p className="text-white/50 text-lg">
              Our team can source any heavy-duty truck component. Just tell us what you need and we&apos;ll handle the rest.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-pure-green hover:bg-pure-green-hover text-white px-8 py-6 rounded-2xl text-base font-bold shadow-2xl shadow-pure-green/30 group">
                  <MessageSquare className="mr-2 w-5 h-5" />
                  Send an Inquiry
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 rounded-2xl text-base font-bold">
                  Browse Full Catalog
                </Button>
              </Link>
            </div>

            {/* Quick office info */}
            <div className="flex flex-wrap justify-center gap-8 pt-4 text-white/40 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-pure-green" />
                Lagos, Nigeria
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-pure-green" />
                Mon – Sat, 8 AM – 5 PM
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-pure-green" />
                Call for bulk orders
              </div>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
