import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://emiscoinvestment.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/dashboard/',
        '/checkout/',
        '/orders/',
        '/forgot-password/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
