import { useState } from 'react'
import { getVenueLocation } from '../data'
import { Icon } from './Icons'

export function LocationMap({ event }) {
  const [open, setOpen] = useState(true)
  const place = getVenueLocation(event)

  return (
    <section className="location-card">
      <div className="location-title">
        <span className="accent-bar" aria-hidden="true" />
        <h2>Location</h2>
      </div>
      <button
        type="button"
        className="location-toggle"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{place.label}</span>
        <span className={open ? 'chev flip' : 'chev'} aria-hidden="true">
          <Icon name="chevron" size={18} />
        </span>
      </button>
      {open && (
        <div className="map-frame">
          <iframe
            title={`Map of ${place.label}`}
            src={place.mapsEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <p className="map-hint">Use ctrl + scroll to zoom the map</p>
          <a className="map-open" href={place.mapsLink} target="_blank" rel="noreferrer">
            Open in Google Maps
          </a>
        </div>
      )}
    </section>
  )
}
