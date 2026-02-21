import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient, createClient } from '@/lib/supabase/server'
import { activateLicenseKey } from '@/lib/lemon-squeezy'
import { savePurchase } from '@/lib/supabase/auth'

export async function POST(req: NextRequest) {
  try {
    const { key, slug } = await req.json()

    if (!key || !slug) {
      return NextResponse.json({ ok: false, reason: 'missing_params' }, { status: 400 })
    }

    // Look up the product
    const supabase = createServiceClient()
    const { data: product } = await supabase
      .from('comm_products')
      .select('id, lemon_squeezy_product_id')
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (!product) {
      return NextResponse.json({ ok: false, reason: 'product_not_found' }, { status: 404 })
    }

    const result = await activateLicenseKey(key, product.lemon_squeezy_product_id)

    if (!result.valid) {
      return NextResponse.json({ ok: false, reason: result.reason }, { status: 400 })
    }

    // Check if user is logged in via Supabase Auth — save purchase to DB
    const authClient = await createClient()
    const { data: { user } } = await authClient.auth.getUser()

    if (user) {
      await savePurchase(user.id, product.id, key)
    }

    return NextResponse.json({ ok: true, savedToAccount: !!user })
  } catch {
    return NextResponse.json({ ok: false, reason: 'server_error' }, { status: 500 })
  }
}
