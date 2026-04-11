'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  PlusCircle,
  LogOut,
  Menu,
  X,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Truck,
  Image as ImageIcon,
  Upload,
  MoreVertical
} from 'lucide-react';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { toast } from 'sonner';
import { Product, Order, DashboardData, User } from '@/lib/types';
import axios from 'axios';
import { api } from '@/lib/api';
import { DeliveryStatus } from '@/lib/generated/prisma/enums';
import AnalyticsView from '@/components/admin/AnalyticsView';
import { Edit, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // States for backend data
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', oldPrice: '', stock: '', category: '', description: '', image: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeProductMenu, setActiveProductMenu] = useState<string | null>(null);
  const [productMenu, setProductMenu] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      api.get('/admin/dashboard').then(res => setDashboardData(res.data)).catch(console.error);
      api.get('/admin/orders').then(res => setOrders(res.data.orders.slice(0, 5))).catch(console.error);
    } else if (activeTab === 'products') {
      api.get('/products').then(res => {
        setProducts(res.data);
      }).catch(console.error);
    } else if (activeTab === 'add-product') {
      if (!editingProduct) {
        setNewProduct({ name: '', price: '', oldPrice: '', stock: '', category: '', description: '', image: '' });
        setImagePreview(null);
      }
    } else if (activeTab === 'users') {
      api.get('/admin/users').then(res => setUsers(res.data)).catch(console.error);
    } else if (activeTab === 'orders') {
      api.get('/admin/orders').then(res => setOrders(res.data.orders)).catch(console.error);
    }
  }, [activeTab, editingProduct]);
                           
// type DeliveryStatus =
//   | 'PENDING'
//   | 'PROCESSING'
//   | 'SHIPPED'
//   | 'OUT_FOR_DELIVERY'
//   | 'DELIVERED';



  const deleteUser = async (id: string): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
    setUsers(prev => prev.filter(u => u.id !== id));
    toast.success('User deleted');
  };

  const deleteProduct = async (id: string): Promise<void> => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
      setProductMenu(false);
      toast.success('Product deleted');
    } catch (err) {
      console.error('Delete error:', err);
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error || 'Delete failed');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      oldPrice: product.oldPrice?.toString() || '',
      stock: product.stock.toString(),
      category: product.category,
      description: product.description || '',
      image: product.image || ''
    });
    setImagePreview(product.image || null);
    setActiveTab('add-product');
    setProductMenu(false);
    setActiveProductMenu(null);
  };

  const updateOrderStatus = async (id: string, status: DeliveryStatus): Promise<void> => {
    await api.put(`/admin/orders/${id}/status`, { status });

    setOrders(prev =>
      prev.map(o =>
        o.id === id ? { ...o, deliveryStatus: status } : o
      )
    );

    toast.success('Status updated');
  };




  const CLOUD_NAME = "dupdplmls";
  const UPLOAD_PRESET = "emisco_preset";

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // 📷 HANDLE IMAGE SELECTION
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ☁️ UPLOAD TO CLOUDINARY
  const uploadImage = async () => {
    if (!selectedFile) return null;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      toast.error('Image upload failed. Please try again.');
      return null;
    } finally {
      setUploading(false);
    }
  };


  const handleLogout = async () => {
    await logout();
    router.push("/")
  }

  const navItems = [
    { id: 'dashboard', label: `Dashboard`, icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'add-product', label: 'Add Product', icon: PlusCircle },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar Overlay for Mobile */}
      {!isSidebarOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-15 left-5 p-4 z-50 lg:hidden bg-dark-green"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="w-12 h-12" />
        </Button>
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 top-20 z-40 w-72 bg-dark-green text-white transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full p-6">
            <div className="flex items-center justify-between mb-12">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-pure-green rounded-xl flex items-center justify-center">
                  <Truck className="text-white w-6 h-6" />
                </div>
                <span className="font-bold text-xl">ADMIN</span>
              </Link>
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
                <X className="w-8 h-8" />
              </Button>
            </div>

            <nav className="grow space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                    if (item.id === 'add-product') {
                      setEditingProduct(null);
                      setNewProduct({ name: '', price: '', oldPrice: '', stock: '', category: '', description: '', image: '' });
                      setImagePreview(null);
                    }
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-semibold ${activeTab === item.id ? 'bg-pure-green text-white shadow-xl shadow-pure-green/20' : 'hover:bg-emerald-800 text-emerald-100/60'
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="pt-8 border-t border-emerald-800">
              <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-300 hover:bg-red-500/10 transition-all font-semibold">
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className={`grow transition-all duration-300 p-4 lg:ml-72 md:p-12`}>
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex justify-between items-end">
              <div>
                
                <h2 className="md:text-4xl text-2xl font-bold mb-2">
                  {navItems.find(i => i.id === activeTab)?.label}
                </h2>
                <p className="text-muted-foreground italic">Administrative Overview</p>
              </div>
              <div className="hidden sm:block">
                <span className="text-xs font-bold text-pure-green bg-pure-green/10 px-4 py-2 rounded-full uppercase tracking-widest border border-pure-green/20">
                  System Online
                </span>
              </div>
            </div>

            {activeTab === 'dashboard' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Revenue', value: `₦${dashboardData?.totalRevenue?.toLocaleString() || 0}`, icon: BarChart3, color: 'text-emerald-500', trend: 'Live' },
                    { label: 'Total Orders', value: dashboardData?.totalOrders || 0, icon: ShoppingCart, color: 'text-blue-500', trend: 'Live' },
                    { label: 'Active Users', value: dashboardData?.totalUsers || 0, icon: Users, color: 'text-purple-500', trend: 'Live' },
                    { label: 'Total Products', value: dashboardData?.totalProducts || 0, icon: Package, color: 'text-orange-500', trend: 'Live' },
                  ].map((stat, i) => (
                    <Card key={i} className="border-border/50 bg-card rounded-[2rem] overflow-hidden group">
                      <CardContent className="p-8">
                        <div className="flex justify-between items-start mb-6">
                          <div className={`p-4 rounded-2xl bg-muted/50 ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                          </div>
                          <div className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" /> {stat.trend}
                          </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stat.value}</div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Recent Orders */}
                  <Card className="lg:col-span-2 border-border/50 bg-card rounded-[2.5rem] overflow-hidden p-8 shadow-xl">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-md md:text-xl font-bold">Recent Transactions</h3>
                      <Button onClick={() => setActiveTab('orders')} variant="outline" className="rounded-xl font-bold text-xs uppercase tracking-widest h-8">View All</Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                          <TableHead className="font-bold">Order ID</TableHead>
                          <TableHead className="font-bold">Customer</TableHead>
                          <TableHead className="font-bold">Status</TableHead>
                          <TableHead className="font-bold text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id} className="border-border hover:bg-muted/30">
                            <TableCell className="font-mono text-xs">{order.id.slice(0, 6).toUpperCase()}...</TableCell>
                            <TableCell className="font-semibold text-xs">{order.user?.name || 'Unknown'}</TableCell>
                            <TableCell>
                              <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider ${order.deliveryStatus === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-pure-green/10 text-pure-green'
                                }`}>
                                {order.deliveryStatus}
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-bold">₦{order.totalAmount?.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>

                  {/* Analytics Preview */}
                  <Card className="border-border/50 bg-card rounded-[2.5rem] overflow-hidden p-8 shadow-xl">
                    <h3 className="text-xl font-bold mb-8">Quick Analytics</h3>
                    <div className="space-y-8">
                      {[
                        { label: 'Website Traffic', progress: 75, color: 'bg-pure-green' },
                        { label: 'Inventory Turnover', progress: 45, color: 'bg-blue-500' },
                        { label: 'Customer Retention', progress: 92, color: 'bg-purple-500' },
                      ].map((item, i) => (
                        <div key={i} className="space-y-4">
                          <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                            <span>{item.label}</span>
                            <span className="text-muted-foreground">{item.progress}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${item.progress}%` }}
                              className={`h-full ${item.color}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button onClick={() => setActiveTab('analytics')} className="w-full mt-12 bg-dark-green hover:bg-emerald-900 text-white rounded-2xl py-6 font-bold">
                      Full Report <ArrowUpRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Card>
                </div>
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="">
        

                <div className="flex justify-between mb-6 gap-4">
                  <h3 className="text-lg md:text-xl font-bold">Inventory</h3>
                  <Button onClick={() => setActiveTab('add-product')} className="bg-pure-green hover:bg-pure-green-hover text-white rounded-xl font-bold gap-2 px-3 md:px-4">
                    <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Product</span>
                  </Button>
                </div>
                <Card className="lg:col-span-2 border-border/50 bg-card rounded-[2.5rem] overflow-hidden p-2 md:p-8 shadow-xl">
                  <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-pure-green/20">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border">
                          <TableHead className="font-bold min-w-[200px]">Part Name</TableHead>
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
                                  onClick={() => handleEditProduct(prod)}
                                >
                                  <Edit className="w-3 h-3 mr-1" /> Edit
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  className="h-8 rounded-lg font-bold text-[10px] uppercase"
                                  onClick={() => deleteProduct(prod.id)}
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
            )}

            {activeTab === 'add-product' && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="">
                <Card className="border-border/50 bg-card rounded-[2.5rem] p-3 md:p-8 shadow-2xl">
                  <h3 className="text-2xl font-bold mb-8 text-center">
                    {editingProduct ? 'Update Product' : 'Add New Part'}
                  </h3>
                  <form className="space-y-6" onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSubmitting(true);
                    try {
                      let imageUrl = newProduct.image;
                      if (selectedFile) {
                        imageUrl = await uploadImage();
                      }

                      const productData = {
                        ...newProduct,
                        image: imageUrl,
                        price: parseFloat(newProduct.price),
                        oldPrice: newProduct.oldPrice ? parseFloat(newProduct.oldPrice) : null,
                        stock: parseInt(newProduct.stock, 10)
                      };

                      if (editingProduct) {
                        // If stock is set to 0 during update, delete it as per request
                        if (productData.stock <= 0) {
                          if (confirm('Setting stock to 0 will remove this product from inventory. Proceed?')) {
                            await api.delete(`/admin/products/${editingProduct.id}`);
                            toast.success('Product removed due to zero stock');
                          } else {
                            setIsSubmitting(false);
                            return;
                          }
                        } else {
                          await api.put(`/admin/products/${editingProduct.id}`, productData);
                          toast.success('Product updated successfully');
                        }
                      } else {
                        await api.post('/admin/products', productData);
                        toast.success('Product created successfully');
                      }

                      setEditingProduct(null);
                      setNewProduct({ name: '', price: '', oldPrice: '', stock: '', category: '', description: '', image: '' });
                      setSelectedFile(null);
                      setImagePreview(null);
                      setActiveTab('products');
                    } catch (err) {
                      if (axios.isAxiosError(err)) {
                        toast.error(err.response?.data?.error || 'Operation failed');
                      } else {
                        console.error(err);
                        toast.error('An unexpected error occurred.');
                      }
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Product Name</label>
                      <input required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pure-green/50" placeholder="e.g. Scania V8 Radiator" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Current Price (₦)</label>
                        <input required type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pure-green/50" placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Old Price (₦) - Optional</label>
                        <input type="number" step="0.01" value={newProduct.oldPrice} onChange={e => setNewProduct({ ...newProduct, oldPrice: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pure-green/50" placeholder="0.00" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Stock Level</label>
                        <input required type="number" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pure-green/50" placeholder="0" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Category / Brand</label>
                        <select
                          required
                          value={newProduct.category}
                          onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pure-green/50 appearance-none"
                        >
                          <option value="" disabled>Select Brand</option>
                          <option value="Mack">Mack</option>
                          <option value="Volvo">Volvo</option>
                          <option value="MAN Diesel">MAN Diesel</option>
                          <option value="DAF">DAF</option>
                          <option value="Scania">Scania</option>
                          <option value="HOWO">HOWO</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Detailed Description</label>
                      <textarea
                        required
                        rows={4}
                        value={newProduct.description}
                        onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pure-green/50 resize-none"
                        placeholder="Describe technical specifications, compatibility, etc."
                      />
                    </div>

                    {/* Image Upload Block */}
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1 block">Product Image</label>
                      <div className="flex items-center gap-6">
                        <div className="relative w-32 h-32 rounded-2xl bg-muted border-2 border-dashed border-border overflow-hidden flex items-center justify-center group cursor-pointer" onClick={() => document.getElementById('image-upload')?.click()}>
                          {imagePreview ? (
                            <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                          ) : (
                            <div className="text-center">
                              <ImageIcon className="w-8 h-8 text-muted-foreground/30 mx-auto mb-1" />
                              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Preview</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="grow space-y-2">
                          <Button type="button" variant="outline" className="w-full rounded-xl border-border bg-transparent hover:bg-muted font-bold" onClick={() => document.getElementById('image-upload')?.click()}>
                            Select Image File
                          </Button>
                          <p className="text-[10px] text-muted-foreground italic px-1">PNG, JPG or WebP. Max 5MB.</p>
                          <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                        </div>
                      </div>
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full bg-pure-green hover:bg-pure-green-hover text-white py-8 rounded-2xl text-lg font-bold">
                      {isSubmitting || uploading ? (editingProduct ? 'Updating...' : 'Creating...') : (editingProduct ? 'Save Changes' : 'Add to Inventory')}
                    </Button>
                  </form>
                </Card>
              </motion.div>
            )}

            {/* USERS */}
          {activeTab === 'users' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="">
                <Card className="border-border/50 bg-card rounded-[2.5rem] p-2 md:p-8 shadow-2xl">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                          <TableHead className="font-bold">User Information</TableHead>
                          <TableHead className="font-bold">Contact Email</TableHead>
                          <TableHead className="font-bold">Assigned Role</TableHead>
                          <TableHead className="font-bold text-right px-6">Actions</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {users?.map(u=> (
                          <TableRow key={u.id} className="border-border hover:bg-muted/30 whitespace-nowrap">
                            <TableCell className="font-bold py-6 px-4">{u.name}</TableCell>
                            <TableCell className="text-sm italic text-muted-foreground">{u.email}</TableCell>
                            <TableCell>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.role === 'ADMIN' ? 'bg-pure-green/10 text-pure-green border border-pure-green/20' : 'bg-muted text-muted-foreground'}`}>
                                    {u.role}
                                </span>
                            </TableCell>

                            <TableCell className="text-right px-6">
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                className="h-8 rounded-lg font-bold text-[10px] uppercase"
                                onClick={() => deleteUser(u.id)}
                              >
                                <Trash2 className="w-3 h-3 mr-1" /> Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grow">
               <Card className="border-border/50 bg-card rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center mb-8 gap-4">
                   <h3 className="text-lg md:text-2xl font-bold">All Orders</h3>
                   <div className="flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-muted text-[10px] font-bold uppercase tracking-wider">{orders.length} Total</span>
                   </div>
                </div>
                <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="font-bold">Order Details</TableHead>
                      <TableHead className="font-bold">Customer</TableHead>
                      <TableHead className="font-bold">Payment</TableHead>
                      <TableHead className="font-bold">Amount</TableHead>
                      <TableHead className="font-bold text-right">Delivery Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((o) => (
                      <TableRow key={o.id} className="border-border hover:bg-muted/30">
                        <TableCell className="py-6">
                           <div className="text-xs font-mono text-muted-foreground mb-1 uppercase">#{o.id.slice(0, 8)}</div>
                           <div className="text-xs font-semibold">{new Date(o.createdAt).toLocaleDateString()}</div>
                        </TableCell>
                        <TableCell>
                           <div className="font-bold text-sm">{o.user?.name || 'Guest'}</div>
                           <div className="text-[10px] text-muted-foreground italic">{o.user?.email || 'N/A'}</div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            o.paymentStatus === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' : 
                            o.paymentStatus === 'FAILED' ? 'bg-red-500/10 text-red-500' : 
                            'bg-amber-500/10 text-amber-500'
                          }`}>
                            {o.paymentStatus}
                          </span>
                        </TableCell>
                        <TableCell className="font-bold">₦{o.totalAmount?.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <select
                            className="bg-muted/50 border-none rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-pure-green/50 cursor-pointer outline-none transition-all"
                            value={o.deliveryStatus}
                            onChange={(e) =>
                              updateOrderStatus(
                                o.id,
                                e.target.value as DeliveryStatus
                              )
                            }
                          >
                            <option value="PENDING">Pending</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                            <option value="DELIVERED">Delivered</option>
                          </select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </div>
              </Card>
            </motion.div>
          )}

            {activeTab === 'analytics' && (
              <AnalyticsView />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
