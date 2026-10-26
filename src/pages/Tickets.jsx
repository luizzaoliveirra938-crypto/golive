import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context'
import { Icon } from '../components/Icons'
import { TopBar } from '../components/TopBar'
import Sheet from '../components/Sheet'
import { TicketFace } from '../components/TicketFace'
import { Receipt } from '../components/Receipt'
import { ListCard } from '../components/Cards'
import { Pattern } from '../components/Pattern'

export default function Tickets() {
  const navigate = useNavigate()
  const { tickets, savedIds, allEvents, getEventById, notify } = useApp()
  const [tab, setTab] = useState('tickets')
  const [activeEventId, setActiveEventId] = useState(null)
  const [ticketIndex, setTicketIndex] = useState(0)
  const [showReceipt, setShowReceipt] = useState(false)
  const [showQr, setShowQr] = useState(false)
  const saved = allEvents.filter((event) => savedIds.includes(event.id))

  const groups = useMemo(() => {
    const map = new Map()
    tickets.forEach((ticket) => {
      const list = map.get(ticket.eventId) || []
      list.push(ticket)
      map.set(ticket.eventId, list)
    })
    return [...map.entries()]
      .map(([eventId, items]) => ({ event: getEventById(eventId), tickets: items }))
      .filter((group) => group.event)
  }, [tickets, getEventById])

  const activeGroup = groups.find((group) => group.event.id === activeEventId) || null
  const activeTickets = activeGroup?.tickets || []
  const activeTicket = activeTickets[ticketIndex] || activeTickets[0] || null
  const activeEvent = activeGroup?.event || null

  function openGroup(eventId) {
    setActiveEventId(eventId)
    setTicketIndex(0)
    setShowReceipt(false)
    setShowQr(false)
  }

  function formatPillDate(event) {
    const raw = event.dateText || event.dateLabel || ''
    if (/GMT/i.test(raw)) return raw
    const cleaned = raw.replace(/\s*·\s*.*$/, '').trim()
    return cleaned ? `${cleaned} (GMT+8)` : event.dateLabel
  }

  function formatPillTime(event) {
    if (event.showTime) return /GMT/i.test(event.showTime) ? event.showTime : `${event.showTime} (GMT+8)`
    const match = String(event.dateText || '').match(/(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i)
    return match ? `${match[1].toUpperCase()} (GMT+8)` : '—'
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

      {tab === 'tickets' && groups.length === 0 && (
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

      {tab === 'tickets' && groups.length > 0 && (
        <div className="pad stack">
          {groups.map(({ event, tickets: items }) => (
            <button key={event.id} type="button" className="ticket" onClick={() => openGroup(event.id)}>
              <img src={event.image} alt="" />
              <span>
                <small className="ok">
                  Confirmed · {items.length} ticket{items.length === 1 ? '' : 's'}
                </small>
                <strong>{event.artist}</strong>
                <em>{event.title}</em>
                <span className="pill-row">
                  <span className="outline-pill">{event.dateLabel}</span>
                  <span className="outline-pill">{event.venue}</span>
                </span>
              </span>
            </button>
          ))}
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

      {activeEvent && activeTicket && (
        <Sheet
          title={showReceipt ? 'Receipt' : 'Tickets'}
          onClose={() => {
            setActiveEventId(null)
            setShowQr(false)
          }}
        >
          {showReceipt ? (
            <>
              <Receipt event={activeEvent} ticket={activeTicket} />
              <button type="button" className="btn block" onClick={() => setShowReceipt(false)}>
                Back to ticket
              </button>
            </>
          ) : (
            <div className="ticket-sheet">
              <div className="ticket-hero">
                <img src={activeEvent.image} alt="" />
                <div className="ticket-hero-copy">
                  <button
                    type="button"
                    className="back-link"
                    onClick={() => {
                      setActiveEventId(null)
                      setShowQr(false)
                    }}
                  >
                    ← Back to Tickets
                  </button>
                  <span className="outline-pill teal">{String(activeEvent.category || 'Event').toUpperCase()}</span>
                  <h2>
                    {activeEvent.artist}: {activeEvent.title}
                  </h2>
                  <p>{activeEvent.title}</p>
                  <div className="stub-pills hero-pills">
                    <span>{formatPillDate(activeEvent)}</span>
                    <span>{activeEvent.venue}</span>
                    <span>{formatPillTime(activeEvent)}</span>
                  </div>
                </div>
              </div>

              <div className="ticket-sheet-head">
                <h3>Tickets</h3>
                <div className="ticket-sheet-actions">
                  <button
                    type="button"
                    className="btn slim ghost"
                    onClick={() => navigate(`/event/${activeEvent.id}`, { state: { fromTicket: true } })}
                  >
                    VIEW EVENT →
                  </button>
                  <button
                    type="button"
                    className="btn slim"
                    onClick={() => {
                      setShowReceipt(true)
                      notify('Open each ticket receipt to save or share')
                    }}
                  >
                    DOWNLOAD ALL
                  </button>
                </div>
              </div>

              {activeTickets.length > 1 && (
                <div className="ticket-switch" role="tablist" aria-label="Choose ticket">
                  {activeTickets.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={index === ticketIndex}
                      className={index === ticketIndex ? 'on' : ''}
                      onClick={() => {
                        setTicketIndex(index)
                        setShowQr(false)
                      }}
                    >
                      Ticket {String(index + 1).padStart(2, '0')}
                    </button>
                  ))}
                </div>
              )}

              <TicketFace event={activeEvent} ticket={activeTicket} index={ticketIndex} />

              <button
                type="button"
                className={`ticket-code ${showQr ? 'on' : ''}`}
                aria-expanded={showQr}
                aria-controls="ticket-gate-qr"
                onClick={() => setShowQr((open) => !open)}
              >
                {activeTicket.code}
              </button>

              {showQr && (
                <div className="stub-qr" id="ticket-gate-qr">
                  <Pattern code={activeTicket.code} />
                </div>
              )}

              <button type="button" className="btn ghost block" onClick={() => setShowReceipt(true)}>
                View receipt
              </button>
            </div>
          )}
        </Sheet>
      )}
    </div>
  )
}
