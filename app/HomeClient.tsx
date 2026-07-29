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

export default function HomeClient() {
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
            src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80"
            alt="Heavy Duty Truck Parts Warehouse"
            fill
            className="object-cover brightness-[0.3]"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/60 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-6"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-pure-green/10 text-pure-green text-xs font-bold uppercase tracking-widest border border-pure-green/20">
              Heavy Duty Truck Parts Specialist
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
              Keep Your Fleet <span className="text-pure-green">Moving</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Premium quality heavy-duty truck components, engine parts, and accessories for Mack, Volvo, DAF, and major brands. 100% genuine parts guaranteed.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/products">
                <Button size="lg" className="bg-pure-green hover:bg-pure-green-hover text-white px-8 py-6 rounded-2xl text-lg font-bold">
                  Browse Catalog <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-border hover:bg-card px-8 py-6 rounded-2xl text-lg font-bold">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Explore Categories</h2>
            <p className="text-muted-foreground">High-performance parts tailored for your vehicle</p>
          </div>
          <Link href="/categories" className="text-pure-green font-bold flex items-center hover:underline">
            View All <ChevronRight className="w-4 h-4 ml-1" />
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
              <CategoryCard key={category.id || index} name={category.name} count={category.count} image={category.image} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Products</h2>
            <p className="text-muted-foreground">Top-rated genuine spare parts available for dispatch</p>
          </div>
          <Link href="/products" className="text-pure-green font-bold flex items-center hover:underline">
            View All Products <ChevronRight className="w-4 h-4 ml-1" />
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
      </section>

      {/* Why Choose Us */}
      <section className="bg-card border-y border-border py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Why Industry Leaders Choose Emisco</h2>
            <p className="text-muted-foreground">We supply reliable, genuine parts to keep commercial fleets operating with minimal downtime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-background border border-border/50 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-pure-green/10 flex items-center justify-center text-pure-green">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">100% Genuine Guaranteed</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                All components sourced directly from verified OEM manufacturers with full authenticity assurance.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-background border border-border/50 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-pure-green/10 flex items-center justify-center text-pure-green">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Fast Nationwide Delivery</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Rapid pick-up at our Lagos office or fast dispatch to your doorstep across Nigeria.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-background border border-border/50 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-pure-green/10 flex items-center justify-center text-pure-green">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Expert Technical Support</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our heavy machinery specialists help you select the exact component part numbers you need.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
