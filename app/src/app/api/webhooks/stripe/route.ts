import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const customerEmail = session.customer_details?.email ?? session.customer_email
    const stripeSessionId = session.id

    // Get the price ID from line items
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 })
    const priceId = lineItems.data[0]?.price?.id

    if (!priceId) {
      console.error('Stripe webhook: no price ID in session', stripeSessionId)
      return NextResponse.json({ ok: true })
    }

    const supabase = createServiceClient()

    // Find product by stripe_price_id
    const { data: product } = await supabase
      .from('comm_products')
      .select('id, slug')
      .eq('stripe_price_id', priceId)
      .single()

    if (!product) {
      console.error('Stripe webhook: no product for price', priceId)
      return NextResponse.json({ ok: true })
    }

    // Try to find user by email in auth.users
    let supabaseUid: string | null = null

    if (customerEmail) {
      const { data: authUsers } = await supabase
        .rpc('get_auth_user_by_email', { lookup_email: customerEmail })

      if (authUsers && authUsers.length > 0) {
        supabaseUid = authUsers[0].id
      }
    }

    if (supabaseUid) {
      // User exists — save purchase directly
      await supabase.from('comm_purchases').upsert(
        {
          supabase_uid: supabaseUid,
          product_id: product.id,
          license_key: stripeSessionId,
          stripe_session_id: stripeSessionId,
          customer_email: customerEmail,
        },
        { onConflict: 'supabase_uid,product_id' }
      )
    } else {
      // No user found — save with email for later matching
      // When user registers/logs in with this email, we can match
      await supabase.from('comm_purchases').insert({
        supabase_uid: '00000000-0000-0000-0000-000000000000',
        product_id: product.id,
        license_key: stripeSessionId,
        stripe_session_id: stripeSessionId,
        customer_email: customerEmail,
      })
    }

    console.log('Stripe purchase saved:', {
      product: product.slug,
      email: customerEmail,
      matched: !!supabaseUid,
    })
  }

  return NextResponse.json({ ok: true })
}
