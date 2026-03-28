'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  image: string;
  count: number;
}

export function CategoryCard({ name, image, count }: CategoryCardProps) {
  return (
    <Link href={`/categories/${name}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative group h-64 overflow-hidden rounded-2xl bg-dark-green"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-60"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <span className="text-[10px] font-bold text-pure-green uppercase tracking-[0.2em] mb-1 block">
            Brand Category
          </span>
          <h3 className="text-2xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform">
            {name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-emerald-100/60">{count} Products</span>
            <div className="w-8 h-8 rounded-full bg-pure-green flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
              <ChevronRight className="text-white w-4 h-4" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
