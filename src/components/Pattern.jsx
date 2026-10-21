import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

export function Pattern({ code }) {
  const [src, setSrc] = useState('')

  useEffect(() => {
    let alive = true
    const payload = `https://golive.app/ticket/${encodeURIComponent(code)}`
    QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 240,
      color: {
        dark: '#111111',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (alive) setSrc(url)
      })
      .catch(() => {
        if (alive) setSrc('')
      })
    return () => {
      alive = false
    }
  }, [code])

  return (
    <div className="qr" aria-hidden="true">
      {src ? <img src={src} alt="" width={196} height={196} /> : <span className="qr-loading" />}
    </div>
  )
}
