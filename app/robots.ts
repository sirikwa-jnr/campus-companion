import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'], // Keep crawlers out of internal files
    },
    sitemap: 'https://campus-companion-sigma.vercel.app/sitemap.xml',
  }
}