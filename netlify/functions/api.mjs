import { getStore } from '@netlify/blobs'

/** Must match ADMIN_PASSWORD in src/auth.js */
const ADMIN_PASSWORD = 'ChangeMeNow!'
const STORE_KEY = 'golive-store-v1'

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, PUT, PATCH, DELETE, OPTIONS',
    },
  })
}

function isAdmin(request) {
  const header = request.headers.get('Authorization') || ''
  const token = header.replace(/^Bearer\s+/i, '').trim()
  return token && token === ADMIN_PASSWORD
}

function blobStore() {
  try {
    return getStore('golive-devices')
  } catch {
    return null
  }
}

async function readStore() {
  const store = blobStore()
  if (!store) return { devices: [], activeSessionDeviceId: null, missingBinding: true }
  try {
    const parsed = await store.get(STORE_KEY, { type: 'json' })
    if (!parsed) return { devices: [], activeSessionDeviceId: null }
    return {
      devices: Array.isArray(parsed.devices) ? parsed.devices : [],
      activeSessionDeviceId: parsed.activeSessionDeviceId ?? null,
    }
  } catch {
    return { devices: [], activeSessionDeviceId: null, missingBinding: true }
  }
}

async function writeStore(data) {
  const store = blobStore()
  if (!store) return { ok: false, error: 'Netlify Blobs unavailable' }
  await store.setJSON(STORE_KEY, {
    devices: data.devices || [],
    activeSessionDeviceId: data.activeSessionDeviceId ?? null,
    updatedAt: new Date().toISOString(),
  })
  return { ok: true }
}

export default async (request) => {
  const url = new URL(request.url)

  if (request.method === 'OPTIONS') return json({ ok: true })

  if (url.pathname === '/api/health') {
    const store = await readStore()
    return json({
      ok: true,
      kv: !store.missingBinding,
      devices: (store.devices || []).length,
      host: 'netlify',
    })
  }

  if (url.pathname === '/api/devices' && request.method === 'GET') {
    const store = await readStore()
    if (store.missingBinding) {
      return json({ error: 'Shared store unavailable', devices: [], activeSessionDeviceId: null }, 503)
    }
    if (!isAdmin(request)) {
      return json({ error: 'Admin authorization required', devices: [], activeSessionDeviceId: null }, 401)
    }
    return json({
      devices: store.devices,
      activeSessionDeviceId: store.activeSessionDeviceId,
    })
  }

  const deviceMatch = url.pathname.match(/^\/api\/devices\/([^/]+)$/)
  if (deviceMatch && request.method === 'GET') {
    const id = decodeURIComponent(deviceMatch[1])
    const store = await readStore()
    if (store.missingBinding) return json({ error: 'Shared store unavailable' }, 503)
    const device = store.devices.find((item) => item.id === id) || null
    return json({ device, activeSessionDeviceId: store.activeSessionDeviceId })
  }

  if (deviceMatch && request.method === 'PUT') {
    const id = decodeURIComponent(deviceMatch[1])
    const store = await readStore()
    if (store.missingBinding) return json({ error: 'Shared store unavailable' }, 503)
    let body
    try {
      body = await request.json()
    } catch {
      return json({ error: 'Invalid JSON' }, 400)
    }
    const device = { ...body, id, updatedAt: new Date().toISOString() }
    const index = store.devices.findIndex((item) => item.id === id)
    if (index === -1) store.devices = [device, ...store.devices]
    else store.devices[index] = { ...store.devices[index], ...device, id }
    const saved = await writeStore(store)
    if (!saved.ok) return json(saved, 503)
    return json({
      ok: true,
      device: store.devices.find((item) => item.id === id),
      activeSessionDeviceId: store.activeSessionDeviceId,
    })
  }

  if (deviceMatch && request.method === 'PATCH') {
    if (!isAdmin(request)) return json({ error: 'Admin authorization required' }, 401)
    const id = decodeURIComponent(deviceMatch[1])
    const store = await readStore()
    if (store.missingBinding) return json({ error: 'Shared store unavailable' }, 503)
    let body
    try {
      body = await request.json()
    } catch {
      return json({ error: 'Invalid JSON' }, 400)
    }
    const index = store.devices.findIndex((item) => item.id === id)
    if (index === -1) return json({ error: 'Device not found' }, 404)
    store.devices[index] = {
      ...store.devices[index],
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    }
    if (body.clearSession || ['blocked', 'suspended', 'rejected', 'subscribe'].includes(body.status)) {
      if (store.activeSessionDeviceId === id) store.activeSessionDeviceId = null
    }
    const saved = await writeStore(store)
    if (!saved.ok) return json(saved, 503)
    return json({
      ok: true,
      device: store.devices[index],
      activeSessionDeviceId: store.activeSessionDeviceId,
      devices: store.devices,
    })
  }

  if (deviceMatch && request.method === 'DELETE') {
    if (!isAdmin(request)) return json({ error: 'Admin authorization required' }, 401)
    const id = decodeURIComponent(deviceMatch[1])
    const store = await readStore()
    if (store.missingBinding) return json({ error: 'Shared store unavailable' }, 503)
    store.devices = store.devices.filter((item) => item.id !== id)
    if (store.activeSessionDeviceId === id) store.activeSessionDeviceId = null
    const saved = await writeStore(store)
    if (!saved.ok) return json(saved, 503)
    return json({ ok: true, devices: store.devices, activeSessionDeviceId: store.activeSessionDeviceId })
  }

  if (url.pathname === '/api/session' && request.method === 'PUT') {
    const store = await readStore()
    if (store.missingBinding) return json({ error: 'Shared store unavailable' }, 503)
    let body
    try {
      body = await request.json()
    } catch {
      return json({ error: 'Invalid JSON' }, 400)
    }
    store.activeSessionDeviceId = body?.activeSessionDeviceId ?? null
    const saved = await writeStore(store)
    if (!saved.ok) return json(saved, 503)
    return json({ ok: true, activeSessionDeviceId: store.activeSessionDeviceId })
  }

  return json({ error: 'Not found' }, 404)
}

export const config = {
  path: ['/api/*', '/api'],
}
