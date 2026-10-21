import { NavLink } from 'react-router-dom'
import { useApp } from '../context'
import { Icon } from './Icons'
import { Logo } from './Logo'

const tabs = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/store', label: 'Store', icon: 'cart' },
  { to: '/discover', label: 'Discover', icon: 'discover' },
  { to: '/tickets', label: 'Tickets', icon: 'ticket' },
  { to: '/account', label: 'Account', icon: 'user' },
]

export default function BottomNav() {
  const { cart, location } = useApp()
  const count = cart.reduce((sum, item) => sum + item.qty, 0)

  return (
    <nav className="tabbar" aria-label="Primary">
      <div className="side-brand">
        <Logo />
        <p>Live events in {location}</p>
      </div>
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) => (isActive ? 'tab active' : 'tab')}
        >
          {({ isActive }) => (
            <>
              <span className="tab-ico">
                <Icon name={tab.icon} filled={isActive && tab.icon === 'discover'} />
                {tab.to === '/store' && count > 0 && <i className="tab-count">{count}</i>}
              </span>
              {tab.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
