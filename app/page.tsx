import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: "Genuine Heavy Duty Truck & Motor Spare Parts Distributor",
  description: "Explore 100% genuine truck engine components, gearboxes, brake pads, filters, and heavy machinery spare parts at Emisco Investment Limited, Lagos Nigeria.",
  openGraph: {
    title: "Emisco Investment Limited | Genuine Truck & Heavy Machinery Spare Parts",
    description: "Explore 100% genuine truck engine components, gearboxes, brake pads, filters, and heavy machinery spare parts in Lagos, Nigeria.",
  },
};

export default function Home() {
  return <HomeClient />;
}
