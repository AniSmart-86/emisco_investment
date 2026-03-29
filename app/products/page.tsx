'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Grid, List as ListIcon, X, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/input'; 
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { Product, Category } from '@/lib/types';

// Categories fetched from backend

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category');
  
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(urlCategory || 'All');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(console.error);
  }, []);

  const categoryNames = useMemo(() => ['All', ...categories.map(c => c.name)], [categories]);

  useEffect(() => {
    if (urlCategory) {
      const matchedCategory = categoryNames.find(c => c.toLowerCase() === urlCategory.toLowerCase());
      if (matchedCategory) setActiveCategory(matchedCategory);
    }
  }, [urlCategory, categoryNames]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(`/products?category=${activeCategory === 'All' ? '' : activeCategory}&search=${search}`);
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
        {/* Sidebar Filters */}
        <aside className="hidden md:block w-64 shrink-0 space-y-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <div className="flex flex-col gap-2">
              {categoryNames.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-left px-4 py-2 rounded-xl transition-colors ${
                    activeCategory === cat ? 'bg-pure-green text-white' : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="grow space-y-8">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center sm:bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pure-green/50"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                className="md:hidden grow flex items-center gap-2 rounded-xl"
                onClick={() => setIsSidebarOpen(true)}
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </Button>
              <div className="hidden sm:flex items-center gap-1 border border-border rounded-xl p-1 bg-background">
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg bg-pure-green text-white">
                  <Grid className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-muted-foreground">
                  <ListIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing <span className="text-foreground font-bold">{filteredProducts.length}</span> products
            </p>
          </div>

          {/* Product Grid */}

          <AnimatePresence mode="popLayout">
            {isLoading &&(
              <div>
                processing...
                <Loader2 className='w-6 h-6 animate-spin ml-2'/>
              </div>
            )}
            {filteredProducts.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
                <Button
                  variant="link"
                  className="mt-4 text-pure-green"
                  onClick={() => {
                    setSearch('');
                    setActiveCategory('All');
                  }}
                >
                  Clear all filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-60 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-background z-70 p-6 shadow-2xl overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold">Filters</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <div className="space-y-8">
                <div>
                  <h4 className="font-semibold mb-4 text-pure-green">Brands</h4>
                  <div className="flex flex-col gap-2">
                    {categoryNames.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat);
                          setIsSidebarOpen(false);
                        }}
                        className={`text-left px-4 py-3 rounded-xl transition-colors ${
                          activeCategory === cat ? 'bg-pure-green text-white font-bold' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
