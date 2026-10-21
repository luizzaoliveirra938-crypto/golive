import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context'
import { deviceLabel, statusLabel } from '../auth'

const OPEN_PATHS = ['/signin', '/signup', '/subscribe', '/admin', '/admin/login', '/legal']

export function DeviceGate({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, canUseApp, thisDevice, deviceStatus, deviceId, signOut } = useApp()
  const path = location.pathname
  const isOpen = OPEN_PATHS.some((item) => path === item || path.startsWith(`${item}/`))

  useEffect(() => {
    if (isOpen) return
    if (!thisDevice) {
      navigate('/signup', { replace: true })
      return
    }
    if (deviceStatus === 'subscribe' || deviceStatus === 'subscribe_pending') {
      navigate('/subscribe', { replace: true })
      return
    }
    if (!canUseApp) {
      navigate('/signin', { replace: true, state: { from: path } })
    }
  }, [isOpen, thisDevice, deviceStatus, canUseApp, navigate, path])

  if (isOpen) return children
  if (!thisDevice || !canUseApp) {
    const heading = !thisDevice
      ? 'Device not registered'
      : deviceStatus === 'edited'
        ? 'Name changed — waiting for approval'
        : statusLabel(deviceStatus)
    return (
      <div className="page auth">
        <div className="pad empty">
          <h3>{heading}</h3>
          <p className="hint">
            {deviceLabel(deviceId)}
            {thisDevice ? ` · ${thisDevice.name}` : ''}
          </p>
          {user && (
            <button type="button" className="btn ghost" onClick={signOut}>
              Sign out
            </button>
          )}
        </div>
      </div>
    )
  }
  return children
}
