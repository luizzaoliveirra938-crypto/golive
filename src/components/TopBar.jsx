import { useApp } from '../context'
import { Icon } from './Icons'
import { Logo } from './Logo'

export function NotifyButton() {
  const { unread, setNotifOpen, markRead } = useApp()
  return (
    <button
      type="button"
      className="icon-btn bell-wrap"
      aria-label="Notifications"
      onClick={() => {
        setNotifOpen(true)
        markRead()
      }}
    >
      <Icon name="bell" />
      {unread && <span className="dot" />}
    </button>
  )
}

export function TopBar({ title, children }) {
  return (
    <header className="top">
      <Logo />
      {title && <h1>{title}</h1>}
      {children}
      <NotifyButton />
    </header>
  )
}
