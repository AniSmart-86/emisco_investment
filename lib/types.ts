export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number | null;
  category: string;
  image: string;
  stock: number;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  phone?: string | null;
  address?: string | null;
  createdAt?: string | Date;
}

export interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  deliveryStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  shippingState?: string | null;
  shippingAddress?: string | null;
  transportCompany?: string | null;
  terminalAddress?: string | null;
  deliveryFee?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
  };
  orderItems?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  productName?: string | null;
  productImage?: string | null;
  product?: Product;
}

export interface Category {
  name: string;
  count: number;
  image: string;
}
