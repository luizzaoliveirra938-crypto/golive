export function Icon({ name, size = 24, filled = false }) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

  if (name === 'discover') {
    return (
      <svg {...props} fill={filled ? 'currentColor' : 'none'} strokeWidth={filled ? 0 : 1.7}>
        <path d="M12 2.2 14.7 9.3 22 12l-7.3 2.7L12 21.8 9.3 14.7 2 12l7.3-2.7L12 2.2z" />
      </svg>
    )
  }

  if (name === 'heart') {
    return (
      <svg {...props} fill={filled ? 'currentColor' : 'none'}>
        <path d="M12 20.2s-6.8-4.2-6.8-8.7A3.9 3.9 0 0 1 12 8.6a3.9 3.9 0 0 1 6.8 2.9c0 4.5-6.8 8.7-6.8 8.7z" />
      </svg>
    )
  }

  const paths = {
    home: <path d="M4 10.8 12 4l8 6.8V20a1 1 0 0 1-1 1h-5.2v-6.2H10.2V21H5a1 1 0 0 1-1-1v-9.2z" />,
    cart: (
      <>
        <path d="M6.2 7h14l-1.4 8.2a1.5 1.5 0 0 1-1.5 1.3H8.2a1.5 1.5 0 0 1-1.5-1.2L5.2 4.8H3" />
        <path d="M9 20h.01M17 20h.01" strokeWidth="2.8" />
      </>
    ),
    ticket: (
      <path d="M4 8.5A2 2 0 0 1 6 6.5h12a2 2 0 0 1 2 2v2.2a2 2 0 0 0 0 3.6v2.2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2.2a2 2 0 0 0 0-3.6V8.5z" />
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3.1" />
        <path d="M5.2 19.4c1.3-2.8 3.7-4.1 6.8-4.1s5.5 1.3 6.8 4.1" />
      </>
    ),
    bell: (
      <>
        <path d="M6.2 9.2a5.8 5.8 0 0 1 11.6 0c0 6.2 1.8 6.6 1.8 8.2H4.4c0-1.6 1.8-2 1.8-8.2z" />
        <path d="M10 19.6a2 2 0 0 0 4 0" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="M16 16.5 20.2 20.7" />
      </>
    ),
    calendar: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3.5v3M16 3.5v3M4 10h16" />
      </>
    ),
    sliders: (
      <>
        <path d="M4 7h16M4 17h16" />
        <circle cx="9" cy="7" r="2.1" fill="currentColor" stroke="none" />
        <circle cx="15" cy="17" r="2.1" fill="currentColor" stroke="none" />
      </>
    ),
    cards: (
      <>
        <rect x="5" y="6.2" width="14" height="4.2" rx="1.3" />
        <rect x="5" y="13.6" width="14" height="4.2" rx="1.3" />
      </>
    ),
    grid: (
      <>
        <rect x="4" y="4" width="6.5" height="6.5" rx="1.4" />
        <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.4" />
        <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.4" />
        <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.4" />
      </>
    ),
    pin: (
      <>
        <path d="M12 21s6.2-5.1 6.2-10a6.2 6.2 0 1 0-12.4 0C5.8 15.9 12 21 12 21z" />
        <circle cx="12" cy="10.8" r="2" />
      </>
    ),
    person: (
      <>
        <circle cx="12" cy="8" r="3" />
        <path d="M6 19c1.2-2.6 3.3-3.8 6-3.8s4.8 1.2 6 3.8" />
      </>
    ),
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    close: <path d="M6 6l12 12M18 6 6 18" />,
    back: <path d="M15 5 8 12l7 7" />,
    check: <path d="M5 12.5 9.2 16.5 19 7.5" />,
    chevron: <path d="M9 6l6 6-6 6" />,
  }

  return <svg {...props}>{paths[name]}</svg>
}
