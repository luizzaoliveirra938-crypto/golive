import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from './Icons'

export default function Sheet({ title, onClose, children }) {
  const [host, setHost] = useState(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    setHost(document.getElementById('phone'))
  }, [])

  useEffect(() => {
    if (!host) return undefined
    const locks = Number(host.dataset.locks || 0) + 1
    host.dataset.locks = String(locks)
    host.classList.add('is-locked')
    const onKey = (event) => {
      if (event.key === 'Escape') onCloseRef.current()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      const next = Number(host.dataset.locks || 1) - 1
      host.dataset.locks = String(Math.max(0, next))
      if (next <= 0) host.classList.remove('is-locked')
      window.removeEventListener('keydown', onKey)
    }
  }, [host])

  if (!host) return null

  return createPortal(
    <>
      <div className="overlay" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title}>
        <div className="handle" />
        <div className="sheet-head">
          <h2>{title}</h2>
          <button type="button" className="icon-btn" aria-label="Close" onClick={onClose}>
            <Icon name="close" size={20} />
          </button>
        </div>
        {children}
      </div>
    </>,
    host
  )
}

export function Dock({ children }) {
  const [host, setHost] = useState(null)
  useEffect(() => setHost(document.getElementById('phone')), [])
  if (!host) return null
  return createPortal(<div className="dock">{children}</div>, host)
}
