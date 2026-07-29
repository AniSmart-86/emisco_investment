import { Metadata } from 'next';
import CategoriesClient from './CategoriesClient';

export const metadata: Metadata = {
  title: 'Spare Parts Categories | Mack, Volvo, DAF & Heavy Machinery',
  description: 'Explore heavy-duty spare parts categorized by vehicle brand and component type — Mack, Volvo, DAF, Mercedes engines, transmissions, and braking systems.',
  openGraph: {
    title: 'Spare Parts Categories | Emisco Investment Limited',
    description: 'Explore heavy-duty spare parts categorized by vehicle brand and component type — Mack, Volvo, DAF, Mercedes engines, transmissions, and braking systems.',
  },
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}
