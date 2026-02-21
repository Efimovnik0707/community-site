import { createClient } from './server'
import { createServiceClient } from './server'

export interface SupabaseUser {
  id: string
  email: string | null
}

/** Get current Supabase Auth session user (email/Google login). */
export async function getSupabaseUser(): Promise<SupabaseUser | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    return { id: user.id, email: user.email ?? null }
  } catch {
    return null
  }
}

/** Check if supabase user has purchased a specific product. */
export async function hasPurchased(supabaseUid: string, productId: string): Promise<boolean> {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('comm_purchases')
    .select('id')
    .eq('supabase_uid', supabaseUid)
    .eq('product_id', productId)
    .single()
  return !!data
}

/** Get all purchases for a supabase user. */
export async function getUserPurchases(supabaseUid: string) {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('comm_purchases')
    .select('id, created_at, license_key, product_id, comm_products(id, slug, title, tagline)')
    .eq('supabase_uid', supabaseUid)
    .order('created_at', { ascending: false })
  return data ?? []
}

/** Save a purchase after license key activation. */
export async function savePurchase(
  supabaseUid: string,
  productId: string,
  licenseKey: string,
  instanceId?: string
): Promise<void> {
  const supabase = createServiceClient()
  await supabase.from('comm_purchases').upsert(
    {
      supabase_uid: supabaseUid,
      product_id: productId,
      license_key: licenseKey,
      ls_instance_id: instanceId ?? null,
    },
    { onConflict: 'supabase_uid,product_id' }
  )
}
