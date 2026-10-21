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

async function readStore(env) {
  if (!env.GOLIVE_DEVICES) {
    return { devices: [], activeSessionDeviceId: null, missingBinding: true }
  }
  try {
    const raw = await env.GOLIVE_DEVICES.get(STORE_KEY)
    if (!raw) return { devices: [], activeSessionDeviceId: null }
    const parsed = JSON.parse(raw)
    return {
      devices: Array.isArray(parsed.devices) ? parsed.devices : [],
      activeSessionDeviceId: parsed.activeSessionDeviceId ?? null,
    }
  } catch {
    return { devices: [], activeSessionDeviceId: null }
  }
}

async function writeStore(env, store) {
  if (!env.GOLIVE_DEVICES) {
    return { ok: false, error: 'KV binding GOLIVE_DEVICES is missing. Add it in Cloudflare.' }
  }
  await env.GOLIVE_DEVICES.put(
    STORE_KEY,
    JSON.stringify({
      devices: store.devices || [],
      activeSessionDeviceId: store.activeSessionDeviceId ?? null,
      updatedAt: new Date().toISOString(),
    })
  )
  return { ok: true }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return json({ ok: true })
    }

    if (!url.pathname.startsWith('/api/')) {
      return new Response(null, { status: 404 })
    }

    // Health / binding check
    if (url.pathname === '/api/health') {
      const store = await readStore(env)
      return json({
        ok: true,
        kv: Boolean(env.GOLIVE_DEVICES) && !store.missingBinding,
        devices: (store.devices || []).length,
      })
    }

    // GET /api/devices — admin: all devices; otherwise empty list hint
    if (url.pathname === '/api/devices' && request.method === 'GET') {
      const store = await readStore(env)
      if (store.missingBinding) {
        return json({ error: 'KV binding GOLIVE_DEVICES missing', devices: [], activeSessionDeviceId: null }, 503)
      }
      if (!isAdmin(request)) {
        return json({ error: 'Admin authorization required', devices: [], activeSessionDeviceId: null }, 401)
      }
      return json({
        devices: store.devices,
        activeSessionDeviceId: store.activeSessionDeviceId,
      })
    }

    // GET /api/devices/:id
    const deviceMatch = url.pathname.match(/^\/api\/devices\/([^/]+)$/)
    if (deviceMatch && request.method === 'GET') {
      const id = decodeURIComponent(deviceMatch[1])
      const store = await readStore(env)
      if (store.missingBinding) {
        return json({ error: 'KV binding GOLIVE_DEVICES missing' }, 503)
      }
      const device = store.devices.find((item) => item.id === id) || null
      return json({
        device,
        activeSessionDeviceId: store.activeSessionDeviceId,
      })
    }

    // PUT /api/devices/:id — upsert one device (signup / name change / proof)
    if (deviceMatch && request.method === 'PUT') {
      const id = decodeURIComponent(deviceMatch[1])
      const store = await readStore(env)
      if (store.missingBinding) {
        return json({ error: 'KV binding GOLIVE_DEVICES missing' }, 503)
      }
      let body
      try {
        body = await request.json()
      } catch {
        return json({ error: 'Invalid JSON' }, 400)
      }
      if (!body || typeof body !== 'object') return json({ error: 'Invalid body' }, 400)
      const device = {
        ...body,
        id,
        updatedAt: new Date().toISOString(),
      }
      const index = store.devices.findIndex((item) => item.id === id)
      if (index === -1) store.devices = [device, ...store.devices]
      else store.devices[index] = { ...store.devices[index], ...device, id }
      const saved = await writeStore(env, store)
      if (!saved.ok) return json(saved, 503)
      return json({
        ok: true,
        device: store.devices.find((item) => item.id === id),
        activeSessionDeviceId: store.activeSessionDeviceId,
      })
    }

    // PATCH /api/devices/:id — admin status / fields
    if (deviceMatch && request.method === 'PATCH') {
      if (!isAdmin(request)) return json({ error: 'Admin authorization required' }, 401)
      const id = decodeURIComponent(deviceMatch[1])
      const store = await readStore(env)
      if (store.missingBinding) {
        return json({ error: 'KV binding GOLIVE_DEVICES missing' }, 503)
      }
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
      const saved = await writeStore(env, store)
      if (!saved.ok) return json(saved, 503)
      return json({
        ok: true,
        device: store.devices[index],
        activeSessionDeviceId: store.activeSessionDeviceId,
        devices: store.devices,
      })
    }

    // DELETE /api/devices/:id
    if (deviceMatch && request.method === 'DELETE') {
      if (!isAdmin(request)) return json({ error: 'Admin authorization required' }, 401)
      const id = decodeURIComponent(deviceMatch[1])
      const store = await readStore(env)
      if (store.missingBinding) {
        return json({ error: 'KV binding GOLIVE_DEVICES missing' }, 503)
      }
      store.devices = store.devices.filter((item) => item.id !== id)
      if (store.activeSessionDeviceId === id) store.activeSessionDeviceId = null
      const saved = await writeStore(env, store)
      if (!saved.ok) return json(saved, 503)
      return json({ ok: true, devices: store.devices, activeSessionDeviceId: store.activeSessionDeviceId })
    }

    // PUT /api/session — set active signed-in device
    if (url.pathname === '/api/session' && request.method === 'PUT') {
      const store = await readStore(env)
      if (store.missingBinding) {
        return json({ error: 'KV binding GOLIVE_DEVICES missing' }, 503)
      }
      let body
      try {
        body = await request.json()
      } catch {
        return json({ error: 'Invalid JSON' }, 400)
      }
      store.activeSessionDeviceId = body?.activeSessionDeviceId ?? null
      const saved = await writeStore(env, store)
      if (!saved.ok) return json(saved, 503)
      return json({ ok: true, activeSessionDeviceId: store.activeSessionDeviceId })
    }

    return json({ error: 'Not found' }, 404)
  },
}
