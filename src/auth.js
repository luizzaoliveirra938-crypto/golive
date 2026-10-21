/** Shared member credentials — never shown in the UI. */
export const MEMBER_EMAIL = 'BombAsia@goliveasia.com'
export const MEMBER_PASSWORD = 'Heha001@#'

/** Admin credentials — never shown in the UI. */
export const ADMIN_EMAIL = 'bianccasantos3@gmail.com'
export const ADMIN_PASSWORD = 'ChangeMeNow!'

export const DEVICE_STATUSES = [
  'pending',
  'edited',
  'allowed',
  'rejected',
  'blocked',
  'suspended',
  'subscribe',
  'subscribe_pending',
]

/** Statuses that force an immediate member logout. */
export const FORCE_LOGOUT_STATUSES = ['blocked', 'suspended', 'rejected']

/** Max signup-name edits tracked on the admin panel (shown as changes: n/2). */
export const MAX_NAME_CHANGES = 2

export function statusLabel(status) {
  const map = {
    pending: 'pending',
    edited: 'edited',
    allowed: 'allowed',
    rejected: 'rejected',
    blocked: 'blocked',
    suspended: 'suspended',
    subscribe: 'subscribe required',
    subscribe_pending: 'subscription under review',
  }
  return map[status] || status
}

export function getOrCreateDeviceId() {
  const key = 'golive-device-id'
  try {
    let id = localStorage.getItem(key)
    if (!id) {
      const raw =
        (typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID()) ||
        `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
      id = `dev_${String(raw).replace(/-/g, '')}`
      localStorage.setItem(key, id)
    }
    return id
  } catch {
    return `dev_temp_${Date.now().toString(36)}`
  }
}

/**
 * Stable-ish id for the physical phone/PC so browser + installed PWA
 * on the same device share one session (they often have different localStorage ids).
 */
export function getDeviceFingerprint() {
  if (typeof navigator === 'undefined') return 'fp_server'
  const parts = [
    navigator.userAgent || '',
    navigator.language || '',
    typeof screen !== 'undefined' ? `${screen.width}x${screen.height}x${screen.colorDepth}` : '',
    navigator.platform || '',
    navigator.maxTouchPoints || 0,
  ]
  const raw = parts.join('|')
  let hash = 2166136261
  for (let i = 0; i < raw.length; i += 1) {
    hash ^= raw.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return `fp_${(hash >>> 0).toString(36)}`
}

export function deviceLabel(id) {
  if (!id) return 'Unknown device'
  return String(id)
}

/** OS / device label + full user-agent for the admin panel. */
export function detectDeviceMeta() {
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent || '' : ''
  let label = 'Unknown'
  if (/iPhone|iPad|iPod/i.test(userAgent)) label = 'iPhone'
  else if (/Android/i.test(userAgent)) label = 'Android'
  else if (/Windows/i.test(userAgent)) label = 'Windows'
  else if (/Mac OS|Macintosh/i.test(userAgent)) label = 'Mac'
  else if (/Linux/i.test(userAgent)) label = 'Linux'
  return { userAgent, label }
}

export function matchesAdminLogin(email, password) {
  return (
    String(email || '').trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    String(password || '') === ADMIN_PASSWORD
  )
}

export function matchesMemberLogin(email, password) {
  return (
    String(email || '').trim().toLowerCase() === MEMBER_EMAIL.toLowerCase() &&
    String(password || '') === MEMBER_PASSWORD
  )
}
