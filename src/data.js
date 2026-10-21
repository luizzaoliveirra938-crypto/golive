export const categories = ['All', 'Comedy', 'Concert']
export const eventCategories = ['Concert', 'Comedy']
export const eventStatuses = [
  { id: 'onsale', label: 'On sale' },
  { id: 'postponed', label: 'Postponed' },
  { id: 'soldout', label: 'Sold out' },
]
export const eventTones = [
  { id: 'mono', label: 'Mono' },
  { id: 'red', label: 'Red' },
  { id: 'cool', label: 'Cool' },
  { id: 'sky', label: 'Sky' },
  { id: 'stage', label: 'Stage' },
  { id: 'warm', label: 'Warm' },
]

export const months = [
  { id: 'all', label: 'All dates' },
  { id: '2026-09', label: 'September 2026' },
  { id: '2026-11', label: 'November 2026' },
  { id: '2026-12', label: 'December 2026' },
]

export const imagePresets = [
  { id: '/images/lany.jpg?v=golive', label: 'LANY' },
  { id: '/images/weeknd.jpg?v=golive', label: 'The Weeknd' },
  { id: '/images/khalid.jpg?v=golive', label: 'Khalid' },
  { id: '/images/yungkai.jpg?v=golive', label: 'yung kai' },
  { id: '/images/niki.jpg?v=golive', label: 'NIKI' },
  { id: '/images/comedy1.jpg?v=golive', label: 'Comedy hall' },
  { id: '/images/comedy2.jpg?v=golive', label: 'Late set' },
  { id: '/images/post.jpg?v=golive', label: 'Post Malone' },
]

export const sorts = [
  { id: 'soonest', label: 'Soonest' },
  { id: 'priceAsc', label: 'Price: low to high' },
  { id: 'priceDesc', label: 'Price: high to low' },
]

export const events = [
  {
    id: 'lany',
    artist: 'LANY',
    title: 'soft world tour in kuala lumpur',
    category: 'Concert',
    venue: 'Unifi Arena',
    city: 'Kuala Lumpur',
    priceFrom: 298,
    dateLabel: '01 NOV',
    dateText: 'Sunday, 1 November 2026 · 8:00 PM',
    month: '2026-11',
    sortKey: Date.parse('2026-11-01'),
    image: '/images/lany.jpg?v=golive',
    position: 'center 28%',
    tone: 'mono',
    featured: false,
    upcoming: true,
    upcomingRank: 1,
    recent: false,
    status: 'onsale',
    about:
      'LANY bring the soft world tour to Kuala Lumpur for one night at Unifi Arena. Slow-burn hooks, phone-light ballads, and a room built for singing every word back.',
    tiers: [
      { id: 'std', name: 'Standard', price: 298, note: 'Seated, side sections' },
      { id: 'vip', name: 'VIP', price: 598, note: 'Front bowl and lounge entry' },
      { id: 'pit', name: 'Golden Circle', price: 898, note: 'Standing, closest to the stage' },
    ],
  },
  {
    id: 'weeknd',
    artist: 'The Weeknd',
    title: 'After Hours Til Dawn Tour',
    category: 'Concert',
    venue: 'TM Stadium Nasional',
    city: 'Kuala Lumpur',
    priceFrom: 450,
    dateLabel: '04 NOV - 05 NOV',
    dateText: '4–5 November 2026 · 8:00 PM',
    month: '2026-11',
    sortKey: Date.parse('2026-11-04'),
    image: '/images/weeknd.jpg?v=golive',
    position: 'center 22%',
    tone: 'red',
    featured: false,
    upcoming: true,
    upcomingRank: 2,
    recent: false,
    status: 'onsale',
    about:
      'After Hours Til Dawn lands at Stadium Nasional for two nights. The show runs the album eras back to back, with the red-lit stage built for a stadium chorus.',
    tiers: [
      { id: 'std', name: 'Standard', price: 450, note: 'Reserved stadium seat' },
      { id: 'vip', name: 'VIP', price: 850, note: 'Lower bowl and early entry' },
      { id: 'pit', name: 'Floor', price: 1280, note: 'Standing floor, nearest the stage' },
    ],
  },
  {
    id: 'khalid',
    artist: 'Khalid',
    title: "It's Always Summer Somewhere Tour in Kuala Lumpur",
    category: 'Concert',
    venue: 'Idea Live Arena',
    city: 'Petaling Jaya',
    priceFrom: 320,
    dateLabel: '09 DEC',
    dateText: 'Wednesday, 9 December 2026 · 8:00 PM',
    month: '2026-12',
    sortKey: Date.parse('2026-12-09'),
    image: '/images/khalid.jpg?v=golive',
    position: 'center 18%',
    tone: 'cool',
    featured: true,
    featuredRank: 1,
    upcoming: false,
    recent: false,
    status: 'onsale',
    about:
      "It's Always Summer Somewhere comes to Axiata Arena. A warm, full-band set built around the singles and the quieter songs that usually stay off the festival stage.",
    tiers: [
      { id: 'std', name: 'Standard', price: 320, note: 'Arena seat' },
      { id: 'vip', name: 'VIP', price: 620, note: 'Front sections and merch voucher' },
    ],
  },
  {
    id: 'yungkai',
    artist: 'yung kai',
    title: "stay with the ocean, i'll find you",
    category: 'Concert',
    venue: 'The Platform',
    city: 'Kuala Lumpur',
    priceFrom: 198,
    dateLabel: '06 NOV',
    dateText: 'Friday, 6 November 2026 · 8:00 PM',
    month: '2026-11',
    sortKey: Date.parse('2026-11-06'),
    image: '/images/yungkai.jpg?v=golive',
    position: 'center 30%',
    tone: 'sky',
    featured: true,
    featuredRank: 2,
    upcoming: true,
    upcomingRank: 3,
    recent: false,
    status: 'onsale',
    about:
      'An intimate evening built around stay with the ocean. Smaller room, earlier curfew, and a set that leaves space between the songs.',
    tiers: [
      { id: 'std', name: 'Standing', price: 180, note: 'General admission' },
      { id: 'vip', name: 'Balcony', price: 320, note: 'Reserved balcony seat' },
    ],
  },
  {
    id: 'niki',
    artist: 'NIKI',
    title: 'Buzz World Tour',
    category: 'Concert',
    venue: 'Mega Star Arena',
    city: 'Kuala Lumpur',
    priceFrom: 280,
    dateLabel: '21 NOV',
    dateText: 'Saturday, 21 November 2026 · 8:00 PM',
    month: '2026-11',
    sortKey: Date.parse('2026-11-21'),
    image: '/images/niki.jpg?v=golive',
    position: 'center 20%',
    tone: 'stage',
    featured: false,
    upcoming: true,
    upcomingRank: 4,
    recent: false,
    status: 'onsale',
    about:
      'The Buzz World Tour stops in Kuala Lumpur for a full production night. Doors open an hour before showtime.',
    tiers: [
      { id: 'std', name: 'Standard', price: 280, note: 'Reserved seat' },
      { id: 'vip', name: 'VIP', price: 520, note: 'Pit upgrade and early entry' },
    ],
  },
  {
    id: 'laughs',
    artist: 'KL Laughs Live',
    title: 'A city lineup of stand-up',
    category: 'Comedy',
    venue: 'Plenary Hall',
    city: 'Kuala Lumpur',
    priceFrom: 188,
    dateLabel: '15 NOV',
    dateText: 'Sunday, 15 November 2026 · 8:00 PM',
    month: '2026-11',
    sortKey: Date.parse('2026-11-15'),
    image: '/images/comedy1.jpg?v=golive',
    position: 'center center',
    tone: 'warm',
    featured: false,
    upcoming: false,
    recent: false,
    status: 'onsale',
    about:
      'Four comics, one seated hall, no intermission. The lineup is announced the week of the show.',
    tiers: [
      { id: 'std', name: 'Standard', price: 188, note: 'Stalls' },
      { id: 'vip', name: 'Front', price: 288, note: 'First eight rows' },
    ],
  },
  {
    id: 'lateset',
    artist: 'Late Set Comedy',
    title: 'Doors at 8, show at 9',
    category: 'Comedy',
    venue: 'Jaya One',
    city: 'Petaling Jaya',
    priceFrom: 98,
    dateLabel: '22 NOV',
    dateText: 'Sunday, 22 November 2026 · 9:00 PM',
    month: '2026-11',
    sortKey: Date.parse('2026-11-22'),
    image: '/images/comedy2.jpg?v=golive',
    position: 'center 35%',
    tone: 'stage',
    featured: false,
    upcoming: false,
    recent: false,
    status: 'onsale',
    about:
      'A late, loose hour in a small room. Bar service stays open and the running order changes every week.',
    tiers: [{ id: 'std', name: 'General', price: 98, note: 'Free seating' }],
  },
  {
    id: 'post-malone',
    artist: 'Post Malone',
    title: 'Presents The BIG Stadium World Tour',
    recentTitle: '[POSTPONED] Post Malone',
    category: 'Concert',
    venue: 'TM Stadium Nasional',
    city: 'Kuala Lumpur',
    priceFrom: 350,
    dateLabel: '27 SEP',
    dateText: 'Sunday, 27 September 2026 · postponed',
    month: '2026-09',
    sortKey: Date.parse('2026-09-27'),
    image: '/images/post.jpg?v=golive',
    position: 'center 25%',
    tone: 'warm',
    featured: false,
    upcoming: false,
    recent: true,
    status: 'postponed',
    about:
      'The BIG Stadium World Tour stop at Stadium Nasional has been postponed. A new date will be announced here. Tickets already bought stay valid for the rescheduled show.',
    tiers: [
      { id: 'std', name: 'Standard', price: 350, note: 'Sales paused' },
      { id: 'vip', name: 'VIP', price: 780, note: 'Sales paused' },
    ],
  },
]

export const products = [
  {
    id: 'tee',
    name: 'GoLive Tour Tee',
    price: 149,
    tag: 'Apparel',
    image: '/images/tee.jpg',
    blurb: 'Heavyweight black tee with a small teal mark on the chest.',
  },
  {
    id: 'cap',
    name: 'GoLive Cap',
    price: 79,
    tag: 'Apparel',
    image: '/images/cap.jpg',
    blurb: 'Washed cap with an embroidered go mark.',
  },
  {
    id: 'poster',
    name: 'Arena Night Poster',
    price: 49,
    tag: 'Print',
    image: '/images/poster.jpg',
    blurb: 'A3 print from the city-lights series. Ships flat.',
  },
  {
    id: 'tote',
    name: 'Show Day Tote',
    price: 59,
    tag: 'Accessories',
    image: '/images/tote.jpg',
    blurb: 'Canvas tote for merch, a jacket, and the late train home.',
  },
]

export const notifications = [
  {
    id: 'n1',
    title: 'Presale is open',
    body: 'After Hours Til Dawn Tour tickets are on sale.',
    time: '2h',
    href: '/event/weeknd',
  },
  {
    id: 'n2',
    title: 'From RM298',
    body: 'LANY soft world tour just added Unifi Arena.',
    time: '1d',
    href: '/event/lany',
  },
  {
    id: 'n3',
    title: 'Tour update',
    body: 'Post Malone’s stadium show has been postponed.',
    time: '3d',
    href: '/event/post-malone',
  },
]

export const legal = {
  terms: {
    title: 'Terms of Use',
    updated: '1 October 2026',
    sections: [
      {
        heading: 'Using GoLive',
        body: 'GoLive lists live events and lets you hold tickets on this device. Accounts, orders, and tickets in this demo stay in your browser and are not sent to a server.',
      },
      {
        heading: 'Tickets',
        body: 'A ticket is valid for the event, date, and tier shown on it. Postponed events keep their tickets for the new date once it is announced. Tickets are for personal use.',
      },
      {
        heading: 'Store',
        body: 'Merch prices are shown in Malaysian ringgit. Placing an order in this demo confirms it on your device only and does not charge a card.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    updated: '1 October 2026',
    sections: [
      {
        heading: 'What stays on this device',
        body: 'Your name, email, saved events, tickets, and store orders are stored locally in this browser. Clearing site data removes them.',
      },
      {
        heading: 'What we do not collect',
        body: 'This demo does not run analytics, does not sell personal information, and does not send your sign-in details anywhere.',
      },
      {
        heading: 'Notifications',
        body: 'The bell shows sample updates about events in the app. They are not push notifications and do not leave your device.',
      },
    ],
  },
}

export const seedEventIds = new Set(events.map((event) => event.id))

export function isSeedEvent(id) {
  return seedEventIds.has(id)
}

export function getEvent(id, customEvents = []) {
  return customEvents.find((event) => event.id === id) || events.find((event) => event.id === id)
}

export function getProduct(id) {
  return products.find((product) => product.id === id)
}

export function rm(amount) {
  return `RM${Number(amount).toLocaleString('en-MY')}`
}

export function formatWhen(iso) {
  return new Date(iso).toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

export function emptyTier() {
  return { id: uid('TR'), name: 'Standard', price: '', note: '' }
}

export function blankEventDraft() {
  return {
    id: '',
    artist: '',
    title: '',
    category: 'Concert',
    venue: '',
    city: 'Kuala Lumpur',
    address: '',
    date: '',
    endDate: '',
    showTime: '20:00',
    doorsTime: '19:00',
    dateLabel: '',
    status: 'onsale',
    about: '',
    image: '/images/lany.jpg?v=golive',
    position: 'center center',
    tone: 'cool',
    featured: false,
    upcoming: true,
    recent: false,
    holderName: '',
    section: '',
    row: '',
    seat: '',
    gate: '',
    entrance: '',
    level: '',
    admit: '1',
    ageLimit: 'All ages',
    entryNotes: 'Have your QR ready at the gate. No re-entry after scan.',
    orderRef: '',
    tiers: [emptyTier()],
  }
}

export function eventToDraft(event) {
  return {
    ...blankEventDraft(),
    ...event,
    date: event.date || (event.month ? `${event.month}-01` : ''),
    endDate: event.endDate || '',
    showTime: event.showTime || '20:00',
    doorsTime: event.doorsTime || '19:00',
    address: event.address || '',
    holderName: event.holderName || '',
    section: event.section || '',
    row: event.row || '',
    seat: event.seat || '',
    gate: event.gate || '',
    entrance: event.entrance || '',
    level: event.level || '',
    admit: String(event.admit ?? '1'),
    ageLimit: event.ageLimit || 'All ages',
    entryNotes: event.entryNotes || 'Have your QR ready at the gate. No re-entry after scan.',
    orderRef: event.orderRef || '',
    tiers: (event.tiers || [emptyTier()]).map((tier) => ({
      ...tier,
      price: String(tier.price ?? ''),
    })),
  }
}

function formatClock(time) {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  if (Number.isNaN(h)) return time
  const date = new Date()
  date.setHours(h, m || 0, 0, 0)
  return date.toLocaleTimeString('en-MY', { hour: 'numeric', minute: '2-digit' })
}

export function makeDateLabel(date, endDate) {
  if (!date) return ''
  const start = new Date(`${date}T12:00:00`)
  const startLabel = start
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    .toUpperCase()
  if (!endDate || endDate === date) return startLabel
  const end = new Date(`${endDate}T12:00:00`)
  const endLabel = end
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    .toUpperCase()
  return `${startLabel} - ${endLabel}`
}

export function makeDateText(date, endDate, showTime) {
  if (!date) return ''
  const start = new Date(`${date}T12:00:00`)
  const timeBit = showTime ? ` · ${formatClock(showTime)}` : ''
  if (!endDate || endDate === date) {
    return `${start.toLocaleDateString('en-MY', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })}${timeBit}`
  }
  const end = new Date(`${endDate}T12:00:00`)
  return `${start.toLocaleDateString('en-MY', { day: 'numeric', month: 'long' })} – ${end.toLocaleDateString(
    'en-MY',
    { day: 'numeric', month: 'long', year: 'numeric' }
  )}${timeBit}`
}

export function buildEventFromDraft(draft, existingId) {
  const tiers = (draft.tiers || [])
    .map((tier, index) => ({
      id: tier.id || `t${index + 1}`,
      name: String(tier.name || '').trim() || `Tier ${index + 1}`,
      price: Math.max(0, Number(tier.price) || 0),
      note: String(tier.note || '').trim(),
    }))
    .filter((tier) => tier.name)
  const prices = tiers.map((tier) => tier.price)
  const date = draft.date || ''
  const endDate = draft.endDate || ''
  const sortKey = date ? Date.parse(`${date}T12:00:00`) : Date.now()
  const month = date ? date.slice(0, 7) : ''
  const dateLabel = draft.dateLabel.trim() || makeDateLabel(date, endDate)
  const id = existingId || `ev-${Math.random().toString(36).slice(2, 9)}`

  return {
    id,
    artist: draft.artist.trim(),
    title: draft.title.trim(),
    category: draft.category,
    venue: draft.venue.trim(),
    city: draft.city.trim(),
    address: draft.address.trim(),
    priceFrom: prices.length ? Math.min(...prices) : 0,
    dateLabel,
    dateText: makeDateText(date, endDate, draft.showTime),
    date,
    endDate,
    showTime: draft.showTime,
    doorsTime: draft.doorsTime,
    month,
    sortKey: Number.isNaN(sortKey) ? Date.now() : sortKey,
    image: draft.image.trim() || '/images/lany.jpg?v=golive',
    position: draft.position || 'center center',
    tone: draft.tone || 'cool',
    featured: Boolean(draft.featured),
    featuredRank: draft.featuredRank || 99,
    upcoming: draft.upcoming !== false,
    upcomingRank: draft.upcomingRank || 99,
    recent: Boolean(draft.recent),
    status: draft.status || 'onsale',
    about: draft.about.trim(),
    holderName: draft.holderName.trim(),
    section: draft.section.trim(),
    row: draft.row.trim(),
    seat: draft.seat.trim(),
    gate: draft.gate.trim(),
    entrance: draft.entrance.trim(),
    level: draft.level.trim(),
    admit: Math.max(1, Number(draft.admit) || 1),
    ageLimit: draft.ageLimit.trim() || 'All ages',
    entryNotes: draft.entryNotes.trim(),
    orderRef: draft.orderRef.trim(),
    tiers: tiers.length ? tiers : [{ id: 'std', name: 'Standard', price: 0, note: '' }],
    custom: true,
  }
}

export function buildMonths(list) {
  const map = new Map([['all', 'All dates']])
  for (const event of list) {
    if (!event.month) continue
    const [year, month] = event.month.split('-')
    const label = new Date(`${event.month}-01T12:00:00`).toLocaleDateString('en-MY', {
      month: 'long',
      year: 'numeric',
    })
    map.set(event.month, label || `${month}/${year}`)
  }
  return [...map.entries()].map(([id, label]) => ({ id, label }))
}

export function filterEvents(list, { query, category, month, sort }) {
  const q = query.trim().toLowerCase()
  const filtered = list.filter((event) => {
    if (event.recent && !q && month === 'all') return false
    if (category !== 'All' && event.category !== category) return false
    if (month !== 'all' && event.month !== month) return false
    if (!q) return true
    const hay = `${event.artist} ${event.title} ${event.venue} ${event.city} ${event.category}`.toLowerCase()
    return hay.includes(q)
  })
  const sorters = {
    soonest: (a, b) => a.sortKey - b.sortKey,
    priceAsc: (a, b) => a.priceFrom - b.priceFrom,
    priceDesc: (a, b) => b.priceFrom - a.priceFrom,
  }
  return [...filtered].sort(sorters[sort] || sorters.soonest)
}

export function ticketFaceFromEvent(event, extras = {}) {
  return {
    holderName: extras.holderName || event.holderName || '',
    section: extras.section || event.section || '',
    row: extras.row || event.row || '',
    seat: extras.seat || event.seat || '',
    gate: extras.gate || event.gate || '',
    entrance: extras.entrance || event.entrance || '',
    level: extras.level || event.level || '',
    admit: extras.admit || event.admit || 1,
    ageLimit: extras.ageLimit || event.ageLimit || 'All ages',
    entryNotes: extras.entryNotes || event.entryNotes || '',
    orderRef: extras.orderRef || event.orderRef || '',
    doorsTime: event.doorsTime || '',
    showTime: event.showTime || '',
    address: event.address || '',
    dateText: event.dateText || '',
  }
}

export const SERVICE_FEE = 12
export const PROTECT_FEE = 8
export const MAX_TICKETS = 6

export const paymentMethods = [
  { id: 'card', label: 'Credit / Debit card', note: 'Visa, Mastercard' },
  { id: 'fpx', label: 'Online banking (FPX)', note: 'Malaysian banks' },
  { id: 'tng', label: "Touch 'n Go eWallet", note: 'Instant confirmation' },
  { id: 'grab', label: 'GrabPay', note: 'Wallet checkout' },
]

export function assignBestSeats(event, tier, qty) {
  const sectionMap = {
    Standard: '201',
    VIP: '112',
    'Golden Circle': 'GC',
    Floor: 'FL',
    Standing: 'GA',
    Balcony: 'B2',
    Front: '101',
    General: 'GA',
  }
  const section = event.section || sectionMap[tier.name] || '118'
  const row = event.row || String.fromCharCode(65 + ((tier.name.length + qty) % 8))
  const start = event.seat ? Number(event.seat) || 10 : 8 + ((tier.price || 0) % 17)
  const seats = Array.from({ length: qty }, (_, index) => start + index)
  const level =
    event.level ||
    (section === 'GC' || section === 'FL' || section === 'GA' ? 'Floor' : section.startsWith('1') ? 'Lower bowl' : 'Upper bowl')
  const gate = event.gate || (Number(section) >= 200 ? 'Gate C' : 'Gate A')
  return {
    section,
    row,
    seat: seats.join(', '),
    level,
    gate,
    entrance: event.entrance || 'Main entrance',
  }
}

export function priceBreakdown(tierPrice, qty, protect) {
  const subtotal = tierPrice * qty
  const serviceFee = SERVICE_FEE * qty
  const protectFee = protect ? PROTECT_FEE * qty : 0
  return {
    subtotal,
    serviceFee,
    protectFee,
    total: subtotal + serviceFee + protectFee,
  }
}

const VENUE_COORDS = {
  'TM Stadium Nasional': { lat: 3.0545, lng: 101.6917, area: 'Bukit Jalil' },
  'Unifi Arena': { lat: 3.0505, lng: 101.6888, area: 'Bukit Jalil' },
  'Idea Live Arena': { lat: 3.1305, lng: 101.6228, area: 'Petaling Jaya' },
  'The Platform': { lat: 3.1402, lng: 101.6305, area: 'TTDI' },
  'Mega Star Arena': { lat: 3.0733, lng: 101.607, area: 'Kuala Lumpur' },
  'Plenary Hall': { lat: 3.1489, lng: 101.7133, area: 'KLCC' },
  'Jaya One': { lat: 3.1275, lng: 101.6355, area: 'Petaling Jaya' },
  'Axiata Arena': { lat: 3.0548, lng: 101.6912, area: 'Bukit Jalil' },
  'Zepp Kuala Lumpur': { lat: 3.1412, lng: 101.708, area: 'BBCC' },
}

const SEAT_COLORS = ['#4fd1ff', '#7dd3fc', '#f6d365', '#e8a87c', '#c084fc', '#34d27a']

export function getVenueLocation(event) {
  const known = VENUE_COORDS[event.venue] || { lat: 3.139, lng: 101.6869, area: event.city }
  const query = [event.venue, known.area, event.city, 'Malaysia'].filter(Boolean).join(', ')
  return {
    ...known,
    label: [event.venue, known.area].filter(Boolean).join(', '),
    query,
    mapsEmbedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`,
    mapsLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
  }
}

export function getSeatMap(event) {
  if (event.seatMap) return event.seatMap
  const stadium = /stadium/i.test(event.venue)
  const hall = /comedy|jaya|platform|plenary|zepp/i.test(`${event.venue} ${event.category}`)
  const layout = stadium ? 'stadium' : hall ? 'hall' : 'arena'
  const legend = (event.tiers || []).map((tier, index) => ({
    id: tier.id,
    label: tier.name,
    price: tier.price,
    color: SEAT_COLORS[index % SEAT_COLORS.length],
  }))
  return {
    layout,
    stageLabel: layout === 'hall' ? 'STAGE' : 'STAGE',
    legend,
  }
}
