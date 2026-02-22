import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * DEV-only: simulate a Stripe purchase without real payment.
 * Protected by DEV_SECRET env var.
 *
 * POST /api/dev/simulate-purchase
 * Body: { secret, email, slug }
 */
export async function POST(req: NextRequest) {
  const { secret, email, slug } = await req.json()

  if (!process.env.DEV_SECRET || secret !== process.env.DEV_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabase = createServiceClient()

  // Find product
  const { data: product } = await supabase
    .from('comm_products')
    .select('id, slug')
    .eq('slug', slug)
    .single()

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  // Try to find user by email
  let supabaseUid = '00000000-0000-0000-0000-000000000000'

  if (email) {
    const { data: authUsers } = await supabase
      .rpc('get_auth_user_by_email', { lookup_email: email })

    if (authUsers && authUsers.length > 0) {
      supabaseUid = authUsers[0].id
    }
  }

  const fakeSessionId = `test_${Date.now()}`

  await supabase.from('comm_purchases').upsert(
    {
      supabase_uid: supabaseUid,
      product_id: product.id,
      license_key: fakeSessionId,
      stripe_session_id: fakeSessionId,
      customer_email: email,
    },
    { onConflict: 'supabase_uid,product_id' }
  )

  return NextResponse.json({
    ok: true,
    product: product.slug,
    email,
    supabaseUid,
    sessionId: fakeSessionId,
  })
}
