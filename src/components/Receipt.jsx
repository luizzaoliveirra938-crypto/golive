import { formatWhen, rm } from '../data'

export function Receipt({ event, ticket }) {
  const lines = [
    { label: `${ticket.tier} × ${ticket.qty}`, value: ticket.subtotal },
    { label: 'Service fee', value: ticket.serviceFee },
  ]
  if (ticket.protect) lines.push({ label: 'Ticket Protect', value: ticket.protectFee || 0 })

  return (
    <article className="receipt" aria-label="Booking receipt">
      <header className="receipt-top">
        <div>
          <p className="kicker">RECEIPT</p>
          <h3>GoLive booking</h3>
        </div>
        <strong>{ticket.orderRef || ticket.id}</strong>
      </header>

      <div className="receipt-event">
        <img src={event.image} alt="" />
        <div>
          <strong>{event.artist}</strong>
          <em>{event.title}</em>
          <span>{event.dateText}</span>
          <span>{event.venue}</span>
        </div>
      </div>

      <div className="receipt-meta">
        <div>
          <span>Ticket holder</span>
          <strong>{ticket.holderName || '—'}</strong>
        </div>
        <div>
          <span>Email</span>
          <strong>{ticket.buyerEmail || '—'}</strong>
        </div>
        <div>
          <span>Paid via</span>
          <strong>{ticket.paymentMethod || '—'}</strong>
        </div>
        <div>
          <span>Booked</span>
          <strong>{ticket.purchasedAt ? formatWhen(ticket.purchasedAt) : '—'}</strong>
        </div>
        <div>
          <span>Seats</span>
          <strong>
            Sec {ticket.section} · Row {ticket.row} · Seat {ticket.seat}
          </strong>
        </div>
        <div>
          <span>Status</span>
          <strong className="receipt-status ok-text">Confirmed</strong>
        </div>
      </div>

      <div className="receipt-lines">
        {lines.map((line) => (
          <div key={line.label} className="sum-row">
            <span>{line.label}</span>
            <strong>{rm(line.value || 0)}</strong>
          </div>
        ))}
        <div className="sum-row total">
          <span>Total</span>
          <strong>{rm(ticket.total)}</strong>
        </div>
      </div>
      <p className="receipt-foot">
        Tickets are non-transferable and stay on this GoLive account. Present your gate QR from Tickets at the venue.
      </p>
    </article>
  )
}
