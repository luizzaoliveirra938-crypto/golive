import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context'
import { Icon } from '../components/Icons'
import { Logo } from '../components/Logo'
import { NotifyButton } from '../components/TopBar'
import { MediaCard, RecentCard } from '../components/Cards'

export default function Home() {
  const navigate = useNavigate()
  const { allEvents, location, displayName } = useApp()
  const featured = allEvents.filter((event) => event.featured).sort((a, b) => a.featuredRank - b.featuredRank)
  const upcoming = allEvents.filter((event) => event.upcoming).sort((a, b) => a.upcomingRank - b.upcomingRank)
  const recent = allEvents.filter((event) => event.recent)

  return (
    <div className="page">
      <header className="top">
        <Logo />
        <div className="who">
          <div className="avatar sm" aria-hidden="true">
            {displayName ? displayName.slice(0, 1).toUpperCase() : <Icon name="person" size={18} />}
          </div>
          <div className="who-copy">
            <div className="hello">Hello, {displayName}</div>
            <div className="loc">
              <Icon name="pin" size={12} /> {location}
            </div>
          </div>
        </div>
        <button
          type="button"
          className="icon-btn"
          aria-label="Search events"
          onClick={() => navigate('/discover', { state: { focus: true } })}
        >
          <Icon name="search" />
        </button>
        <NotifyButton />
      </header>

      <div className="section-head">
        <h2>Featured</h2>
        <Link to="/discover" className="arrow-link" aria-label="Browse all events">
          <Icon name="arrow" size={20} />
        </Link>
      </div>
      <div className="scroller feature-row">
        {featured.map((event) => (
          <MediaCard key={event.id} event={event} variant="feature" />
        ))}
      </div>

      <div className="section-head">
        <h2>Upcoming</h2>
      </div>
      <div className="scroller upcoming-row">
        {upcoming.map((event) => (
          <MediaCard key={event.id} event={event} variant="upcoming" />
        ))}
      </div>

      <div className="section-head">
        <h2>Recent Events</h2>
      </div>
      <div className="pad stack">
        {recent.map((event) => (
          <RecentCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
