import { formatWhen, rm } from '../data'
import { Pattern } from './Pattern'

function Row({ label, value }) {
  if (!value && value !== 0) return null
  return (
    <div className="face-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export function TicketFace({ event, ticket }) {
  const admit = ticket.admit || event.admit || ticket.qty || 1
  const seating = [ticket.section || event.section, ticket.row || event.row, ticket.seat || event.seat]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="ticket-face">
      <div className="face-top">
        <div>
          <small>{event.category}</small>
          <h3>{event.artist}</h3>
          <p>{event.title}</p>
        </div>
        <span className="date-pill static">{event.dateLabel}</span>
      </div>

      <div className="face-grid">
        <Row label="Date & time" value={ticket.dateText || event.dateText} />
        <Row
          label="Doors / show"
          value={
            ticket.doorsTime || event.doorsTime || ticket.showTime || event.showTime
              ? `Doors ${ticket.doorsTime || event.doorsTime || '—'} · Show ${ticket.showTime || event.showTime || '—'}`
              : ''
          }
        />
        <Row label="Venue" value={event.venue} />
        <Row label="City" value={event.city} />
        <Row label="Address" value={ticket.address || event.address} />
        <Row label="Ticket type" value={ticket.tier} />
        <Row label="Section / row / seat" value={seating} />
        <Row label="Level" value={ticket.level || event.level} />
        <Row label="Gate" value={ticket.gate || event.gate} />
        <Row label="Entrance" value={ticket.entrance || event.entrance} />
        <Row label="Admit" value={`${admit} ${admit === 1 ? 'person' : 'people'}`} />
        <Row label="Age limit" value={ticket.ageLimit || event.ageLimit} />
        <Row label="Ticket holder" value={ticket.holderName || event.holderName} />
        <Row label="Order ref" value={ticket.orderRef || event.orderRef || ticket.id} />
        <Row label="Ticket price" value={ticket.subtotal != null ? rm(ticket.subtotal) : ''} />
        <Row label="Service fee" value={ticket.serviceFee != null ? rm(ticket.serviceFee) : ''} />
        <Row label="Ticket Protect" value={ticket.protect ? rm(ticket.protectFee || 0) : ''} />
        <Row label="Price paid" value={ticket.total != null ? rm(ticket.total) : ''} />
        <Row label="Payment" value={ticket.paymentMethod || ''} />
        <Row label="Purchased" value={ticket.purchasedAt ? formatWhen(ticket.purchasedAt) : ''} />
      </div>

      {(ticket.entryNotes || event.entryNotes) && (
        <p className="face-notes">{ticket.entryNotes || event.entryNotes}</p>
      )}

      <div className="qr-wrap">
        <Pattern code={ticket.code} />
      </div>
      <p className="code">{ticket.code}</p>
      <p className="hint">Present this ticket at the gate. Screenshot or keep the app open.</p>
    </div>
  )
}
