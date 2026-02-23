import type { MetadataRoute } from 'next'
import { createServiceClient } from '@/lib/supabase/server'

const BASE = 'https://aipack.live'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/join`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/p`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/terms`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/refund`, changeFrequency: 'yearly', priority: 0.2 },
  ]

  // Dynamic product pages
  const supabase = createServiceClient()
  const { data: products } = await supabase
    .from('comm_products')
    .select('slug, created_at')
    .eq('published', true)

  const productPages: MetadataRoute.Sitemap = (products ?? []).map(
    (p: { slug: string; created_at: string }) => ({
      url: `${BASE}/p/${p.slug}`,
      lastModified: p.created_at,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })
  )

  return [...staticPages, ...productPages]
}
