import { Metadata } from 'next';
import RefundClient from './RefundClient';

export const metadata: Metadata = {
  title: 'Refund & Repayment Policy — Emisco Investment Limited',
  description: 'Understand the return, replacement, and repayment policy for spare parts and machinery purchased at Emisco Investment Limited.',
};

export default function RefundPage() {
  return <RefundClient />;
}
