import { Link } from 'react-router-dom'
import { rm } from '../data'

function catClass(category) {
  return `cat-pill cat-${category.toLowerCase()}`
}

export function MediaCard({ event, variant }) {
  return (
    <Link to={`/event/${event.id}`} className={`media-card ${variant} tone-${event.tone}`}>
      <img key={event.image} src={event.image} alt="" style={{ objectPosition: event.position }} />
      <span className="grade" />
      <span className="date-pill">{event.dateLabel}</span>
      <span className="media-copy">
        <span className={catClass(event.category)}>{event.category}</span>
        <span className="title">{event.title}</span>
        <span className="artist">{event.artist}</span>
        {variant === 'discover' && (
          <span className="pill-row">
            <span className="outline-pill">{event.venue}</span>
            <span className="outline-pill">FROM {rm(event.priceFrom)}</span>
          </span>
        )}
      </span>
    </Link>
  )
}

export function ListCard({ event }) {
  const name = event.status === 'postponed' ? `[POSTPONED] ${event.artist}` : event.artist
  return (
    <Link to={`/event/${event.id}`} className={`list-card tone-${event.tone}`}>
      <img key={event.image} src={event.image} alt="" style={{ objectPosition: event.position }} />
      <span className="list-copy">
        <span className={catClass(event.category)}>{event.category}</span>
        <strong>{name}</strong>
        <em>{event.title}</em>
        <span className="pill-row">
          <span className="outline-pill">{event.dateLabel}</span>
          <span className="outline-pill">FROM {rm(event.priceFrom)}</span>
        </span>
      </span>
    </Link>
  )
}

export function RecentCard({ event }) {
  return (
    <Link to={`/event/${event.id}`} className="recent-card">
      <img key={event.image} src={event.image} alt="" style={{ objectPosition: event.position }} />
      <span>
        <strong>{event.recentTitle || event.artist}</strong>
        <em>{event.title}</em>
        <span className="pill-row">
          <span className="outline-pill">{event.dateLabel}</span>
          <span className="outline-pill">{event.venue}</span>
        </span>
      </span>
    </Link>
  )
}
