import { rm } from '../data'
import { Pattern } from './Pattern'

function formatTicketDate(event, ticket) {
  const raw = ticket.dateText || event.dateText || event.dateLabel || ''
  if (!raw) return '—'
  // Prefer a clean label like "9 December 2026 (GMT+8)"
  if (/GMT/i.test(raw)) return raw
  return `${raw.replace(/\s*·\s*.*$/, '').trim()} (GMT+8)`
}

function formatTicketTime(event, ticket) {
  const show = ticket.showTime || event.showTime || ''
  if (show) return /GMT/i.test(show) ? show : `${show} (GMT+8)`
  const fromDate = String(ticket.dateText || event.dateText || '')
  const match = fromDate.match(/(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i)
  if (match) return `${match[1].toUpperCase()} (GMT+8)`
  return event.dateLabel || '—'
}

function ticketNo(ticket, index) {
  const raw = ticket.code || ticket.id || ''
  return String(raw).toUpperCase()
}

function orderId(ticket) {
  return String(ticket.orderRef || ticket.id || '—').toUpperCase()
}

function categoryLabel(ticket, event) {
  const tier = ticket.tier || event.category || 'General'
  return String(tier).toUpperCase()
}

export function TicketFace({ event, ticket, index = 0, compact = false }) {
  const n = String(index + 1).padStart(2, '0')
  const venue = event.venue || event.city || '—'
  const price = ticket.total != null ? rm(ticket.total) : ticket.subtotal != null ? rm(ticket.subtotal) : '—'
  const holder = ticket.holderName || '—'
  const category = categoryLabel(ticket, event)
  const dateLabel = formatTicketDate(event, ticket)
  const timeLabel = formatTicketTime(event, ticket)

  return (
    <article className={`stub-ticket ${compact ? 'compact' : ''}`}>
      <h3 className="stub-ticket-label">TICKET {n}</h3>
      <div className="stub-ticket-card">
        <div className="stub-ticket-ids">
          <div>
            <span>TICKET NO</span>
            <strong>{ticketNo(ticket, index)}</strong>
          </div>
          <div>
            <span>ORDER ID</span>
            <strong>{orderId(ticket)}</strong>
          </div>
        </div>

        <div className="stub-ticket-block">
          <span>PRICE</span>
          <strong className="stub-price">{price}</strong>
        </div>

        <div className="stub-ticket-block">
          <span>PARTICIPANT</span>
          <strong>{holder}</strong>
        </div>

        <div className="stub-banner" aria-hidden="true">
          <em>🇲🇾</em>
          <span>{category}</span>
        </div>

        <div className="stub-pills">
          <span>{venue}</span>
          <span>{dateLabel}</span>
          <span>{timeLabel}</span>
        </div>

        <div className="stub-ticket-block">
          <span>CATEGORY</span>
          <strong className="stub-cat">{category}</strong>
        </div>

        <p className="stub-later">Ticket details will be provided at a later date.</p>
        <div className="stub-perforation" aria-hidden="true" />
      </div>

      {!compact && (
        <div className="stub-qr">
          <Pattern code={ticket.code} />
          <p className="code">{ticket.code}</p>
        </div>
      )}
    </article>
  )
}
