import { getSeatMap, rm } from '../data'

function StadiumSvg({ legend }) {
  const rings = legend.slice(0, 4)
  return (
    <svg viewBox="0 0 320 280" className="seatmap-svg" role="img" aria-label="Stadium seating map">
      <rect width="320" height="280" rx="18" fill="#101820" />
      <ellipse cx="160" cy="150" rx="132" ry="100" fill="#1a2430" stroke="#2c3a4a" />
      {rings[3] && <ellipse cx="160" cy="150" rx="118" ry="88" fill="none" stroke={rings[3].color} strokeWidth="16" />}
      {rings[2] && <ellipse cx="160" cy="150" rx="96" ry="70" fill="none" stroke={rings[2].color} strokeWidth="16" />}
      {rings[1] && <ellipse cx="160" cy="150" rx="74" ry="52" fill="none" stroke={rings[1].color} strokeWidth="14" />}
      {rings[0] && <ellipse cx="160" cy="150" rx="52" ry="34" fill="none" stroke={rings[0].color} strokeWidth="12" />}
      <rect x="118" y="132" width="84" height="36" rx="8" fill="#0b1220" stroke="#445" />
      <text x="160" y="155" textAnchor="middle" fill="#9fb0c0" fontSize="11" fontWeight="700">
        STAGE
      </text>
    </svg>
  )
}

function ArenaSvg({ legend }) {
  const colors = legend.map((item) => item.color)
  return (
    <svg viewBox="0 0 320 280" className="seatmap-svg" role="img" aria-label="Arena seating map">
      <rect width="320" height="280" rx="18" fill="#121212" />
      <path d="M40 210 C40 90 280 90 280 210" fill="none" stroke={colors[2] || '#555'} strokeWidth="28" />
      <path d="M62 205 C62 110 258 110 258 205" fill="none" stroke={colors[1] || '#666'} strokeWidth="24" />
      <path d="M88 198 C88 128 232 128 232 198" fill="none" stroke={colors[0] || '#777'} strokeWidth="22" />
      <rect x="112" y="168" width="96" height="34" rx="8" fill="#0d0d0d" stroke="#444" />
      <text x="160" y="190" textAnchor="middle" fill="#bbb" fontSize="11" fontWeight="700">
        STAGE
      </text>
    </svg>
  )
}

function HallSvg({ legend }) {
  const colors = legend.map((item) => item.color)
  return (
    <svg viewBox="0 0 320 280" className="seatmap-svg" role="img" aria-label="Hall seating map">
      <rect width="320" height="280" rx="18" fill="#141414" />
      <rect x="70" y="36" width="180" height="28" rx="8" fill="#222" stroke="#444" />
      <text x="160" y="55" textAnchor="middle" fill="#bbb" fontSize="11" fontWeight="700">
        STAGE
      </text>
      <rect x="56" y="88" width="208" height="42" rx="8" fill={colors[0] || '#4fd1ff'} opacity="0.9" />
      <rect x="68" y="142" width="184" height="42" rx="8" fill={colors[1] || '#f6d365'} opacity="0.9" />
      <rect x="84" y="196" width="152" height="42" rx="8" fill={colors[2] || '#e8a87c'} opacity="0.85" />
    </svg>
  )
}

export function SeatMap({ event }) {
  const map = getSeatMap(event)
  return (
    <section className="seatmap-card">
      <div className="seatmap-head">
        <div>
          <p className="kicker">SEATING MAP</p>
          <h2>{event.artist}</h2>
          <p className="section-hint tight">{event.venue} · colour matches ticket category</p>
        </div>
        <img className="seatmap-poster" src={event.image} alt="" />
      </div>
      <div className="seatmap-body">
        {map.layout === 'stadium' && <StadiumSvg legend={map.legend} />}
        {map.layout === 'arena' && <ArenaSvg legend={map.legend} />}
        {map.layout === 'hall' && <HallSvg legend={map.legend} />}
        <ul className="seatmap-legend">
          {map.legend.map((item) => (
            <li key={item.id}>
              <span className="swatch" style={{ background: item.color }} />
              <span>
                <strong>{item.label}</strong>
                <small>{rm(item.price)}</small>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
