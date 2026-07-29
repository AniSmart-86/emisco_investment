import { Metadata } from 'next';
import ProductsPage from './productPage';

export const metadata: Metadata = {
  title: 'Heavy Duty Truck & Motor Parts Catalog',
  description: 'Browse our complete catalog of genuine OEM truck parts, engine filters, gearboxes, brake systems, and heavy machinery spares available for immediate delivery.',
  openGraph: {
    title: 'Truck Parts Catalog | Emisco Investment Limited',
    description: 'Browse our complete catalog of genuine OEM truck parts, engine filters, gearboxes, brake systems, and heavy machinery spares available for immediate delivery.',
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { category, search } = await searchParams;
  return <ProductsPage initialCategory={category} initialSearch={search} />;
}