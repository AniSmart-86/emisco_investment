'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  Grid,
  List as ListIcon,
  X,
  Loader2,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { Product, Category } from '@/lib/types';

export default function ProductsPage({
  initialCategory,
  initialSearch,
}: {
  initialCategory?: string;
  initialSearch?: string;
}) {
  const [search, setSearch] = useState(initialSearch || '');
  const [activeCategory, setActiveCategory] = useState(
    initialCategory || 'All'
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch categories
  useEffect(() => {
    api
      .get('/categories')
      .then((res) => setCategories(res.data))
      .catch(console.error);
  }, []);

  const categoryNames = useMemo(
    () => ['All', ...categories.map((c) => c.name)],
    [categories]
  );

  // Sync initial category and search from URL
  useEffect(() => {
    if (initialCategory) {
      const matched = categoryNames.find(
        (c) => c.toLowerCase() === initialCategory.toLowerCase()
      );
      if (matched) setActiveCategory(matched);
    }
    if (initialSearch) {
      setSearch(initialSearch);
    }
  }, [initialCategory, initialSearch, categoryNames]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(
          `/products?category=${
            activeCategory === 'All' ? '' : activeCategory
          }&search=${search}`
        );
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [search, activeCategory]);

  const filteredProducts = products;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 space-y-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <div className="flex flex-col gap-2">
              {categoryNames.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-left px-4 py-2 rounded-xl transition-colors ${
                    activeCategory === cat
                      ? 'bg-pure-green text-white'
                      : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="grow space-y-8">

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center sm:bg-card/50 p-4 rounded-2xl border border-border/50">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                className="md:hidden grow flex items-center gap-2"
                onClick={() => setIsSidebarOpen(true)}
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </Button>

              <div className="hidden sm:flex items-center gap-1 border rounded-xl p-1">
                <Button size="icon">
                  <Grid className="w-4 h-4" />
                </Button>
                <Button size="icon">
                  <ListIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          <p className="text-sm text-muted-foreground">
            Showing <b>{filteredProducts.length}</b> products
          </p>

          {/* Products */}
          <AnimatePresence>
            {isLoading ? (
              <div className="flex items-center gap-2">
                Processing...
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ) : filteredProducts.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            ) : (
              <div className="py-20 text-center">
                <h3 className="text-xl font-bold">No products found</h3>
                <Button
                  onClick={() => {
                    setSearch('');
                    setActiveCategory('All');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}