export const LS_API_BASE = 'https://api.lemonsqueezy.com/v1'

// LS License flow: new keys start as "inactive" → must call /activate first.
// /activate creates an instance and returns status "active".
// We use instance_name = "aipack" to identify activations from our site.
export async function activateLicenseKey(
  key: string,
  productId: string | null
): Promise<{ valid: boolean; reason?: string }> {
  const apiKey = process.env.LEMON_SQUEEZY_API_KEY
  if (!apiKey) return { valid: false, reason: 'no_api_key' }

  try {
    const body = new URLSearchParams({
      license_key: key,
      instance_name: 'aipack',
    })

    const res = await fetch(`${LS_API_BASE}/licenses/activate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
      body,
      cache: 'no-store',
    })

    const json = await res.json()

    // LS returns 400 with error message when key is invalid/already used past limit
    if (!res.ok || !json.activated) {
      // Already activated = still valid (user re-entering their key)
      if (json.error?.toLowerCase().includes('activation limit')) {
        // Key hit limit — try validate instead to confirm it's genuinely theirs
        return validateExistingKey(key, productId, apiKey)
      }
      return { valid: false, reason: 'invalid_key' }
    }

    const licenseKey = json.license_key
    if (!licenseKey) return { valid: false, reason: 'invalid_response' }

    // Verify product match
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

// Called when activation limit hit — validate the key is genuinely active
async function validateExistingKey(
  key: string,
  productId: string | null,
  apiKey: string
): Promise<{ valid: boolean; reason?: string }> {
  try {
    const body = new URLSearchParams({ license_key: key })
    const res = await fetch(`${LS_API_BASE}/licenses/validate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
      body,
      cache: 'no-store',
    })

    if (!res.ok) return { valid: false, reason: 'invalid_key' }

    const json = await res.json()
    const licenseKey = json.license_key
    if (!licenseKey) return { valid: false, reason: 'invalid_response' }
    if (licenseKey.status !== 'active') return { valid: false, reason: 'inactive_key' }

    if (productId) {
      const keyProductId = String(json.meta?.product_id ?? '')
      if (keyProductId !== productId) return { valid: false, reason: 'product_mismatch' }
    }

    return { valid: true }
  } catch {
    return { valid: false, reason: 'fetch_error' }
  }
}
