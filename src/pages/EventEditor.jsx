import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  blankEventDraft,
  buildEventFromDraft,
  emptyTier,
  eventCategories,
  eventStatuses,
  eventTones,
  eventToDraft,
  isSeedEvent,
  makeDateLabel,
  ticketFaceFromEvent,
  uid,
} from '../data'
import { useApp } from '../context'
import { Icon } from '../components/Icons'
import { CoverPhotoField } from '../components/CoverPhotoField'

function Section({ title, children }) {
  return (
    <section className="editor-section">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

function Field({ label, children, error }) {
  return (
    <label className="field editor-field">
      <span>{label}</span>
      {children}
      {error && <em className="err">{error}</em>}
    </label>
  )
}

export default function EventEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEventById, upsertEvent, addTicket, user, notify } = useApp()
  const editing = Boolean(id && id !== 'new')
  const existing = editing ? getEventById(id) : null
  const [draft, setDraft] = useState(() => (existing ? eventToDraft(existing) : blankEventDraft()))
  const [errors, setErrors] = useState({})

  const previewLabel = useMemo(
    () => draft.dateLabel || makeDateLabel(draft.date, draft.endDate),
    [draft.date, draft.dateLabel, draft.endDate]
  )

  if (editing && !existing) {
    return (
      <div className="empty">
        <h3>Event not found</h3>
        <button type="button" className="btn" onClick={() => navigate('/account/events')}>
          Back to manage events
        </button>
      </div>
    )
  }

  function set(key, value) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  function setTier(index, key, value) {
    setDraft((prev) => ({
      ...prev,
      tiers: prev.tiers.map((tier, i) => (i === index ? { ...tier, [key]: value } : tier)),
    }))
  }

  function validate() {
    const next = {}
    if (draft.artist.trim().length < 2) next.artist = 'Enter the artist or event name.'
    if (!draft.venue.trim()) next.venue = 'Enter the venue.'
    if (!draft.date) next.date = 'Pick the event date.'
    if (!draft.tiers.some((tier) => String(tier.name).trim())) next.tiers = 'Add at least one ticket type.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function save(issueTicket) {
    if (!validate()) return null
    const event = buildEventFromDraft(draft, existing?.id)
    if (existing) {
      event.featuredRank = existing.featuredRank ?? event.featuredRank
      event.upcomingRank = existing.upcomingRank ?? event.upcomingRank
      event.custom = !isSeedEvent(existing.id)
    }
    upsertEvent(event)
    if (issueTicket) {
      const tier = event.tiers[0]
      const face = ticketFaceFromEvent(event, {
        holderName: event.holderName || user?.name || '',
        orderRef: event.orderRef || uid('OR'),
      })
      addTicket({
        id: uid('TK'),
        eventId: event.id,
        tier: tier.name,
        qty: Math.max(1, Number(event.admit) || 1),
        total: tier.price,
        code: uid('GL'),
        purchasedAt: new Date().toISOString(),
        ...face,
        status: 'confirmed',
      })
      notify('Event saved and ticket issued')
      navigate('/tickets')
      return event
    }
    notify(editing ? 'Event updated' : 'Event added')
    navigate('/account/events')
    return event
  }

  return (
    <div className="page editor-page">
      <header className="subhead">
        <button type="button" className="icon-btn" aria-label="Back" onClick={() => navigate('/account/events')}>
          <Icon name="back" />
        </button>
        <h1>{editing ? 'Edit event' : 'Add event'}</h1>
      </header>

      <form
        className="pad editor-form"
        onSubmit={(event) => {
          event.preventDefault()
          save(false)
        }}
        noValidate
      >
        <Section title="Event">
          <Field label="Artist / headline" error={errors.artist}>
            <input value={draft.artist} onChange={(e) => set('artist', e.target.value)} className={errors.artist ? 'bad' : ''} />
          </Field>
          <Field label="Tour / show title">
            <input value={draft.title} onChange={(e) => set('title', e.target.value)} />
          </Field>
          <div className="field-row">
            <Field label="Category">
              <select value={draft.category} onChange={(e) => set('category', e.target.value)}>
                {eventCategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select value={draft.status} onChange={(e) => set('status', e.target.value)}>
                {eventStatuses.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="About / description">
            <textarea value={draft.about} onChange={(e) => set('about', e.target.value)} rows={4} />
          </Field>
          <div className="field-row">
            <Field label="Card tone">
              <select value={draft.tone} onChange={(e) => set('tone', e.target.value)}>
                {eventTones.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Date badge">
              <input
                value={draft.dateLabel}
                onChange={(e) => set('dateLabel', e.target.value)}
                placeholder={previewLabel || '01 NOV'}
              />
            </Field>
          </div>
          <div className="check-row">
            <label>
              <input type="checkbox" checked={draft.featured} onChange={(e) => set('featured', e.target.checked)} /> Featured
            </label>
            <label>
              <input type="checkbox" checked={draft.upcoming} onChange={(e) => set('upcoming', e.target.checked)} /> Upcoming
            </label>
            <label>
              <input type="checkbox" checked={draft.recent} onChange={(e) => set('recent', e.target.checked)} /> Recent
            </label>
          </div>
        </Section>

        <Section title="Cover photo">
          <CoverPhotoField
            draft={draft}
            previewLabel={previewLabel}
            onChange={(patch) => setDraft((prev) => ({ ...prev, ...patch }))}
          />
        </Section>

        <Section title="When">
          <div className="field-row">
            <Field label="Event date" error={errors.date}>
              <input
                type="date"
                value={draft.date}
                onChange={(e) => set('date', e.target.value)}
                className={errors.date ? 'bad' : ''}
              />
            </Field>
            <Field label="End date (optional)">
              <input type="date" value={draft.endDate} onChange={(e) => set('endDate', e.target.value)} />
            </Field>
          </div>
          <div className="field-row">
            <Field label="Doors open">
              <input type="time" value={draft.doorsTime} onChange={(e) => set('doorsTime', e.target.value)} />
            </Field>
            <Field label="Show time">
              <input type="time" value={draft.showTime} onChange={(e) => set('showTime', e.target.value)} />
            </Field>
          </div>
        </Section>

        <Section title="Where">
          <Field label="Venue" error={errors.venue}>
            <input value={draft.venue} onChange={(e) => set('venue', e.target.value)} className={errors.venue ? 'bad' : ''} />
          </Field>
          <div className="field-row">
            <Field label="City">
              <input value={draft.city} onChange={(e) => set('city', e.target.value)} />
            </Field>
            <Field label="Gate">
              <input value={draft.gate} onChange={(e) => set('gate', e.target.value)} placeholder="Gate B" />
            </Field>
          </div>
          <Field label="Address">
            <input value={draft.address} onChange={(e) => set('address', e.target.value)} placeholder="Street, postcode" />
          </Field>
          <Field label="Entrance">
            <input value={draft.entrance} onChange={(e) => set('entrance', e.target.value)} placeholder="West entrance" />
          </Field>
        </Section>

        <Section title="Ticket face">
          <p className="section-hint">These details print on the ticket shown in Tickets.</p>
          <Field label="Ticket holder">
            <input
              value={draft.holderName}
              onChange={(e) => set('holderName', e.target.value)}
              placeholder={user?.name || 'Full name on ticket'}
            />
          </Field>
          <div className="field-row three">
            <Field label="Section">
              <input value={draft.section} onChange={(e) => set('section', e.target.value)} placeholder="101" />
            </Field>
            <Field label="Row">
              <input value={draft.row} onChange={(e) => set('row', e.target.value)} placeholder="H" />
            </Field>
            <Field label="Seat">
              <input value={draft.seat} onChange={(e) => set('seat', e.target.value)} placeholder="14" />
            </Field>
          </div>
          <div className="field-row">
            <Field label="Level">
              <input value={draft.level} onChange={(e) => set('level', e.target.value)} placeholder="Lower bowl" />
            </Field>
            <Field label="Admit">
              <input
                type="number"
                min="1"
                max="12"
                value={draft.admit}
                onChange={(e) => set('admit', e.target.value)}
              />
            </Field>
          </div>
          <div className="field-row">
            <Field label="Age limit">
              <input value={draft.ageLimit} onChange={(e) => set('ageLimit', e.target.value)} />
            </Field>
            <Field label="Order reference">
              <input value={draft.orderRef} onChange={(e) => set('orderRef', e.target.value)} placeholder="Optional" />
            </Field>
          </div>
          <Field label="Entry notes">
            <textarea value={draft.entryNotes} onChange={(e) => set('entryNotes', e.target.value)} rows={3} />
          </Field>
        </Section>

        <Section title="Ticket types & price">
          {errors.tiers && <em className="err block-err">{errors.tiers}</em>}
          {draft.tiers.map((tier, index) => (
            <div key={tier.id} className="tier-edit">
              <div className="field-row three">
                <Field label="Type">
                  <input value={tier.name} onChange={(e) => setTier(index, 'name', e.target.value)} />
                </Field>
                <Field label="Price (RM)">
                  <input
                    type="number"
                    min="0"
                    value={tier.price}
                    onChange={(e) => setTier(index, 'price', e.target.value)}
                  />
                </Field>
                <Field label=" ">
                  <button
                    type="button"
                    className="btn ghost slim block"
                    disabled={draft.tiers.length <= 1}
                    onClick={() =>
                      setDraft((prev) => ({ ...prev, tiers: prev.tiers.filter((_, i) => i !== index) }))
                    }
                  >
                    Remove
                  </button>
                </Field>
              </div>
              <Field label="Note">
                <input value={tier.note} onChange={(e) => setTier(index, 'note', e.target.value)} />
              </Field>
            </div>
          ))}
          <button
            type="button"
            className="btn ghost block"
            onClick={() => setDraft((prev) => ({ ...prev, tiers: [...prev.tiers, emptyTier()] }))}
          >
            Add ticket type
          </button>
        </Section>

        <div className="editor-actions">
          <button type="submit" className="btn block">
            {editing ? 'Save changes' : 'Save event'}
          </button>
          <button type="button" className="btn ghost block" onClick={() => save(true)}>
            Save & issue ticket
          </button>
        </div>
      </form>
    </div>
  )
}
