import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchMovies } from '../services/api'

const TMDB_IMG_SMALL = 'https://image.tmdb.org/t/p/w92'

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

export default function SearchBar({ compact = false, onSelect, onResults }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const debouncedQuery = useDebounce(query, 350)
  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  // Fetch on debounced change
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      setOpen(false)
      return
    }
    let cancelled = false
    setLoading(true)
    searchMovies(debouncedQuery.trim())
      .then((data) => {
        if (!cancelled) {
          setResults(data.slice(0, 8))
          setOpen(true)
          onResults?.(data)
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [debouncedQuery])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = useCallback((movie) => {
    setOpen(false)
    setQuery('')
    if (onSelect) {
      onSelect(movie)
    } else {
      navigate(`/movie/${movie.tmdb_id}`)
    }
  }, [navigate, onSelect])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (results.length > 0) handleSelect(results[0])
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div
          className={`relative flex items-center transition-all duration-300 ${
            focused
              ? 'ring-1 ring-film-amber/60 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
              : ''
          } rounded-xl overflow-hidden bg-film-surface border border-film-border/50 hover:border-film-border transition-colors`}
        >
          {/* Search icon */}
          <div className="pl-3 pr-2 text-film-muted">
            {loading ? (
              <div className="w-4 h-4 border-2 border-film-muted border-t-film-amber rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { setFocused(true); if (results.length) setOpen(true) }}
            onBlur={() => setFocused(false)}
            placeholder={compact ? 'Search movies…' : 'Search by title, genre, actor…'}
            className={`w-full bg-transparent text-film-text placeholder-film-muted outline-none py-2.5 pr-3 text-sm font-body`}
          />

          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setResults([]); setOpen(false) }}
              className="pr-3 text-film-muted hover:text-film-text transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 z-50 glass rounded-xl border border-film-border/60 overflow-hidden shadow-2xl animate-scale-in">
          {results.map((movie, i) => (
            <button
              key={movie.tmdb_id}
              onMouseDown={() => handleSelect(movie)}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-film-card transition-colors text-left group border-b border-film-border/20 last:border-0"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              {/* Mini poster */}
              <div className="w-9 h-14 rounded-md overflow-hidden bg-film-card shrink-0">
                {movie.poster_url ? (
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-film-muted">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <p className="text-film-text text-sm font-medium truncate group-hover:text-film-white transition-colors">
                  {movie.title}
                </p>
                {movie.release_date && (
                  <p className="text-film-muted text-xs mt-0.5">
                    {movie.release_date.slice(0, 4)}
                  </p>
                )}
              </div>

              <svg className="w-4 h-4 text-film-muted ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
