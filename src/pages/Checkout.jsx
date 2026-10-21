import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  MAX_TICKETS,
  PROTECT_FEE,
  assignBestSeats,
  paymentMethods,
  priceBreakdown,
  rm,
  ticketFaceFromEvent,
  uid,
} from '../data'
import { useApp } from '../context'
import { Icon } from '../components/Icons'
import { Receipt } from '../components/Receipt'

const STEPS = ['Tickets', 'Review', 'Details', 'Pay']

export default function Checkout() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEventById, addTicket, user, displayName, notify } = useApp()
  const event = getEventById(id)

  const [step, setStep] = useState(0)
  const [tierId, setTierId] = useState(event?.tiers[0]?.id)
  const [qty, setQty] = useState(1)
  const [protect, setProtect] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [paymentId, setPaymentId] = useState('fpx')
  const [seconds, setSeconds] = useState(10 * 60)
  const [paying, setPaying] = useState(false)
  const [done, setDone] = useState(null)
  const [buyer, setBuyer] = useState({
    name: displayName || user?.name || '',
    email: user?.email || '',
    phone: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!event) return
    setTierId(event.tiers[0]?.id)
    document.title = `Buy · ${event.artist} · GoLive`
  }, [event])

  useEffect(() => {
    if (step < 3 || done || paying) return undefined
    if (seconds <= 0) return undefined
    const timer = setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000)
    return () => clearInterval(timer)
  }, [step, seconds, done, paying])

  const tier = useMemo(
    () => event?.tiers.find((item) => item.id === tierId) || event?.tiers[0],
    [event, tierId]
  )
  const seats = useMemo(
    () => (event && tier ? assignBestSeats(event, tier, qty) : null),
    [event, tier, qty]
  )
  const prices = useMemo(
    () => (tier ? priceBreakdown(tier.price, qty, protect) : null),
    [tier, qty, protect]
  )

  if (!event || !tier || !prices || !seats) {
    return (
      <div className="empty">
        <h3>Event unavailable</h3>
        <button type="button" className="btn" onClick={() => navigate('/discover')}>
          Back to Discover
        </button>
      </div>
    )
  }

  const postponed = event.status === 'postponed'
  const soldOut = event.status === 'soldout'
  const locked = postponed || soldOut || seconds <= 0
  const clock = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

  function validateDetails() {
    const next = {}
    if (buyer.name.trim().length < 2) next.name = 'Enter the ticket holder name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email.trim())) next.email = 'Enter a valid email.'
    if (buyer.phone.trim().replace(/\D/g, '').length < 8) next.phone = 'Enter a mobile number.'
    if (!agreed) next.agreed = 'Accept the ticketing terms to continue.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function nextStep() {
    if (step === 2 && !validateDetails()) return
    if (step === 3) {
      pay()
      return
    }
    setStep((value) => Math.min(STEPS.length - 1, value + 1))
  }

  function pay() {
    if (locked || paying) return
    if (!validateDetails()) {
      setStep(2)
      return
    }
    setPaying(true)
    window.setTimeout(() => {
      const orderRef = uid('BK')
      const face = ticketFaceFromEvent(event, {
        ...seats,
        holderName: buyer.name.trim(),
        orderRef,
        admit: qty,
      })
      const ticket = {
        id: uid('TK'),
        eventId: event.id,
        tier: tier.name,
        qty,
        total: prices.total,
        subtotal: prices.subtotal,
        serviceFee: prices.serviceFee,
        protectFee: prices.protectFee,
        protect,
        paymentMethod: paymentMethods.find((item) => item.id === paymentId)?.label || paymentId,
        buyerEmail: buyer.email.trim(),
        buyerPhone: buyer.phone.trim(),
        code: uid('GL'),
        purchasedAt: new Date().toISOString(),
        status: 'confirmed',
        ...face,
      }
      addTicket(ticket)
      setDone({ ...ticket, status: 'confirmed' })
      setPaying(false)
      notify('Purchase complete — ticket ready')
    }, 1100)
  }

  if (done) {
    return (
      <div className="page checkout-page">
        <header className="subhead">
          <button type="button" className="icon-btn" aria-label="Close" onClick={() => navigate('/tickets')}>
            <Icon name="close" />
          </button>
          <h1>Receipt</h1>
        </header>
        <div className="pad confirm-block">
          <div className="confirm-mark" aria-hidden="true">
            <Icon name="check" size={28} />
          </div>
          <h2>Purchase complete</h2>
          <p>
            Your tickets stay on this GoLive account and are not transferable. Keep this receipt, then open{' '}
            <strong>Tickets</strong> for your gate QR.
          </p>

          <Receipt event={event} ticket={done} />

          <button type="button" className="btn block" onClick={() => navigate('/tickets')}>
            Go to Tickets
          </button>
          <button
            type="button"
            className="btn ghost block sheet-reset"
            onClick={() => navigate(`/event/${event.id}`)}
          >
            Back to event
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page checkout-page">
      <header className="subhead">
        <button
          type="button"
          className="icon-btn"
          aria-label="Back"
          onClick={() => (step === 0 ? navigate(`/event/${event.id}`) : setStep((value) => value - 1))}
        >
          <Icon name="back" />
        </button>
        <h1>Buy tickets</h1>
      </header>

      <div className="pad">
        <div className="checkout-event">
          <img src={event.image} alt="" />
          <div>
            <strong>{event.artist}</strong>
            <em>{event.title}</em>
            <span>
              {event.dateLabel} · {event.venue}
            </span>
          </div>
        </div>

        <div className="step-rail" aria-label="Checkout steps">
          {STEPS.map((label, index) => (
            <div key={label} className={index === step ? 'step on' : index < step ? 'step done' : 'step'}>
              <i>{index + 1}</i>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {step === 3 && (
          <div className={seconds < 60 ? 'timer danger' : 'timer'}>
            Complete this step in <strong>{clock}</strong>
          </div>
        )}

        {(postponed || soldOut) && (
          <div className="banner">{postponed ? 'This show is postponed.' : 'This show is sold out.'}</div>
        )}
        {seconds <= 0 && step === 3 && (
          <div className="banner">Your hold expired. Go back and restart the purchase.</div>
        )}

        {step === 0 && (
          <section className="checkout-section">
            <h2>1. Ticket category</h2>
            <p className="section-hint">Choose your category and quantity. Max {MAX_TICKETS} tickets per booking.</p>
            {event.tiers.map((item) => (
              <button
                key={item.id}
                type="button"
                className={item.id === tier.id ? 'tier on' : 'tier'}
                disabled={locked}
                onClick={() => setTierId(item.id)}
              >
                <span className="tier-top">
                  <span>{item.name}</span>
                  <span>{rm(item.price)}</span>
                </span>
                <small>{item.note || 'Best available seats assigned at checkout'}</small>
              </button>
            ))}
            <div className="qty-line">
              <span>Quantity</span>
              <div className="stepper">
                <button type="button" aria-label="Decrease" disabled={locked} onClick={() => setQty((value) => Math.max(1, value - 1))}>
                  −
                </button>
                <strong>{qty}</strong>
                <button
                  type="button"
                  aria-label="Increase"
                  disabled={locked}
                  onClick={() => setQty((value) => Math.min(MAX_TICKETS, value + 1))}
                >
                  +
                </button>
              </div>
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="checkout-section">
            <h2>2. Review & seat assignment</h2>
            <p className="section-hint">
              Seats are assigned by GoLive based on the best available for your category. Seat maps are for location
              only and may change.
            </p>
            <div className="summary-card">
              <div className="sum-row">
                <span>Category</span>
                <strong>
                  {tier.name} × {qty}
                </strong>
              </div>
              <div className="sum-row">
                <span>Best available</span>
                <strong>
                  Sec {seats.section} · Row {seats.row} · Seat {seats.seat}
                  <small>
                    {seats.level} · {seats.gate}
                  </small>
                </strong>
              </div>
              <div className="sum-row">
                <span>Ticket price</span>
                <strong>{rm(prices.subtotal)}</strong>
              </div>
              <div className="sum-row">
                <span>Service fee</span>
                <strong>{rm(prices.serviceFee)}</strong>
              </div>
              {protect && (
                <div className="sum-row">
                  <span>Ticket Protect</span>
                  <strong>{rm(prices.protectFee)}</strong>
                </div>
              )}
              <div className="sum-row total">
                <span>Total</span>
                <strong>{rm(prices.total)}</strong>
              </div>
            </div>
            <label className={`protect ${protect ? 'on' : ''}`}>
              <input type="checkbox" checked={protect} onChange={(e) => setProtect(e.target.checked)} />
              <span>
                <strong>Add Ticket Protect</strong>
                <small>Optional cover for unexpected cancellation · {rm(PROTECT_FEE)} per ticket</small>
              </span>
            </label>
          </section>
        )}

        {step === 2 && (
          <section className="checkout-section">
            <h2>3. Buyer details</h2>
            <p className="section-hint">
              Tickets stay on this account and are not transferable. Your receipt uses the contact details below.
            </p>
            {!user && (
              <button
                type="button"
                className="btn ghost block"
                onClick={() => navigate('/signin', { state: { from: `/event/${event.id}/checkout` } })}
              >
                Sign in for faster checkout
              </button>
            )}
            <label className="field editor-field">
              <span>Ticket holder name</span>
              <input
                value={buyer.name}
                className={errors.name ? 'bad' : ''}
                onChange={(e) => setBuyer((prev) => ({ ...prev, name: e.target.value }))}
              />
              {errors.name && <em className="err">{errors.name}</em>}
            </label>
            <label className="field editor-field">
              <span>Email</span>
              <input
                type="email"
                value={buyer.email}
                className={errors.email ? 'bad' : ''}
                onChange={(e) => setBuyer((prev) => ({ ...prev, email: e.target.value }))}
              />
              {errors.email && <em className="err">{errors.email}</em>}
            </label>
            <label className="field editor-field">
              <span>Mobile number</span>
              <input
                type="tel"
                inputMode="tel"
                value={buyer.phone}
                className={errors.phone ? 'bad' : ''}
                placeholder="01X-XXX XXXX"
                onChange={(e) => setBuyer((prev) => ({ ...prev, phone: e.target.value }))}
              />
              {errors.phone && <em className="err">{errors.phone}</em>}
            </label>
            <label className="agree">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              <span>I agree to the Ticketing Terms and Conditions and event entry rules.</span>
            </label>
            {errors.agreed && <em className="err">{errors.agreed}</em>}
          </section>
        )}

        {step === 3 && (
          <section className="checkout-section">
            <h2>4. Payment</h2>
            <p className="section-hint">Complete purchase to confirm your tickets and get a receipt.</p>
            <div className="summary-card compact">
              <div className="sum-row total">
                <span>Amount due</span>
                <strong>{rm(prices.total)}</strong>
              </div>
            </div>
            <div className="pay-list">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  className={paymentId === method.id ? 'pay on' : 'pay'}
                  onClick={() => setPaymentId(method.id)}
                >
                  <span>
                    <strong>{method.label}</strong>
                    <small>{method.note}</small>
                  </span>
                  <Icon name="check" size={18} />
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="checkout-dock">
        <div>
          <small>{step === 3 ? 'Amount due' : 'Total'}</small>
          <strong>{rm(prices.total)}</strong>
        </div>
        <button type="button" className="btn" disabled={locked || paying} onClick={nextStep}>
          {paying
            ? 'Processing…'
            : step === 3
              ? 'Place booking'
              : step === 2
                ? 'Continue to payment'
                : 'Continue'}
        </button>
      </div>
    </div>
  )
}
