import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context'
import { Icon } from '../components/Icons'
import { TopBar } from '../components/TopBar'
import Sheet from '../components/Sheet'
import { TicketFace } from '../components/TicketFace'
import { Receipt } from '../components/Receipt'
import { ListCard } from '../components/Cards'

export default function Tickets() {
  const navigate = useNavigate()
  const { tickets, savedIds, allEvents, getEventById } = useApp()
  const [tab, setTab] = useState('tickets')
  const [active, setActive] = useState(null)
  const [showReceipt, setShowReceipt] = useState(false)
  const saved = allEvents.filter((event) => savedIds.includes(event.id))
  const activeEvent = active ? getEventById(active.eventId) : null

  function openTicket(ticket) {
    setActive(ticket)
    setShowReceipt(false)
  }

  return (
    <div className="page">
      <TopBar title="Tickets" />
      <div className="seg" role="tablist" aria-label="Ticket lists">
        <button type="button" className={tab === 'tickets' ? 'on' : ''} onClick={() => setTab('tickets')}>
          Tickets
        </button>
        <button type="button" className={tab === 'saved' ? 'on' : ''} onClick={() => setTab('saved')}>
          Saved
        </button>
      </div>

      {tab === 'tickets' && tickets.length === 0 && (
        <div className="empty">
          <div className="empty-mark" aria-hidden="true">
            <Icon name="ticket" size={28} />
          </div>
          <h3>No tickets yet</h3>
          <p>Buy from Discover. Tickets stay on this account with a receipt and gate QR.</p>
          <button type="button" className="btn" onClick={() => navigate('/discover')}>
            Browse events
          </button>
        </div>
      )}

      {tab === 'tickets' && tickets.length > 0 && (
        <div className="pad stack">
          {tickets.map((ticket) => {
            const event = getEventById(ticket.eventId)
            if (!event) return null
            const seatBits = [ticket.section, ticket.row, ticket.seat].filter(Boolean).join(' ')
            return (
              <button key={ticket.id} type="button" className="ticket" onClick={() => openTicket(ticket)}>
                <img src={event.image} alt="" />
                <span>
                  <small className="ok">Confirmed · {ticket.code}</small>
                  <strong>{event.artist}</strong>
                  <em>{event.title}</em>
                  <span className="pill-row">
                    <span className="outline-pill">{event.dateLabel}</span>
                    <span className="outline-pill">
                      {ticket.tier} × {ticket.qty}
                    </span>
                    {seatBits && <span className="outline-pill">{seatBits}</span>}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      )}

      {tab === 'saved' && saved.length === 0 && (
        <div className="empty">
          <h3>Nothing saved</h3>
          <p>Tap the heart on an event and it will wait for you here.</p>
          <button type="button" className="btn" onClick={() => navigate('/discover')}>
            Browse events
          </button>
        </div>
      )}

      {tab === 'saved' && saved.length > 0 && (
        <div className="card-grid list">
          {saved.map((event) => (
            <ListCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {active && activeEvent && (
        <Sheet title={showReceipt ? 'Receipt' : 'Your ticket'} onClose={() => setActive(null)}>
          {showReceipt ? (
            <>
              <Receipt event={activeEvent} ticket={active} />
              <button type="button" className="btn block" onClick={() => setShowReceipt(false)}>
                Back to ticket
              </button>
            </>
          ) : (
            <>
              <TicketFace event={activeEvent} ticket={active} />
              <button type="button" className="btn block" onClick={() => setShowReceipt(true)}>
                View receipt
              </button>
              <button
                type="button"
                className="btn ghost block"
                onClick={() => navigate(`/event/${activeEvent.id}`, { state: { fromTicket: true } })}
              >
                View event
              </button>
            </>
          )}
        </Sheet>
      )}
    </div>
  )
}
