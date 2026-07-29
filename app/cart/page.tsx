import { Metadata } from 'next';
import CartClient from './CartClient';

export const metadata: Metadata = {
  title: 'Shopping Cart | Emisco Investment Limited',
  description: 'View your selected truck spare parts and proceed to secure checkout for pick-up or home delivery.',
};

export default function CartPage() {
  return <CartClient />;
}
