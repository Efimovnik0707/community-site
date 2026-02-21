import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateLicenseKey } from '@/lib/lemon-squeezy'

export async function POST(req: NextRequest) {
  try {
    const { key, slug } = await req.json()

    if (!key || !slug) {
      return NextResponse.json({ ok: false, reason: 'missing_params' }, { status: 400 })
    }

    // Look up the product to get its lemon_squeezy_product_id
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

    const result = await validateLicenseKey(key, product.lemon_squeezy_product_id)

    if (!result.valid) {
      return NextResponse.json({ ok: false, reason: result.reason }, { status: 400 })
    }

    // Set httpOnly cookie valid for 1 year
    const response = NextResponse.json({ ok: true })
    response.cookies.set(`ls_access_${slug}`, key, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ ok: false, reason: 'server_error' }, { status: 500 })
  }
}
