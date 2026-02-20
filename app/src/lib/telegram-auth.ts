import crypto from 'crypto'

export interface TelegramAuthData {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

/**
 * Verify Telegram Login Widget data using HMAC-SHA256.
 * See: https://core.telegram.org/widgets/login#checking-authorization
 */
export function verifyTelegramAuth(data: TelegramAuthData): boolean {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  if (!botToken) throw new Error('TELEGRAM_BOT_TOKEN is not set')

  const { hash, ...fields } = data

  // Build check string: sorted key=value pairs joined by \n
  const checkString = Object.entries(fields)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n')

  // Secret key = SHA256 of bot token (not HMAC)
  const secretKey = crypto.createHash('sha256').update(botToken).digest()

  const expectedHash = crypto
    .createHmac('sha256', secretKey)
    .update(checkString)
    .digest('hex')

  if (expectedHash !== hash) return false

  // Check auth_date is not older than 24 hours
  const authDate = data.auth_date
  const now = Math.floor(Date.now() / 1000)
  if (now - authDate > 86400) return false

  return true
}

/**
 * Check if a Telegram user is a member of the paid group.
 * Returns true if user is member/administrator/creator.
 */
export async function checkPaidMembership(telegramId: number): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const groupId = process.env.TELEGRAM_PAID_GROUP_ID
  if (!botToken || !groupId) return false

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${groupId}&user_id=${telegramId}`
    )
    const json = await res.json()
    if (!json.ok) return false

    const status: string = json.result?.status
    return ['member', 'administrator', 'creator'].includes(status)
  } catch {
    return false
  }
}
