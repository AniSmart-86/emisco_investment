'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Product, Category } from '@/lib/types';
import { CategoryCard } from '@/components/CategoryCard';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Zap, PenTool, ShoppingCart } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        setProducts(prodRes.data.slice(0, 8));
        setCategories(catRes.data.slice(0, 6)); // Show top 6 categories
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1591768793355-74d04bb6608f?q=80&w=1920"
            alt="Heavy duty truck parts"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-pure-green/20 text-pure-green text-xs font-bold tracking-widest uppercase mb-6">
              Official Spare Parts Supplier
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Power Your Fleet with{' '}
              <span className="bg-linear-to-r from-purple-400 to-green-500 text-transparent bg-clip-text">
                Emisco
              </span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-8 leading-relaxed max-w-lg">
              Authorized distributor of genuine heavy-duty truck parts. Engines, gearboxes, and components for Mack, Volvo, DAF, and more.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-pure-green hover:bg-pure-green-hover text-white px-8 rounded-xl text-lg font-semibold group">
                  Shop Now
                  <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/categories">
                <Button size="lg" variant="outline" className="px-8 rounded-xl text-lg font-semibold border-border bg-background/50 backdrop-blur-sm">
                  Explore Brands
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-12 right-4 hidden lg:flex items-center gap-6 animate-in slide-in-from-right duration-1000">
          {[
            { label: 'Authorized Brands', value: '15+' },
            { label: 'Parts in Stock', value: '10k+' },
            { label: 'Happy Clients', value: '2k+' },
          ].map((stat, i) => (
            <div key={i} className="bg-card/40 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-2xl">
              <div className="text-3xl font-bold text-pure-green mb-1">{stat.value}</div>
              <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <span className="text-pure-green font-bold text-sm uppercase tracking-widest block mb-2">Inventory</span>
            <h2 className="text-4xl font-bold">Shop by Brand</h2>
          </div>
          <Link href="/categories" className="text-pure-green hover:underline flex items-center gap-1 font-semibold">
            View All Categories <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {isLoading ? (
             Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl" />
             ))
          ) : (
            categories.map((cat, index) => (
              <CategoryCard key={index} name={cat.name} count={cat.count} image={cat.image} />
            ))
          )}
        </div>
      </section>

      {/* Popular Products */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-pure-green font-bold text-sm uppercase tracking-widest block mb-2">Most Wanted</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Popular Parts</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Top-selling genuine components trusted by logistics companies worldwide.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading ? (
             Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[400px] bg-muted animate-pulse rounded-3xl" />
             ))
          ) : (
            products.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))
          )}
        </div>
        <div className="mt-16 text-center">
          <Link href="/products">
            <Button variant="outline" className="px-12 py-6 rounded-xl font-bold border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10">
              Browse Full Catalog
            </Button>
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-dark-green py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pure-green/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">The Emisco Edge</h2>
            <p className="text-emerald-100/60 max-w-xl mx-auto">
              Why leading transport companies choose us for their spare parts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                icon: ShieldCheck, 
                title: '100% Genuine', 
                desc: 'All parts are sourced directly from authorized manufacturers with full warranty support.' 
              },
              { 
                icon: Zap, 
                title: 'Fast Delivery', 
                desc: 'Express logistics for urgent repairs. We understand that downtime costs money.' 
              },
              { 
                icon: PenTool, 
                title: 'Expert Support', 
                desc: 'Our technical team helps you identify the exact part number for your engine profile.' 
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-emerald-900/40 backdrop-blur-sm border border-emerald-800 p-8 rounded-3xl"
              >
                <div className="w-16 h-16 bg-pure-green rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-pure-green/20">
                  <feature.icon className="text-white w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-emerald-100/60 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
          <div className="w-24 h-1 bg-pure-green mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              name: 'John Okafor', 
              role: 'Fleet Manager, GIG Logistics', 
              text: 'Emisco has been our primary supplier for years. Their MAN Diesel engine parts have never failed us.' 
            },
            { 
              name: 'Ahmed Bello', 
              role: 'Owner, Ahmed Motors', 
              text: 'The best thing about Emisco is their delivery speed. Critical parts arrive faster than anyone else.' 
            },
            { 
              name: 'Sandra Ibe', 
              role: 'Procurement Specialist', 
              text: 'Highly professional team. They helped us source a rare Mack transmission kit within days.' 
            },
          ].map((test, i) => (
            <div key={i} className="p-8 border border-border bg-card rounded-2xl shadow-sm italic text-muted-foreground relative">
              <span className="text-7xl absolute top-4 left-4 text-pure-green/10 font-serif">“</span>
              <p className="mb-6 relative z-10">{test.text}</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted" />
                <div>
                  <div className="font-bold text-foreground text-sm">{test.name}</div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-pure-green">{test.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container mx-auto px-4">
        <div className="bg-linear-to-r from-dark-green to-emerald-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Ready to Optimize Your Fleet?</h2>
            <p className="text-emerald-100/70 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Join 2,000+ logistics companies that rely on Emisco for premium truck maintenance.
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-pure-green hover:bg-pure-green-hover text-white px-12 py-8 rounded-2xl text-xl font-bold group shadow-2xl shadow-pure-green/40">
                Start Shopping Today
                <ShoppingCart className="ml-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
