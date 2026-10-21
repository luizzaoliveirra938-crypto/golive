import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { buildMonths, categories, filterEvents, sorts } from '../data'
import { useApp } from '../context'
import { Icon } from '../components/Icons'
import { TopBar } from '../components/TopBar'
import { ListCard, MediaCard } from '../components/Cards'
import Sheet from '../components/Sheet'

export default function Discover() {
  const inputRef = useRef(null)
  const location = useLocation()
  const [sheet, setSheet] = useState(null)
  const {
    query,
    setQuery,
    category,
    setCategory,
    month,
    setMonth,
    sort,
    setSort,
    view,
    setView,
    resetFilters,
    allEvents,
  } = useApp()

  useEffect(() => {
    if (location.state?.focus) inputRef.current?.focus()
  }, [location.state])

  const months = buildMonths(allEvents)
  const list = filterEvents(allEvents, { query, category, month, sort })
  const filtering = Boolean(query || category !== 'All' || month !== 'all' || sort !== 'soonest')

  return (
    <div className="page">
      <TopBar title="Discover" />
      <div className="tools">
        <div className="search">
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') event.currentTarget.blur()
            }}
            placeholder="Search"
            aria-label="Search events"
          />
          {query ? (
            <button type="button" className="search-btn" aria-label="Clear search" onClick={() => setQuery('')}>
              <Icon name="close" size={18} />
            </button>
          ) : (
            <span className="search-btn">
              <Icon name="search" size={18} />
            </span>
          )}
        </div>
        <button
          type="button"
          className={month !== 'all' ? 'tool lit' : 'tool'}
          aria-label="Filter by date"
          onClick={() => setSheet('date')}
        >
          <Icon name="calendar" size={20} />
        </button>
        <button
          type="button"
          className={sort !== 'soonest' ? 'tool lit' : 'tool'}
          aria-label="Sort events"
          onClick={() => setSheet('sort')}
        >
          <Icon name="sliders" size={20} />
        </button>
        <button
          type="button"
          className="tool-on"
          aria-label={view === 'cards' ? 'Show list' : 'Show cards'}
          onClick={() => setView(view === 'cards' ? 'list' : 'cards')}
        >
          <Icon name={view === 'cards' ? 'cards' : 'grid'} size={18} />
        </button>
      </div>

      <div className="chips" role="tablist" aria-label="Categories">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            className={category === item ? 'chip on' : 'chip'}
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {filtering && (
        <p className="result-count">
          {list.length} event{list.length === 1 ? '' : 's'}
        </p>
      )}

      {list.length === 0 ? (
        <div className="empty">
          <h3>No events found</h3>
          <p>Try another search, date, or category.</p>
          <button type="button" className="btn" onClick={resetFilters}>
            Reset filters
          </button>
        </div>
      ) : (
        <div className={view === 'cards' ? 'card-grid cards' : 'card-grid list'}>
          {view === 'cards'
            ? list.map((event) => <MediaCard key={event.id} event={event} variant="discover" />)
            : list.map((event) => <ListCard key={event.id} event={event} />)}
        </div>
      )}

      {sheet === 'date' && (
        <Sheet title="Dates" onClose={() => setSheet(null)}>
          {months.map((item) => (
            <button
              key={item.id}
              type="button"
              className={month === item.id ? 'choice on' : 'choice'}
              onClick={() => {
                setMonth(item.id)
                setSheet(null)
              }}
            >
              {item.label}
              {month === item.id && <Icon name="check" size={18} />}
            </button>
          ))}
        </Sheet>
      )}

      {sheet === 'sort' && (
        <Sheet title="Sort" onClose={() => setSheet(null)}>
          {sorts.map((item) => (
            <button
              key={item.id}
              type="button"
              className={sort === item.id ? 'choice on' : 'choice'}
              onClick={() => {
                setSort(item.id)
                setSheet(null)
              }}
            >
              {item.label}
              {sort === item.id && <Icon name="check" size={18} />}
            </button>
          ))}
          <button type="button" className="btn ghost block sheet-reset" onClick={resetFilters}>
            Reset filters
          </button>
        </Sheet>
      )}
    </div>
  )
}
