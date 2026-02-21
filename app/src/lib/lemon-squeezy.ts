export const LS_API_BASE = 'https://api.lemonsqueezy.com/v1'

export async function validateLicenseKey(
  key: string,
  productId: string | null
): Promise<{ valid: boolean; reason?: string }> {
  const apiKey = process.env.LEMON_SQUEEZY_API_KEY
  if (!apiKey) return { valid: false, reason: 'no_api_key' }

  try {
    const res = await fetch(`${LS_API_BASE}/licenses/validate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ license_key: key }),
      cache: 'no-store',
    })

    if (!res.ok) return { valid: false, reason: 'invalid_key' }

    const json = await res.json()
    const licenseKey = json.license_key

    if (!licenseKey) return { valid: false, reason: 'invalid_response' }
    if (licenseKey.status !== 'active') return { valid: false, reason: 'inactive_key' }

    // If product ID configured — verify it matches
    if (productId) {
      const keyProductId = String(json.meta?.product_id ?? '')
      if (keyProductId !== productId) {
        return { valid: false, reason: 'product_mismatch' }
      }
    }

    return { valid: true }
  } catch {
    return { valid: false, reason: 'fetch_error' }
  }
}
