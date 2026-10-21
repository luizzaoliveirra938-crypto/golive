import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { rm } from '../data'
import { useApp } from '../context'
import { Icon } from '../components/Icons'
import { Dock } from '../components/Sheet'
import { SeatMap } from '../components/SeatMap'
import { LocationMap } from '../components/LocationMap'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { savedIds, toggleSave, getEventById, tickets } = useApp()
  const event = getEventById(id)
  const ownedTickets = useMemo(
    () => tickets.filter((ticket) => ticket.eventId === id),
    [tickets, id]
  )

  useEffect(() => {
    if (!event) return
    document.title = `${event.artist} · GoLive`
  }, [event])

  if (!event) {
    return (
      <div className="empty">
        <h3>Event unavailable</h3>
        <button type="button" className="btn" onClick={() => navigate('/discover')}>
          Back to Discover
        </button>
      </div>
    )
  }

  const saved = savedIds.includes(event.id)
  const postponed = event.status === 'postponed'
  const soldOut = event.status === 'soldout'
  const locked = postponed || soldOut

  return (
    <div className="detail">
      <div className={`hero tone-${event.tone}`}>
        <img key={event.image} src={event.image} alt="" style={{ objectPosition: event.position }} />
        <div className="hero-actions">
          <button type="button" className="glass" aria-label="Back" onClick={() => navigate(-1)}>
            <Icon name="back" size={20} />
          </button>
          <button
            type="button"
            className={saved ? 'glass on' : 'glass'}
            aria-label={saved ? 'Remove from saved' : 'Save event'}
            aria-pressed={saved}
            onClick={() => toggleSave(event.id)}
          >
            <Icon name="heart" size={20} filled={saved} />
          </button>
        </div>
      </div>

      <div className="detail-body">
        {postponed && (
          <div className="banner">This show is postponed. Ticket sales are paused until a new date is announced.</div>
        )}
        {soldOut && <div className="banner">This show is sold out.</div>}
        <div className="kicker-row">
          <span className={`cat-pill cat-${event.category.toLowerCase()}`}>{event.category}</span>
          <span className="date-pill static">{event.dateLabel}</span>
        </div>
        <h1>{event.artist}</h1>
        <p className="title-lg">{event.title}</p>

        {ownedTickets.length > 0 && (
          <div className="booking-note">
            You already have tickets for this show on this account.{' '}
            <button type="button" className="text-link" onClick={() => navigate('/tickets')}>
              View tickets
            </button>
          </div>
        )}

        <div className="info-row">
          <Icon name="calendar" size={18} />
          <div>
            <strong>{event.dateText}</strong>
            <span>
              {event.doorsTime || event.showTime
                ? `Doors ${event.doorsTime || '—'} · Show ${event.showTime || '—'}`
                : 'Show time is local to the venue'}
            </span>
          </div>
        </div>
        <div className="info-row">
          <Icon name="pin" size={18} />
          <div>
            <strong>{event.venue}</strong>
            <span>{[event.city, event.address].filter(Boolean).join(' · ')}</span>
          </div>
        </div>
        <div className="info-row">
          <Icon name="ticket" size={18} />
          <div>
            <strong>From {rm(event.priceFrom)}</strong>
            <span>Prices exclude service fees · max 6 tickets per booking · non-transferable</span>
          </div>
        </div>

        <SeatMap event={event} />
        <LocationMap event={event} />

        {event.about && (
          <>
            <h2>About</h2>
            <p className="about">{event.about}</p>
          </>
        )}

        <h2>Ticket categories</h2>
        <p className="section-hint">Seat assignment uses best available for your chosen category at checkout.</p>
        {event.tiers.map((item) => (
          <div key={item.id} className="tier static-tier">
            <span className="tier-top">
              <span>{item.name}</span>
              <span>{rm(item.price)}</span>
            </span>
            <small>{item.note || 'Best available seating'}</small>
          </div>
        ))}

        <h2>Important</h2>
        <ul className="policy-list">
          <li>E-tickets stay in your GoLive account and cannot be transferred to another account.</li>
          <li>Resale or purchase from unauthorised sellers can void your tickets.</li>
          <li>Bring a matching ID for the ticket holder name at the gate.</li>
        </ul>
      </div>

      <Dock>
        <div>
          <small>From</small>
          <strong>{rm(event.priceFrom)}</strong>
        </div>
        <button
          type="button"
          className="btn"
          disabled={locked}
          onClick={() => navigate(`/event/${event.id}/checkout`)}
        >
          {postponed ? 'Postponed' : soldOut ? 'Sold out' : 'Buy tickets'}
        </button>
      </Dock>
    </div>
  )
}
