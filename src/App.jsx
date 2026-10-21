import { useEffect, useLayoutEffect, useRef } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Sheet from './components/Sheet'
import { DeviceGate } from './components/DeviceGate'
import { useApp } from './context'
import Home from './pages/Home'
import Discover from './pages/Discover'
import Store from './pages/Store'
import Tickets from './pages/Tickets'
import Account from './pages/Account'
import ManageEvents from './pages/ManageEvents'
import EventEditor from './pages/EventEditor'
import EventDetail from './pages/EventDetail'
import Checkout from './pages/Checkout'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Subscribe from './pages/Subscribe'
import AdminDevices from './pages/AdminDevices'
import AdminLogin from './pages/AdminLogin'
import Legal from './pages/Legal'

const titles = {
  '/': 'Home',
  '/discover': 'Discover',
  '/store': 'Store',
  '/tickets': 'Tickets',
  '/account': 'Account',
  '/account/events': 'Manage events',
  '/account/events/new': 'Add event',
  '/signin': 'Sign in',
  '/signup': 'Sign up',
  '/subscribe': 'Subscribe',
  '/admin': 'Admin',
  '/admin/login': 'Admin login',
}

function Missing() {
  return (
    <div className="empty">
      <h3>That page isn&apos;t here</h3>
      <Link to="/" className="btn">
        Go home
      </Link>
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const scroller = useRef(null)
  const { toast, notifications, notifOpen, setNotifOpen, canUseApp } = useApp()
  const hideNav =
    !canUseApp ||
    /^\/event\/|^\/signin$|^\/signup$|^\/subscribe$|^\/admin(\/login)?$|^\/legal\/|^\/account\/events/.test(
      location.pathname
    )

  useLayoutEffect(() => {
    scroller.current?.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    const label =
      titles[location.pathname] ||
      (location.pathname.endsWith('/edit') ? 'Edit event' : null)
    if (label) document.title = `${label} · GoLive`
  }, [location.pathname])

  return (
    <div className="stage">
      <div className={hideNav ? 'phone' : 'phone has-nav'} id="phone">
        <div className={hideNav ? 'screen screen-fill' : 'screen'} ref={scroller}>
          <DeviceGate>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/store" element={<Store />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/account" element={<Account />} />
              <Route path="/account/events" element={<ManageEvents />} />
              <Route path="/account/events/new" element={<EventEditor />} />
              <Route path="/account/events/:id/edit" element={<EventEditor />} />
              <Route path="/event/:id" element={<EventDetail />} />
              <Route path="/event/:id/checkout" element={<Checkout />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/subscribe" element={<Subscribe />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDevices />} />
              <Route path="/legal/:doc" element={<Legal />} />
              <Route path="*" element={<Missing />} />
            </Routes>
          </DeviceGate>
        </div>
        {!hideNav && <BottomNav />}
        {toast && (
          <div className="toast" role="status">
            {toast}
          </div>
        )}
        {notifOpen && (
          <Sheet title="Notifications" onClose={() => setNotifOpen(false)}>
            <ul className="notif-list">
              {notifications.map((item) => (
                <li key={item.id}>
                  <Link to={item.href} onClick={() => setNotifOpen(false)}>
                    <strong>{item.title}</strong>
                    <span>{item.body}</span>
                    <em>{item.time}</em>
                  </Link>
                </li>
              ))}
            </ul>
          </Sheet>
        )}
      </div>
    </div>
  )
}
