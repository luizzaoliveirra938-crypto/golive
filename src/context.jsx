import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { events as seedEvents, notifications } from './data'
import {
  detectDeviceMeta,
  FORCE_LOGOUT_STATUSES,
  getOrCreateDeviceId,
  MAX_NAME_CHANGES,
  MEMBER_EMAIL,
  statusLabel,
} from './auth'

const AppContext = createContext(null)
const STORAGE_KEY = 'golive-state-v3'
const ADMIN_SESSION_KEY = 'golive-admin-session-forever'
const DEVICES_KEY = 'golive-devices-forever'

function loadAdminSession() {
  try {
    return localStorage.getItem(ADMIN_SESSION_KEY) === '1'
  } catch {
    return false
  }
}

function saveAdminSession(unlocked) {
  try {
    if (unlocked) localStorage.setItem(ADMIN_SESSION_KEY, '1')
    else localStorage.removeItem(ADMIN_SESSION_KEY)
  } catch {
    /* ignore */
  }
}

function loadDevices(fallback = []) {
  try {
    const raw = localStorage.getItem(DEVICES_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    /* ignore */
  }
  return Array.isArray(fallback) ? fallback : []
}

function saveDevices(list) {
  try {
    localStorage.setItem(DEVICES_KEY, JSON.stringify(list))
  } catch {
    /* ignore */
  }
}

function loadState() {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ||
      localStorage.getItem('golive-state-v2') ||
      localStorage.getItem('golive-state-v1')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function normalizeTicket(ticket) {
  const next = { ...ticket, status: 'confirmed' }
  delete next.proofImage
  delete next.proofNote
  delete next.proofFileName
  delete next.proofUploadedAt
  delete next.reviewNote
  delete next.reviewedAt
  delete next.ticketEmail
  delete next.emailSentAt
  return next
}

export function AppProvider({ children }) {
  const saved = loadState()
  const deviceId = useMemo(() => getOrCreateDeviceId(), [])
  const [user, setUser] = useState(saved?.user ?? null)
  const [tickets, setTickets] = useState(() => (saved?.tickets ?? []).map(normalizeTicket))
  const [savedIds, setSavedIds] = useState(saved?.savedIds ?? [])
  const [cart, setCart] = useState(saved?.cart ?? [])
  const [orders, setOrders] = useState(saved?.orders ?? [])
  const [customEvents, setCustomEvents] = useState(saved?.customEvents ?? [])
  const [deletedEventIds, setDeletedEventIds] = useState(saved?.deletedEventIds ?? [])
  const [location, setLocation] = useState(saved?.location || 'Kuala Lumpur')
  const [displayName, setDisplayName] = useState(
    saved?.displayName || saved?.user?.name || 'GoLive User'
  )
  const [unread, setUnread] = useState(saved?.unread ?? true)
  const [notifOpen, setNotifOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [month, setMonth] = useState('all')
  const [sort, setSort] = useState('soonest')
  const [view, setView] = useState('cards')
  const [devices, setDevices] = useState(() => loadDevices(saved?.devices ?? []))
  const [activeSessionDeviceId, setActiveSessionDeviceId] = useState(saved?.activeSessionDeviceId ?? null)
  const [adminUnlocked, setAdminUnlocked] = useState(
    () => loadAdminSession() || Boolean(saved?.adminUnlocked)
  )

  const thisDevice = useMemo(
    () => devices.find((item) => item.id === deviceId) || null,
    [devices, deviceId]
  )
  const deviceStatus = thisDevice?.status || null
  const canUseApp = Boolean(user && deviceStatus === 'allowed' && activeSessionDeviceId === deviceId)

  const allEvents = useMemo(() => {
    const deleted = new Set(deletedEventIds)
    const seedById = new Map(seedEvents.map((event) => [event.id, event]))
    const customIds = new Set(customEvents.map((event) => event.id))
    const syncedCustom = customEvents
      .filter((event) => !deleted.has(event.id))
      .map((event) => {
        const seed = seedById.get(event.id)
        if (!seed) return event
        const seedBase = String(seed.image || '').replace(/\?.*$/, '')
        const eventBase = String(event.image || '').replace(/\?.*$/, '')
        if (eventBase && eventBase === seedBase && event.image !== seed.image) {
          return { ...event, image: seed.image, position: seed.position || event.position }
        }
        return event
      })
    return [
      ...syncedCustom,
      ...seedEvents.filter((event) => !customIds.has(event.id) && !deleted.has(event.id)),
    ]
  }, [customEvents, deletedEventIds])

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user,
        tickets,
        savedIds,
        cart,
        orders,
        customEvents,
        deletedEventIds,
        location,
        displayName,
        unread,
        devices,
        activeSessionDeviceId,
        adminUnlocked,
      })
    )
    if (adminUnlocked) saveAdminSession(true)
    saveDevices(devices)
  }, [
    user,
    tickets,
    savedIds,
    cart,
    orders,
    customEvents,
    deletedEventIds,
    location,
    displayName,
    unread,
    devices,
    activeSessionDeviceId,
    adminUnlocked,
  ])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(null), 2400)
    return () => clearTimeout(timer)
  }, [toast])

  // One active device session at a time — kick this tab if another device took the session.
  useEffect(() => {
    if (!user) return
    if (activeSessionDeviceId && activeSessionDeviceId !== deviceId) {
      setUser(null)
      setToast('Signed out — another device is using this account')
    }
  }, [activeSessionDeviceId, deviceId, user])

  // Block / suspend / reject → log out immediately on this device.
  useEffect(() => {
    if (!user || !thisDevice) return
    if (FORCE_LOGOUT_STATUSES.includes(thisDevice.status)) {
      setUser(null)
      if (activeSessionDeviceId === deviceId) setActiveSessionDeviceId(null)
    }
  }, [thisDevice, user, deviceId, activeSessionDeviceId])

  useEffect(() => {
    function onStorage(event) {
      if (event.key === DEVICES_KEY && event.newValue) {
        try {
          const list = JSON.parse(event.newValue)
          if (Array.isArray(list)) {
            setDevices(list)
            const mine = list.find((item) => item.id === deviceId)
            if (mine && FORCE_LOGOUT_STATUSES.includes(mine.status)) {
              setUser(null)
              setActiveSessionDeviceId((prev) => (prev === deviceId ? null : prev))
            }
          }
        } catch {
          /* ignore */
        }
        return
      }
      if (event.key !== STORAGE_KEY || !event.newValue) return
      try {
        const next = JSON.parse(event.newValue)
        if (Array.isArray(next.devices)) setDevices(next.devices)
        if ('activeSessionDeviceId' in next) setActiveSessionDeviceId(next.activeSessionDeviceId ?? null)
        if (next.activeSessionDeviceId && next.activeSessionDeviceId !== deviceId && user) {
          setUser(null)
        }
      } catch {
        /* ignore */
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [deviceId, user])

  function patchDevice(id, patch) {
    setDevices((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...patch,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    )
  }

  function applyNameChange(existing, name) {
    const previous = String(existing.name || '').trim()
    if (previous === name) {
      return { ok: true, status: existing.status, unchanged: true }
    }
    const used = Number(existing.nameChanges) || 0
    if (used >= MAX_NAME_CHANGES) {
      return { ok: false, error: `Name can only be changed ${MAX_NAME_CHANGES} times.` }
    }
    const meta = detectDeviceMeta()
    const signedInHere = Boolean(user && activeSessionDeviceId === deviceId)

    // Signed in: rename freely — no re-approval.
    if (signedInHere) {
      setDevices((prev) =>
        prev.map((item) =>
          item.id === deviceId
            ? {
                ...item,
                name,
                previousName: previous || item.previousName || '',
                nameChanges: used + 1,
                status: 'allowed',
                keepAccess: true,
                email: MEMBER_EMAIL,
                userAgent: meta.userAgent || item.userAgent || '',
                label: meta.label || item.label || 'Unknown',
                adminNote: '',
                updatedAt: new Date().toISOString(),
              }
            : item
        )
      )
      setDisplayName(name)
      setUser((prev) => (prev ? { ...prev, name } : prev))
      setToast('Name updated')
      return { ok: true, status: 'allowed' }
    }

    // Logged out: if this device was already allowed (or edited), name change needs approval before sign-in.
    const needsReapproval =
      existing.status === 'allowed' ||
      existing.status === 'edited' ||
      Boolean(existing.lastLoginAt)
    const nextStatus = needsReapproval ? 'edited' : existing.status === 'pending' ? 'pending' : 'edited'

    setDevices((prev) =>
      prev.map((item) =>
        item.id === deviceId
          ? {
              ...item,
              name,
              previousName: previous || item.previousName || '',
              nameChanges: used + 1,
              status: nextStatus,
              keepAccess: false,
              email: MEMBER_EMAIL,
              userAgent: meta.userAgent || item.userAgent || '',
              label: meta.label || item.label || 'Unknown',
              adminNote: nextStatus === 'edited' ? 'Name edited while logged out — needs re-approval' : item.adminNote || '',
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    )
    setDisplayName(name)
    setToast(
      nextStatus === 'edited'
        ? 'Name edited — admin approval required before sign in'
        : 'Name updated — waiting for admin approval'
    )
    return { ok: true, status: nextStatus }
  }

  const value = {
    user,
    tickets,
    savedIds,
    cart,
    orders,
    customEvents,
    allEvents,
    location,
    displayName,
    unread,
    notifOpen,
    setNotifOpen,
    toast,
    query,
    setQuery,
    category,
    setCategory,
    month,
    setMonth,
    sort,
    setSort,
    view,
    setView,
    notifications,
    deviceId,
    devices,
    thisDevice,
    deviceStatus,
    canUseApp,
    activeSessionDeviceId,
    adminUnlocked,
    notify: (message) => setToast(message),
    getEventById: (id) => allEvents.find((event) => event.id === id),
    signUpDevice: (fullName) => {
      const name = String(fullName || '').trim()
      if (name.length < 2) return { ok: false, error: 'Enter your full name.' }
      const now = new Date().toISOString()
      const meta = detectDeviceMeta()
      const existing = devices.find((item) => item.id === deviceId)
      if (existing && FORCE_LOGOUT_STATUSES.includes(existing.status)) {
        return { ok: false, error: `This device is ${statusLabel(existing.status)}.` }
      }
      if (existing) {
        return applyNameChange(existing, name)
      }
      setDevices((prev) => [
        {
          id: deviceId,
          name,
          email: MEMBER_EMAIL,
          status: 'pending',
          createdAt: now,
          updatedAt: now,
          lastLoginAt: null,
          adminNote: '',
          subscribeProof: null,
          subscribeNote: '',
          subscribeFileName: '',
          nameChanges: 0,
          previousName: '',
          keepAccess: false,
          userAgent: meta.userAgent,
          label: meta.label,
        },
        ...prev,
      ])
      setDisplayName(name)
      setToast('Submitted for admin approval')
      return { ok: true, status: 'pending' }
    },
    changeDeviceName: (fullName) => {
      const name = String(fullName || '').trim()
      if (name.length < 2) return { ok: false, error: 'Enter a name with at least 2 characters.' }
      const existing = devices.find((item) => item.id === deviceId)
      if (!existing) return { ok: false, error: 'Register this device first.' }
      if (FORCE_LOGOUT_STATUSES.includes(existing.status)) {
        return { ok: false, error: `This device is ${statusLabel(existing.status)}.` }
      }
      return applyNameChange(existing, name)
    },
    signInDevice: () => {
      const record = devices.find((item) => item.id === deviceId)
      if (!record) {
        return { ok: false, error: 'No signup on this device. Create an account first.' }
      }
      if (record.status === 'pending') {
        return { ok: false, error: 'Waiting for admin approval.', status: 'pending' }
      }
      if (record.status === 'edited') {
        return {
          ok: false,
          error: 'Name was changed while logged out — waiting for admin approval.',
          status: 'edited',
        }
      }
      if (record.status === 'rejected') {
        return { ok: false, error: 'This device was rejected by admin.', status: 'rejected' }
      }
      if (record.status === 'blocked') {
        return { ok: false, error: 'This device is blocked.', status: 'blocked' }
      }
      if (record.status === 'suspended') {
        return { ok: false, error: 'This device is suspended.', status: 'suspended' }
      }
      if (record.status === 'subscribe' || record.status === 'subscribe_pending') {
        return {
          ok: false,
          error: 'Subscription required before you can use GoLive.',
          status: record.status,
          redirect: '/subscribe',
        }
      }
      if (record.status !== 'allowed') {
        return { ok: false, error: 'This device cannot sign in yet.', status: record.status }
      }

      // Same allowed device can sign back in without another admin approval.
      const meta = detectDeviceMeta()
      setUser({ name: record.name, email: MEMBER_EMAIL, deviceId })
      setDisplayName(record.name)
      setActiveSessionDeviceId(deviceId)
      patchDevice(deviceId, {
        lastLoginAt: new Date().toISOString(),
        keepAccess: true,
        email: MEMBER_EMAIL,
        userAgent: meta.userAgent || record.userAgent,
        label: meta.label || record.label,
      })
      setToast('Signed in')
      return { ok: true, status: 'allowed' }
    },
    signOut: () => {
      if (activeSessionDeviceId === deviceId) setActiveSessionDeviceId(null)
      setUser(null)
    },
    unlockAdmin: () => {
      setAdminUnlocked(true)
      saveAdminSession(true)
      setToast('Admin signed in')
    },
    lockAdmin: () => {
      // Admin stays signed in permanently — lock is disabled.
    },
    setDeviceStatus: (id, status, note = '') => {
      const patch = {
        status,
        adminNote: note,
      }
      if (status === 'allowed') {
        patch.keepAccess = true
        patch.adminNote = note || ''
      }
      if (FORCE_LOGOUT_STATUSES.includes(status)) {
        patch.keepAccess = false
      }
      patchDevice(id, patch)
      if (FORCE_LOGOUT_STATUSES.includes(status) || status === 'subscribe') {
        if (activeSessionDeviceId === id) setActiveSessionDeviceId(null)
        if (deviceId === id) setUser(null)
      }
      setToast(`Device marked ${statusLabel(status)}`)
    },
    deleteDevice: (id) => {
      setDevices((prev) => prev.filter((item) => item.id !== id))
      if (activeSessionDeviceId === id) setActiveSessionDeviceId(null)
      if (deviceId === id) setUser(null)
      setToast('Device deleted')
    },
    submitSubscribeProof: (proof) => {
      if (!thisDevice) return { ok: false, error: 'Sign up on this device first.' }
      patchDevice(deviceId, {
        status: 'subscribe_pending',
        subscribeProof: proof.image,
        subscribeNote: proof.note || '',
        subscribeFileName: proof.fileName || '',
      })
      setToast('Subscription proof submitted')
      return { ok: true }
    },
    setLocation: (next) => setLocation(String(next || '').trim() || 'Kuala Lumpur'),
    setDisplayName: (next) => {
      const name = String(next || '').trim() || 'GoLive User'
      setDisplayName(name)
      setUser((prev) => (prev ? { ...prev, name } : prev))
    },
    markRead: () => setUnread(false),
    toggleSave: (id) =>
      setSavedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id])),
    addTicket: (ticket) =>
      setTickets((prev) => [
        {
          status: 'confirmed',
          ...ticket,
        },
        ...prev,
      ]),
    upsertEvent: (event) => {
      setDeletedEventIds((prev) => prev.filter((item) => item !== event.id))
      setCustomEvents((prev) => {
        const index = prev.findIndex((item) => item.id === event.id)
        if (index === -1) return [event, ...prev]
        const next = [...prev]
        next[index] = event
        return next
      })
    },
    deleteEvent: (id) => {
      setCustomEvents((prev) => prev.filter((event) => event.id !== id))
      setDeletedEventIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
      setSavedIds((prev) => prev.filter((item) => item !== id))
    },
    addToCart: (productId) => {
      setCart((prev) => {
        const found = prev.find((item) => item.productId === productId)
        if (!found) return [...prev, { productId, qty: 1 }]
        return prev.map((item) =>
          item.productId === productId ? { ...item, qty: Math.min(8, item.qty + 1) } : item
        )
      })
      setToast('Added to bag')
    },
    changeQty: (productId, qty) => {
      setCart((prev) => {
        if (qty <= 0) return prev.filter((item) => item.productId !== productId)
        return prev.map((item) => (item.productId === productId ? { ...item, qty } : item))
      })
    },
    checkoutCart: () => {
      if (!cart.length) return
      setOrders((prev) => [
        {
          id: `OR-${Date.now().toString(36).toUpperCase()}`,
          items: cart,
          at: new Date().toISOString(),
        },
        ...prev,
      ])
      setCart([])
      setToast('Order placed')
    },
    resetFilters: () => {
      setQuery('')
      setCategory('All')
      setMonth('all')
      setSort('soonest')
    },
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
