import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context'
import { deviceLabel, MEMBER_EMAIL, MEMBER_PASSWORD, statusLabel } from '../auth'
import { Icon } from '../components/Icons'

export default function SignIn() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signInDevice, user, canUseApp, thisDevice, deviceId, deviceStatus } = useApp()
  const [error, setError] = useState('')
  const justSignedUp = Boolean(location.state?.justSignedUp)

  useEffect(() => {
    if (user && canUseApp) navigate(location.state?.from || '/', { replace: true })
  }, [user, canUseApp, navigate, location.state])

  async function submit(event) {
    event.preventDefault()
    const result = await signInDevice()
    if (!result.ok) {
      setError(result.error)
      if (result.redirect) {
        navigate(result.redirect, { replace: true })
      }
      return
    }
    navigate(location.state?.from || '/', { replace: true })
  }

  return (
    <div className="page auth">
      <header className="subhead">
        <button type="button" className="icon-btn" aria-label="Back" onClick={() => navigate(-1)}>
          <Icon name="back" />
        </button>
        <h1>Sign in</h1>
      </header>
      <form className="pad" onSubmit={submit} noValidate>
        <p className="lede tight">
          {justSignedUp
            ? 'Your name is in — hang tight until admin allows this device, then hit Sign in. Good luck ❤️🎉'
            : 'Hey Bomb — one device, one seat at the table. Sign in when you’re cleared, and the show’s yours. Good luck ❤️🎉'}
        </p>
        <div className="device-chip">{deviceLabel(deviceId)}</div>
        {thisDevice && (
          <div className="auth-status">
            <span>Name</span>
            <strong>{thisDevice.name}</strong>
            <span>Status</span>
            <strong>{statusLabel(deviceStatus)}</strong>
          </div>
        )}
        {!thisDevice && <p className="banner">No signup on this device yet. Create an account first.</p>}
        <label className="field">
          <span>Email</span>
          <input type="email" value={MEMBER_EMAIL} readOnly tabIndex={-1} />
        </label>
        <label className="field">
          <span>Password</span>
          <input type="password" value={MEMBER_PASSWORD} readOnly tabIndex={-1} autoComplete="off" />
        </label>
        {error && <em className="err block-err">{error}</em>}
        <button type="submit" className="btn block" disabled={!thisDevice}>
          Sign in
        </button>
        {(deviceStatus === 'subscribe' || deviceStatus === 'subscribe_pending') && (
          <button type="button" className="btn ghost block" onClick={() => navigate('/subscribe')}>
            Open subscription payment
          </button>
        )}
        <p className="hint">
          Need approval?{' '}
          <Link className="text-link" to="/signup">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}
