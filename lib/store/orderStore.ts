import { create } from 'zustand';
import { api } from '@/lib/api';

export interface Order {
  id: string;
  totalAmount: number;
  paymentStatus: string;
  deliveryStatus: string;
  createdAt: string;
  orderItems: any[];
}

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  isLoading: false,
  error: null,
  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/orders');
      set({ orders: response.data.orders, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to fetch orders', isLoading: false });
    }
  },
}));
