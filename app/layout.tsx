import type { Metadata } from "next";
import "./globals.css";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "sonner";
import { PageTransition } from "@/components/PageTransition";
import { EMISCO_OFFICE_ADDRESS } from "@/lib/logistics-data";

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://emiscoinvestment.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Emisco Investment Limited | Genuine Motor Parts & Heavy Machinery Spares",
    template: "%s | Emisco Investment Limited",
  },
  description: "Authorized distributor of 100% genuine heavy-duty truck parts, OEM motor components, engine filters, gearboxes, and heavy machinery spares in Lagos, Nigeria.",
  keywords: [
    "Emisco Investment Limited",
    "Emisco spare parts",
    "Truck spare parts Lagos Nigeria",
    "Heavy duty truck parts",
    "OEM motor components",
    "Mack truck parts Nigeria",
    "Volvo truck spares",
    "DAF truck engines and gearboxes",
    "Auto parts distributor Lagos",
    "Heavy machinery spare parts",
  ],
  authors: [{ name: "Emisco Investment Limited", url: SITE_URL }],
  creator: "Emisco Investment Limited",
  publisher: "Emisco Investment Limited",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: SITE_URL,
    title: "Emisco Investment Limited | Genuine Motor & Heavy Machinery Parts",
    description: "Authorized distributor of 100% genuine heavy-duty truck parts, OEM engine components, gearboxes, and machinery spares in Lagos, Nigeria.",
    siteName: "Emisco Investment Limited",
    images: [
      {
        url: `${SITE_URL}/emisco_logo.png`,
        width: 1200,
        height: 630,
        alt: "Emisco Investment Limited — Premium Heavy Duty Truck & Motor Parts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Emisco Investment Limited | Genuine Motor & Heavy Machinery Parts",
    description: "Authorized distributor of 100% genuine heavy-duty truck parts, OEM engine components, gearboxes, and machinery spares in Lagos, Nigeria.",
    images: [`${SITE_URL}/emisco-img.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Google Rich Snippet (AutoPartsStore & Organization Schema)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoPartsStore',
    'name': 'Emisco Investment Limited',
    'url': SITE_URL,
    'logo': `${SITE_URL}/emisco-img.jpg`,
    'image': `${SITE_URL}/emisco-img.jpg`,
    'description': 'Authorized distributor of 100% genuine heavy-duty truck parts, OEM motor components, engine filters, gearboxes, and heavy machinery spares.',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': EMISCO_OFFICE_ADDRESS,
      'addressLocality': 'Lagos',
      'addressCountry': 'NG',
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 6.5244,
      'longitude': 3.3792,
    },
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        'opens': '08:00',
        'closes': '17:00',
      },
    ],
    'priceRange': '₦₦₦',
    'telephone': '+2348000000000',
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans transition-colors duration-300">
        <Navbar />
        <main className="grow pt-20">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
