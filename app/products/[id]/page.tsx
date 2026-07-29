import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import ProductDetailsClient from './ProductDetailsClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The requested heavy duty spare part is unavailable.',
      };
    }

    const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://emiscoinvestment.com';

    return {
      title: `${product.name} — Genuine ${product.category} Part`,
      description: `${product.description.slice(0, 160)}. Buy genuine ${product.name} at Emisco Investment Limited, Lagos Nigeria. Price: ₦${product.price.toLocaleString()}`,
      openGraph: {
        title: `${product.name} | Genuine Truck Spare Part`,
        description: product.description.slice(0, 160),
        url: `${SITE_URL}/products/${product.id}`,
        images: [
          {
            url: product.image,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} | Emisco Investment`,
        description: product.description.slice(0, 160),
        images: [product.image],
      },
    };
  } catch (error) {
    return {
      title: 'Genuine Truck Part Details',
      description: 'View product specifications and purchase genuine truck spare parts at Emisco Investment.',
    };
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  // Optionally fetch product for JSON-LD Product Schema
  let product = null;
  try {
    product = await prisma.product.findUnique({ where: { id } });
  } catch (e) {}

  const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://emiscoinvestment.com';

  const productJsonLd = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.name,
    'image': [product.image],
    'description': product.description,
    'category': product.category,
    'offers': {
      '@type': 'Offer',
      'url': `${SITE_URL}/products/${product.id}`,
      'priceCurrency': 'NGN',
      'price': product.price,
      'itemCondition': 'https://schema.org/NewCondition',
      'availability': product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      'seller': {
        '@type': 'Organization',
        'name': 'Emisco Investment Limited',
      },
    },
  } : null;

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      <ProductDetailsClient id={id} />
    </>
  );
}
