import { createClient } from './server'
import { createServiceClient } from './server'
import { getSession } from '@/lib/session'

export interface SupabaseUser {
  id: string
  email: string | null
}

export interface UnifiedUser {
  telegramId?: number
  supabaseUid?: string
  email?: string | null
  firstName?: string
  username?: string | null
  role: 'admin' | 'member' | 'free'
}

const ROLE_RANK = { admin: 2, member: 1, free: 0 } as const

/**
 * Returns a unified identity merging Telegram session + Supabase auth.
 * Checks comm_auth_users bridge to find linked accounts.
 */
export async function getUnifiedUser(): Promise<UnifiedUser | null> {
  const [session, supabaseUser] = await Promise.all([
    getSession(),
    getSupabaseUser(),
  ])

  if (!session && !supabaseUser) return null

  const service = createServiceClient()

  let telegramId = session ? Number(session.telegramId) : undefined
  let role = (session?.role ?? 'free') as 'admin' | 'member' | 'free'
  let supabaseUid = supabaseUser?.id
  let email = supabaseUser?.email ?? null
  let firstName = session?.firstName
  let username = session?.username ?? null

  // Email user without active Telegram session → check bridge for linked Telegram role
  if (supabaseUser && !session) {
    const { data: link } = await service
      .from('comm_auth_users')
      .select('telegram_id')
      .eq('supabase_uid', supabaseUser.id)
      .maybeSingle()

    if (link?.telegram_id) {
      telegramId = Number(link.telegram_id)

      const { data: profile } = await service
        .from('comm_profiles')
        .select('role, first_name, username')
        .eq('telegram_id', link.telegram_id)
        .maybeSingle()

      if (profile) {
        const linkedRole = profile.role as 'admin' | 'member' | 'free'
        if (ROLE_RANK[linkedRole] > ROLE_RANK[role]) role = linkedRole
        firstName = firstName ?? profile.first_name
        username = username ?? profile.username
      }
    }
  }

  // Telegram user without active Supabase session → check bridge for linked supabase_uid
  if (session && !supabaseUser) {
    const { data } = await service
      .from('comm_auth_users')
      .select('supabase_uid')
      .eq('telegram_id', session.telegramId)
      .maybeSingle()

    if (data?.supabase_uid) supabaseUid = data.supabase_uid
  }

  return { telegramId, supabaseUid, email, firstName, username, role }
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
