import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context'
import { MAX_NAME_CHANGES, MEMBER_EMAIL, statusLabel } from '../auth'
import { apiHealth } from '../deviceApi'
import { Icon } from '../components/Icons'

function formatCreated(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString(undefined, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  } catch {
    return iso
  }
}

function currentBadge(status) {
  if (status === 'allowed') return 'current allowed'
  if (status === 'edited') return 'edited while logged out'
  if (status === 'pending') return 'awaiting approval'
  if (status === 'subscribe_pending') return 'proof under review'
  return `current ${statusLabel(status)}`
}

export default function AdminDevices() {
  const navigate = useNavigate()
  const { devices, adminUnlocked, setDeviceStatus, deleteDevice, deviceId, activeSessionDeviceId } =
    useApp()
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [kvOk, setKvOk] = useState(null)

  useEffect(() => {
    if (!adminUnlocked) navigate('/admin/login', { replace: true })
  }, [adminUnlocked, navigate])

  useEffect(() => {
    let cancelled = false
    async function check() {
      const health = await apiHealth()
      if (!cancelled) setKvOk(Boolean(health.kv))
    }
    check()
    const timer = setInterval(check, 8000)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [])

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    const rank = (item) => {
      if (item.status === 'edited') return 0
      if (item.status === 'pending') return 1
      if (item.status === 'subscribe_pending') return 2
      return 3
    }
    const rows = [...devices].sort((a, b) => {
      const byStatus = rank(a) - rank(b)
      if (byStatus !== 0) return byStatus
      return Date.parse(b.updatedAt || b.createdAt || 0) - Date.parse(a.updatedAt || a.createdAt || 0)
    })
    if (!q) return rows
    return rows.filter(
      (item) =>
        String(item.name || '').toLowerCase().includes(q) ||
        String(item.previousName || '').toLowerCase().includes(q)
    )
  }, [devices, query])

  if (!adminUnlocked) {
    return (
      <div className="page auth">
        <div className="pad empty">
          <h3>Admin login required</h3>
          <button type="button" className="btn" onClick={() => navigate('/admin/login')}>
            Go to admin login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page admin-devices">
      <header className="admin-devices-top">
        <button type="button" className="icon-btn admin-back" aria-label="Back" onClick={() => navigate('/signin')}>
          <Icon name="back" />
        </button>
        <form
          className="admin-search-row"
          onSubmit={(event) => {
            event.preventDefault()
            setQuery(search)
          }}
        >
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Filter by sign-up name"
            aria-label="Filter by sign-up name"
          />
          <button type="submit" className="admin-search-btn">
            Search
          </button>
        </form>
      </header>

      <div className="pad admin-devices-body">
        <h1 className="admin-devices-title">Devices</h1>
        {kvOk === false && (
          <p className="admin-kv-warn">
            Shared device store is offline. On Netlify this uses Blobs automatically after deploy; on Cloudflare add a KV
            binding named <strong>GOLIVE_DEVICES</strong>. Until the store is live, phone signups will not appear here.
          </p>
        )}
        {kvOk === true && (
          <p className="admin-kv-ok">Live sync on — devices from phones show up here automatically.</p>
        )}

        {list.length === 0 ? (
          <div className="admin-empty">
            <h3>No devices here</h3>
            <p>
              {devices.length === 0
                ? 'Devices appear when someone signs up.'
                : 'Nothing matches this name. Clear search to see every device.'}
            </p>
          </div>
        ) : (
          <div className="admin-device-list">
            {list.map((item) => {
              const changes = item.nameChanges || 0
              const status = item.status || 'pending'
              const email = item.email || MEMBER_EMAIL
              return (
                <article key={item.id} className={`admin-device-card status-${status}`}>
                  <h2 className="admin-device-name">{item.name || 'Unnamed'}</h2>
                  {status === 'edited' && item.previousName ? (
                    <p className="admin-edited-was">
                      Edited from <strong>{item.previousName}</strong>
                    </p>
                  ) : null}
                  <a className="admin-device-email" href={`mailto:${email}`}>
                    {email}
                  </a>

                  <div className="admin-device-status-row">
                    <span className="admin-status-label">
                      Status: <em className={`tone-${status}`}>{statusLabel(status)}</em>
                    </span>
                    <span className={`admin-current-badge tone-${status}`}>{currentBadge(status)}</span>
                  </div>

                  <dl className="admin-device-meta">
                    <div>
                      <dt>Created:</dt>
                      <dd>{formatCreated(item.createdAt)}</dd>
                    </div>
                    <div>
                      <dt>Device id:</dt>
                      <dd>
                        <code>{item.id}</code>
                        <span className="admin-changes">
                          {' '}
                          changes: {changes}/{MAX_NAME_CHANGES}
                        </span>
                        {item.id === deviceId ? <span className="admin-tag"> · this device</span> : null}
                        {item.id === activeSessionDeviceId ? <span className="admin-tag"> · signed in</span> : null}
                      </dd>
                    </div>
                    <div>
                      <dt>Label:</dt>
                      <dd>{item.label || 'Unknown'}</dd>
                    </div>
                    <div>
                      <dt>UA:</dt>
                      <dd className="admin-ua">{item.userAgent || '—'}</dd>
                    </div>
                    {item.previousName ? (
                      <div>
                        <dt>Previous name:</dt>
                        <dd>{item.previousName}</dd>
                      </div>
                    ) : null}
                  </dl>

                  {item.subscribeProof && (
                    <div className="admin-proof">
                      <strong>Subscription proof</strong>
                      {item.subscribeProof.startsWith('data:application/pdf') ? (
                        <a href={item.subscribeProof} target="_blank" rel="noreferrer">
                          Open PDF · {item.subscribeFileName || 'proof.pdf'}
                        </a>
                      ) : (
                        <img src={item.subscribeProof} alt="Subscription proof" />
                      )}
                      {status === 'subscribe_pending' && (
                        <div className="admin-action-row">
                          <button
                            type="button"
                            className="admin-pill allow"
                            onClick={() => setDeviceStatus(item.id, 'allowed', 'Subscription accepted')}
                          >
                            Accept subscription
                          </button>
                          <button
                            type="button"
                            className="admin-pill"
                            onClick={() => setDeviceStatus(item.id, 'subscribe', 'Proof rejected — pay again')}
                          >
                            Reject proof
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="admin-action-row">
                    <button
                      type="button"
                      className="admin-pill allow"
                      onClick={() => setDeviceStatus(item.id, 'allowed', '')}
                    >
                      Allow
                    </button>
                    <button
                      type="button"
                      className="admin-pill"
                      onClick={() => setDeviceStatus(item.id, 'blocked', '')}
                    >
                      Block
                    </button>
                    <button
                      type="button"
                      className="admin-pill"
                      onClick={() => setDeviceStatus(item.id, 'suspended', '')}
                    >
                      Suspend
                    </button>
                    <button
                      type="button"
                      className="admin-pill"
                      onClick={() => setDeviceStatus(item.id, 'subscribe', 'Please subscribe to continue')}
                    >
                      Ask to subscribe
                    </button>
                  </div>
                  <div className="admin-action-row">
                    <button
                      type="button"
                      className="admin-pill danger"
                      onClick={() => {
                        if (window.confirm(`Delete device “${item.name}”? This cannot be undone.`)) {
                          deleteDevice(item.id)
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
