'use client';

import { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductsViewProps {
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export default function ProductsView({ 
  products, 
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct 
}: ProductsViewProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grow min-w-0 space-y-4">
      <div className="flex justify-between mb-6 gap-4">
        <h3 className="text-lg md:text-xl font-bold">Inventory Management</h3>
        <Button onClick={onAddProduct} className="bg-pure-green hover:bg-pure-green-hover text-white rounded-xl font-bold gap-2 px-3 md:px-4">
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Product</span>
        </Button>
      </div>
      
      <Card className="lg:col-span-2 border-border/50 bg-card rounded-[2.5rem] overflow-hidden p-2 md:p-8 shadow-xl">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-pure-green/20">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="font-bold min-w-[20px] md:min-w-[200px]">Part Name</TableHead>
                <TableHead className="font-bold">Category</TableHead>
                <TableHead className="font-bold">Price</TableHead>
                <TableHead className="font-bold">Stock</TableHead>
                <TableHead className="font-bold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((prod) => (
                <TableRow key={prod.id} className="border-border hover:bg-muted/30 whitespace-nowrap">
                  <TableCell className="font-bold">
                    {prod.name}
                    {!prod.isActive && (
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-tighter">Archived</span>
                    )}
                  </TableCell>
                  <TableCell className="text-[10px] font-bold text-pure-green uppercase tracking-widest">{prod.category}</TableCell>
                  <TableCell className="font-bold">₦{prod.price?.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`font-mono text-sm ${prod.stock < 10 ? 'text-red-500 font-bold' : ''}`}>
                      {prod.stock} Units
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 rounded-lg border-border hover:bg-muted font-bold text-[10px] uppercase"
                        onClick={() => onEditProduct(prod)}
                      >
                        <Edit className="w-3 h-3 mr-1" /> Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="h-8 rounded-lg font-bold text-[10px] uppercase"
                        onClick={() => onDeleteProduct(prod.id)}
                      >
                        <Trash2 className="w-3 h-3 mr-1" /> Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    
     </motion.div>
  );
}
