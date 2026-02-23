import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/my/',
          '/auth/',
          '/start/',
          '/dashboard/',
          '/login/',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://aipack.live/sitemap.xml',
  }
}
