'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, User, Search, Truck } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'Categories', path: '/categories' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.items);
  const user = useAuthStore((state) => state.user);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Quick Search Logic
  useEffect(() => {
    if (searchQuery.length > 1) {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await api.get(`/products?search=${searchQuery}`);
          setSearchResults(res.data.slice(0, 5));
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-border py-2'
          : 'bg-transparent border-transparent py-4'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-pure-green rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
            <Truck className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl leading-none">EMISCO</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Investment Ltd</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'text-sm font-medium transition-colors hover:text-pure-green relative py-1',
                pathname === item.path ? 'text-pure-green' : 'text-foreground/70'
              )}
            >
              {item.name}
              {pathname === item.path && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-pure-green"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-2">
          {/* Professional Search Trigger */}
          <div className="relative flex items-center">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 300, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="absolute right-full mr-2 z-50 overflow-hidden"
                >
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search parts, Mack, Volvo..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                      className="w-[300px] bg-muted/50 border border-border/50 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pure-green/50 transition-all font-medium"
                    />
                    
                    {/* Quick Results Dropdown */}
                    <AnimatePresence>
                      {searchQuery.length > 1 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full mt-2 left-0 right-0 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
                        >
                          <div className="p-2">
                             {isSearching ? (
                               <div className="p-4 text-center text-xs text-muted-foreground animate-pulse">Searching components...</div>
                             ) : searchResults.length > 0 ? (
                               <>
                                 <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Quick Results</div>
                                 <div className="flex flex-col">
                                   {searchResults.slice(0, 5).map((prod) => (
                                     <button
                                       key={prod.id}
                                       onClick={() => {
                                         router.push(`/products?search=${prod.name}`);
                                         setIsSearchOpen(false);
                                         setSearchQuery('');
                                       }}
                                       className="flex items-center gap-3 p-2 hover:bg-muted rounded-xl transition-colors text-left"
                                     >
                                       <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                                         <Image 
                                           src={prod.image} 
                                           alt={prod.name} 
                                           fill 
                                           className="object-cover" 
                                         />
                                       </div>
                                       <div className="overflow-hidden">
                                         <div className="text-xs font-bold truncate">{prod.name}</div>
                                         <div className="text-[10px] text-pure-green font-bold uppercase">{prod.category}</div>
                                       </div>
                                     </button>
                                   ))}
                                 </div>
                                 <button 
                                   onClick={() => handleSearch(searchQuery)}
                                   className="w-full p-3 text-center text-xs font-bold text-pure-green hover:bg-pure-green/5 border-t border-border mt-1 transition-colors"
                                 >
                                   See all results for &quot;{searchQuery}&quot;
                                 </button>
                               </>
                             ) : (
                               <div className="p-4 text-center text-xs text-muted-foreground italic">No parts found matching &quot;{searchQuery}&quot;</div>
                             )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("transition-colors", isSearchOpen && "text-pure-green bg-pure-green/10")}
              onClick={() => {
                if (isSearchOpen && searchQuery) {
                  handleSearch(searchQuery);
                } else {
                  setIsSearchOpen(!isSearchOpen);
                }
              }}
            >
              {isSearchOpen && !searchQuery ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </Button>
          </div>
          
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pure-green text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          <Link href={user ? '/dashboard' : '/login'}>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </Link>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav Search */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-muted/50 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch((e.target as HTMLInputElement).value);
                      setIsOpen(false);
                    }
                  }}
                />
              </div>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    'text-lg font-medium p-2 rounded-lg transition-colors',
                    pathname === item.path ? 'bg-pure-green/10 text-pure-green' : 'hover:bg-muted'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="text-lg font-medium p-2 rounded-lg text-red-500"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
