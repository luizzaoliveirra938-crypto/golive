import { useRef, useState } from 'react'
import { imagePresets, rm } from '../data'

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read that file.'))
    reader.onload = () => {
      const src = String(reader.result || '')
      const img = new Image()
      img.onload = () => {
        const max = 1400
        const scale = Math.min(1, max / Math.max(img.width, img.height))
        const width = Math.round(img.width * scale)
        const height = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.84))
      }
      img.onerror = () => reject(new Error('That image could not be opened.'))
      img.src = src
    }
    reader.readAsDataURL(file)
  })
}

const POSITIONS = [
  { id: 'center center', label: 'Center' },
  { id: 'top center', label: 'Top' },
  { id: 'bottom center', label: 'Bottom' },
  { id: 'left center', label: 'Left' },
  { id: 'right center', label: 'Right' },
]

export function CoverPhotoField({ draft, previewLabel, onChange }) {
  const inputRef = useRef(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const isCustom = draft.image && !imagePresets.some((item) => item.id === draft.image)
  const priceFrom = Math.min(
    ...draft.tiers.map((tier) => Number(tier.price) || 0).filter((n) => n >= 0),
    Number.POSITIVE_INFINITY
  )
  const fromLabel = Number.isFinite(priceFrom) ? rm(priceFrom) : 'RM0'

  async function onFile(file) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Choose a JPG, PNG, or WebP cover photo.')
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('Cover photo must be under 8 MB.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const dataUrl = await readImageFile(file)
      onChange({ image: dataUrl })
    } catch (err) {
      setError(err.message || 'Upload failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="cover-field">
      <p className="section-hint">
        Same cover used on Home, Discover, event page, tickets, and checkout — preview updates as you change it.
      </p>

      <div className={`cover-live tone-${draft.tone || 'cool'}`} aria-label="Live event cover preview">
        <img src={draft.image} alt="" style={{ objectPosition: draft.position || 'center center' }} />
        <span className="grade" />
        <span className="date-pill">{previewLabel || draft.dateLabel || 'DATE'}</span>
        <span className="media-copy">
          <span className={`cat-pill cat-${String(draft.category || 'concert').toLowerCase()}`}>
            {draft.category || 'Concert'}
          </span>
          <span className="title">{draft.title || 'Tour / show title'}</span>
          <span className="artist">{draft.artist || 'Artist name'}</span>
          <span className="pill-row">
            <span className="outline-pill">{draft.venue || 'Venue'}</span>
            <span className="outline-pill">FROM {fromLabel}</span>
          </span>
        </span>
      </div>

      <div className="cover-presets" role="listbox" aria-label="Cover presets">
        {imagePresets.map((item) => (
          <button
            key={item.id}
            type="button"
            role="option"
            aria-selected={draft.image === item.id}
            className={draft.image === item.id ? 'cover-thumb on' : 'cover-thumb'}
            onClick={() => {
              setError('')
              onChange({ image: item.id })
            }}
          >
            <img src={item.id} alt="" />
            <span>{item.label}</span>
          </button>
        ))}
        {isCustom && (
          <button type="button" className="cover-thumb on" aria-selected="true">
            <img src={draft.image} alt="" style={{ objectPosition: draft.position || 'center center' }} />
            <span>Custom</span>
          </button>
        )}
      </div>

      <div className="cover-actions">
        <button type="button" className="btn ghost slim" disabled={busy} onClick={() => inputRef.current?.click()}>
          {busy ? 'Uploading…' : 'Upload cover photo'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0]
            e.target.value = ''
            onFile(file)
          }}
        />
      </div>

      <label className="field editor-field">
        <span>Or image URL</span>
        <input
          value={draft.image.startsWith('data:') ? '' : draft.image}
          onChange={(e) => {
            setError('')
            onChange({ image: e.target.value })
          }}
          placeholder="https://… or /images/…"
        />
      </label>

      <label className="field editor-field">
        <span>Focal point</span>
        <select
          value={draft.position || 'center center'}
          onChange={(e) => onChange({ position: e.target.value })}
        >
          {POSITIONS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      {error && <em className="err block-err">{error}</em>}
    </div>
  )
}
