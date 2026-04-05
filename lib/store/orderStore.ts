import { create } from 'zustand';
import { api } from '@/lib/api';

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    image: string;
    category: string;
  };
}

export interface Order {
  id: string;
  totalAmount: number;
  paymentStatus: string;
  deliveryStatus: string;
  createdAt: string;
  orderItems: OrderItem[];
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
      // The API returns { orders: [...] }
      set({ orders: response.data.orders || [], isLoading: false });
    } catch (error: unknown) {
      console.error('Fetch orders error:', error);
      let errorMessage = 'Failed to fetch orders';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } };
        errorMessage = axiosError.response?.data?.error || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, isLoading: false });
    }
  },
}));
