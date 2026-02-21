const LS_API_BASE = 'https://api.lemonsqueezy.com/v1'

interface LSOrder {
  data: {
    id: string
    attributes: {
      status: string // 'paid' | 'refunded' | 'partial_refund' | 'pending'
      first_order_item: {
        product_id: number
      }
    }
  }
}

export async function verifyOrder(
  orderId: string,
  expectedProductId: string | null
): Promise<{ valid: boolean; reason?: string }> {
  const apiKey = process.env.LEMON_SQUEEZY_API_KEY
  if (!apiKey) return { valid: false, reason: 'no_api_key' }

  try {
    const res = await fetch(`${LS_API_BASE}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 0 },
    })

    if (!res.ok) return { valid: false, reason: 'order_not_found' }

    const json: LSOrder = await res.json()
    const attrs = json.data.attributes

    if (attrs.status !== 'paid') return { valid: false, reason: 'not_paid' }

    // If product ID configured — verify it matches
    if (expectedProductId) {
      const orderedProductId = String(attrs.first_order_item.product_id)
      if (orderedProductId !== expectedProductId) {
        return { valid: false, reason: 'product_mismatch' }
      }
    }

    return { valid: true }
  } catch {
    return { valid: false, reason: 'fetch_error' }
  }
}
