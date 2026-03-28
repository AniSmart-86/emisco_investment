export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number | null;
  category: string;
  image: string;
  stock: number;
  createdAt: string | Date;
  updatedAt: string | Date;
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
  createdAt: string | Date;
  updatedAt: string | Date;
  user?: {
    name: string;
    email: string;
  };
  orderItems?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Category {
  name: string;
  count: number;
  image: string;
}
