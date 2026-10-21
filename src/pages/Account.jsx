import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context'
import { statusLabel } from '../auth'
import { Icon } from '../components/Icons'
import { TopBar } from '../components/TopBar'
import Sheet from '../components/Sheet'

const SUGGESTED = ['Kuala Lumpur', 'Petaling Jaya', 'Shah Alam', 'Penang', 'Johor Bahru', 'Singapore']

export default function Account() {
  const navigate = useNavigate()
  const {
    user,
    signOut,
    allEvents,
    location,
    setLocation,
    displayName,
    notify,
    thisDevice,
    deviceStatus,
    changeDeviceName,
  } = useApp()
  const [confirm, setConfirm] = useState(false)
  const [sheet, setSheet] = useState(null)
  const [draft, setDraft] = useState('')
  const [nameError, setNameError] = useState('')

  function openSheet(kind) {
    setDraft(kind === 'name' ? thisDevice?.name || displayName : location)
    setNameError('')
    setSheet(kind)
  }

  function saveSheet() {
    const next = draft.trim()
    if (next.length < 2) return
    if (sheet === 'name') {
      const result = changeDeviceName(next)
      if (!result.ok) {
        setNameError(result.error)
        return
      }
      setSheet(null)
      return
    }
    setLocation(next)
    notify('Location updated')
    setSheet(null)
  }

  return (
    <div className="page account-page">
      <TopBar title="Dashboard" />
      <h2 className="page-title">Dashboard</h2>

      <section className="block">
        <p className="kicker">ACCOUNT</p>
        <div className="account-row">
          <div className="avatar navy" aria-hidden="true">
            {(displayName || user?.name || 'G').slice(0, 1).toUpperCase()}
          </div>
          <div className="who-copy">
            <div className="guest-name">{user ? displayName || user.name : 'Guest'}</div>
            <div className="muted">{user ? user.email : 'Not signed in'}</div>
          </div>
          {user ? (
            <button type="button" className="btn ghost slim" onClick={() => setConfirm(true)}>
              Sign out
            </button>
          ) : (
            <button type="button" className="btn slim" onClick={() => navigate('/signin', { state: { from: '/account' } })}>
              Sign In
            </button>
          )}
        </div>
        {thisDevice && (
          <p className="muted account-device-status">
            Device status: {statusLabel(deviceStatus)} · {thisDevice.name}
          </p>
        )}
      </section>

      <section className="block terms">
        <p className="kicker">PROFILE</p>
        <button type="button" className="term" onClick={() => openSheet('name')}>
          <span>
            <strong>Sign-up name</strong>
            <small>
              {thisDevice?.name || displayName}
              {thisDevice ? ` · changes ${thisDevice.nameChanges || 0}/2` : ''}
            </small>
          </span>
          <Icon name="chevron" size={18} />
        </button>
        <button type="button" className="term" onClick={() => openSheet('location')}>
          <span>
            <strong>Home city</strong>
            <small>{location}</small>
          </span>
          <Icon name="chevron" size={18} />
        </button>
      </section>

      <section className="block terms">
        <p className="kicker">EVENTS</p>
        <button type="button" className="term" onClick={() => navigate('/account/events')}>
          <span>
            <strong>Manage events</strong>
            <small>Add, edit, or delete shows · {allEvents.length} listed</small>
          </span>
          <Icon name="chevron" size={18} />
        </button>
      </section>

      <section className="block terms">
        <p className="kicker">TERMS</p>
        <button type="button" className="term" onClick={() => navigate('/legal/terms')}>
          <span>
            <strong>Terms of Use</strong>
            <small>View Terms of Use</small>
          </span>
          <Icon name="chevron" size={18} />
        </button>
        <button type="button" className="term" onClick={() => navigate('/legal/privacy')}>
          <span>
            <strong>Privacy Policy</strong>
            <small>View Privacy Policy</small>
          </span>
          <Icon name="chevron" size={18} />
        </button>
      </section>

      <p className="version">v2.3.11 (164)</p>

      {sheet === 'name' && (
        <Sheet title="Sign-up name" onClose={() => setSheet(null)}>
          <label className="field editor-field">
            <span>Name</span>
            <input
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value)
                setNameError('')
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  saveSheet()
                }
              }}
              placeholder="Name for approval"
              autoFocus
              className={nameError ? 'bad' : ''}
            />
            {nameError && <em className="err">{nameError}</em>}
          </label>
          <button type="button" className="btn block" disabled={draft.trim().length < 2} onClick={saveSheet}>
            Save name
          </button>
        </Sheet>
      )}

      {sheet === 'location' && (
        <Sheet title="Home city" onClose={() => setSheet(null)}>
          <p className="sheet-lead">This is the location shown under your name on Home.</p>
          <label className="field editor-field">
            <span>City or area</span>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  saveSheet()
                }
              }}
              placeholder="Kuala Lumpur"
              autoFocus
            />
          </label>
          <div className="suggest-row">
            {SUGGESTED.map((city) => (
              <button
                key={city}
                type="button"
                className={draft === city ? 'chip on' : 'chip'}
                onClick={() => setDraft(city)}
              >
                {city}
              </button>
            ))}
          </div>
          <button type="button" className="btn block" disabled={draft.trim().length < 2} onClick={saveSheet}>
            Save location
          </button>
        </Sheet>
      )}

      {confirm && (
        <Sheet title="Sign out" onClose={() => setConfirm(false)}>
          <p className="sheet-lead">Sign out of {user?.email}? Your tickets stay on this device.</p>
          <button
            type="button"
            className="btn block"
            onClick={() => {
              signOut()
              setConfirm(false)
            }}
          >
            Sign out
          </button>
          <button type="button" className="btn ghost block sheet-reset" onClick={() => setConfirm(false)}>
            Cancel
          </button>
        </Sheet>
      )}
    </div>
  )
}
