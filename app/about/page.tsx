import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Us | Heavy Duty Truck Spare Parts Specialist',
  description: 'Learn about Emisco Investment Limited, a premier distributor of genuine OEM heavy-duty truck components, engine parts, and heavy machinery spares in Lagos, Nigeria.',
  openGraph: {
    title: 'About Emisco Investment Limited | Genuine Truck Parts Leader',
    description: 'Learn about Emisco Investment Limited, a premier distributor of genuine OEM heavy-duty truck components, engine parts, and heavy machinery spares in Lagos, Nigeria.',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
