import { Metadata } from 'next';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
  title: 'Terms & Conditions — Emisco Investment Limited',
  description: 'Read the terms and conditions for purchasing heavy duty truck spare parts and heavy machinery at Emisco Investment Limited.',
};

export default function TermsPage() {
  return <TermsClient />;
}
