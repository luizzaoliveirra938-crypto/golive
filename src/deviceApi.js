import { ADMIN_PASSWORD } from './auth'

function adminHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${ADMIN_PASSWORD}`,
  }
}

export async function apiHealth() {
  try {
    const res = await fetch('/api/health')
    return await res.json()
  } catch {
    return { ok: false, kv: false }
  }
}

export async function apiGetAllDevices() {
  const res = await fetch('/api/devices', { headers: adminHeaders() })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    return { ok: false, error: data.error || 'Failed to load devices', devices: [], activeSessionDeviceId: null }
  }
  return {
    ok: true,
    devices: Array.isArray(data.devices) ? data.devices : [],
    activeSessionDeviceId: data.activeSessionDeviceId ?? null,
    activeSessionFingerprint: data.activeSessionFingerprint ?? null,
  }
}

export async function apiGetDevice(id) {
  const res = await fetch(`/api/devices/${encodeURIComponent(id)}`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    return {
      ok: false,
      error: data.error || 'Failed to load device',
      device: null,
      activeSessionDeviceId: null,
      activeSessionFingerprint: null,
    }
  }
  return {
    ok: true,
    device: data.device || null,
    activeSessionDeviceId: data.activeSessionDeviceId ?? null,
    activeSessionFingerprint: data.activeSessionFingerprint ?? null,
  }
}

export async function apiUpsertDevice(device) {
  const res = await fetch(`/api/devices/${encodeURIComponent(device.id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(device),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    return { ok: false, error: data.error || 'Failed to save device' }
  }
  return {
    ok: true,
    device: data.device,
    activeSessionDeviceId: data.activeSessionDeviceId ?? null,
  }
}

export async function apiPatchDevice(id, patch) {
  const res = await fetch(`/api/devices/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: adminHeaders(),
    body: JSON.stringify(patch),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    return { ok: false, error: data.error || 'Failed to update device' }
  }
  return {
    ok: true,
    device: data.device,
    devices: data.devices,
    activeSessionDeviceId: data.activeSessionDeviceId ?? null,
  }
}

export async function apiDeleteDevice(id) {
  const res = await fetch(`/api/devices/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    return { ok: false, error: data.error || 'Failed to delete device' }
  }
  return {
    ok: true,
    devices: data.devices || [],
    activeSessionDeviceId: data.activeSessionDeviceId ?? null,
  }
}

export async function apiSetSession(activeSessionDeviceId, activeSessionFingerprint = null) {
  const res = await fetch('/api/session', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ activeSessionDeviceId, activeSessionFingerprint }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    return { ok: false, error: data.error || 'Failed to update session' }
  }
  return {
    ok: true,
    activeSessionDeviceId: data.activeSessionDeviceId ?? null,
    activeSessionFingerprint: data.activeSessionFingerprint ?? null,
  }
}
