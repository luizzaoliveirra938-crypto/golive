import { useRef, useState } from 'react'

export function ProofUpload({ onSubmit, busy = false, title = 'Upload payment proof' }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState('')
  const [fileName, setFileName] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  function onFile(file) {
    if (!file) return
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setError('Upload an image or PDF of your receipt.')
      return
    }
    if (file.size > 4.5 * 1024 * 1024) {
      setError('File must be under 4.5 MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(String(reader.result || ''))
      setFileName(file.name)
      setError('')
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="proof-upload">
      <h3>{title}</h3>
      <p className="section-hint">Upload a clear screenshot or PDF of your subscription payment.</p>
      <button type="button" className="proof-drop" onClick={() => inputRef.current?.click()}>
        {preview ? (
          preview.startsWith('data:application/pdf') ? (
            <span className="pdf-chip">PDF ready · {fileName}</span>
          ) : (
            <img src={preview} alt="Payment proof preview" />
          )
        ) : (
          <span>
            <strong>Choose receipt</strong>
            <small>JPG, PNG, or PDF</small>
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        hidden
        onChange={(event) => onFile(event.target.files?.[0])}
      />
      <label className="field editor-field">
        <span>Note (optional)</span>
        <input
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Bank reference, transfer time…"
        />
      </label>
      {error && <em className="err">{error}</em>}
      <button
        type="button"
        className="btn block"
        disabled={!preview || busy}
        onClick={() => onSubmit({ image: preview, note: note.trim(), fileName })}
      >
        {busy ? 'Submitting…' : 'Submit payment proof'}
      </button>
    </div>
  )
}
