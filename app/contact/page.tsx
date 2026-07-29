import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us | Emisco Investment Support & Inquiries',
  description: 'Get in touch with Emisco Investment Limited for truck spare part pricing, OEM compatibility, office pickup directions, and nationwide delivery support.',
  openGraph: {
    title: 'Contact Emisco Investment Limited | Heavy Duty Parts Sales & Support',
    description: 'Get in touch with Emisco Investment Limited for truck spare part pricing, OEM compatibility, office pickup directions, and nationwide delivery support.',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
