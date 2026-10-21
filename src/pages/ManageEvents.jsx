import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isSeedEvent } from '../data'
import { useApp } from '../context'
import { Icon } from '../components/Icons'
import Sheet from '../components/Sheet'

export default function ManageEvents() {
  const navigate = useNavigate()
  const { allEvents, customEvents, deleteEvent, notify } = useApp()
  const [removeId, setRemoveId] = useState(null)
  const customIds = useMemo(() => new Set(customEvents.map((event) => event.id)), [customEvents])
  const list = useMemo(
    () => [...allEvents].sort((a, b) => (a.sortKey || 0) - (b.sortKey || 0)),
    [allEvents]
  )
  const target = list.find((event) => event.id === removeId)

  return (
    <div className="page">
      <header className="subhead">
        <button type="button" className="icon-btn" aria-label="Back" onClick={() => navigate('/account')}>
          <Icon name="back" />
        </button>
        <h1>Manage events</h1>
      </header>

      <div className="pad">
        <p className="lede tight">
          Edit or delete any show, including the built-in ones. Ticket fields you enter here show on the ticket face.
        </p>
        <button type="button" className="btn block" onClick={() => navigate('/account/events/new')}>
          Add event
        </button>
      </div>

      {list.length === 0 ? (
        <div className="empty">
          <h3>No events left</h3>
          <p>Add a new event to put shows back on Home and Discover.</p>
          <button type="button" className="btn" onClick={() => navigate('/account/events/new')}>
            Add event
          </button>
        </div>
      ) : (
        <div className="pad stack manage-list">
          {list.map((event) => {
            const overridden = customIds.has(event.id) && isSeedEvent(event.id)
            const customOnly = customIds.has(event.id) && !isSeedEvent(event.id)
            return (
              <article key={event.id} className="manage-card">
                <img src={event.image} alt="" />
                <div>
                  <strong>{event.artist}</strong>
                  <em>{event.title || 'Untitled show'}</em>
                  <span className="pill-row">
                    <span className="outline-pill">{event.dateLabel || 'No date'}</span>
                    <span className="outline-pill">{event.venue || 'No venue'}</span>
                    {overridden && <span className="outline-pill">Edited</span>}
                    {customOnly && <span className="outline-pill">Custom</span>}
                  </span>
                </div>
                <div className="manage-actions">
                  <button type="button" className="btn slim" onClick={() => navigate(`/account/events/${event.id}/edit`)}>
                    Edit
                  </button>
                  <button type="button" className="btn ghost slim" onClick={() => setRemoveId(event.id)}>
                    Delete
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {target && (
        <Sheet title="Delete event" onClose={() => setRemoveId(null)}>
          <p className="sheet-lead">
            Remove {target.artist} from Home, Discover, and Manage? Tickets already issued stay in Tickets.
          </p>
          <button
            type="button"
            className="btn block"
            onClick={() => {
              deleteEvent(target.id)
              setRemoveId(null)
              notify('Event deleted')
            }}
          >
            Delete event
          </button>
          <button type="button" className="btn ghost block sheet-reset" onClick={() => setRemoveId(null)}>
            Cancel
          </button>
        </Sheet>
      )}
    </div>
  )
}
