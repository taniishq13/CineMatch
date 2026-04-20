import { useState, useEffect, useRef } from 'react'
import { fetchHome, fetchMoodRecommendations } from '../services/api'
import MovieGrid from '../components/MovieGrid'
import MoodInput from '../components/MoodInput'
import CategoryPills from '../components/CategoryPills'
import SectionHeader from '../components/SectionHeader'
import ErrorState from '../components/ErrorState'
import SearchBar from '../components/SearchBar'
import Loader from '../components/Loader'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [category, setCategory] = useState('trending')
  const [homeMovies, setHomeMovies] = useState([])
  const [homeLoading, setHomeLoading] = useState(true)
  const [homeError, setHomeError] = useState(null)
  const [showWakeMessage, setShowWakeMessage] = useState(false)

  const [moodMovies, setMoodMovies] = useState([])
  const [moodLoading, setMoodLoading] = useState(false)
  const [moodError, setMoodError] = useState(null)
  const [moodQuery, setMoodQuery] = useState('')

  const [searchResults, setSearchResults] = useState([])
  const [searchActive, setSearchActive] = useState(false)

  const moodResultsRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const shouldShowWakeMessage = homeLoading && homeMovies.length === 0 && !homeError

    if (!shouldShowWakeMessage) {
      setShowWakeMessage(false)
      return undefined
    }

    const wakeTimer = window.setTimeout(() => {
      setShowWakeMessage(true)
    }, 1200)

    return () => window.clearTimeout(wakeTimer)
  }, [homeLoading, homeMovies.length, homeError])

  // Fetch home feed on category change
  useEffect(() => {
    let cancelled = false
    setHomeLoading(true)
    setHomeError(null)
    fetchHome(category, 24)
      .then((data) => { if (!cancelled) setHomeMovies(data) })
      .catch((err) => { if (!cancelled) setHomeError(err.message) })
      .finally(() => { if (!cancelled) setHomeLoading(false) })
    return () => { cancelled = true }
  }, [category])

  const handleMood = async (text) => {
    setMoodLoading(true)
    setMoodError(null)
    setMoodMovies([])
    setMoodQuery(text)
    try {
      const data = await fetchMoodRecommendations(text, 18)
      setMoodMovies(data)
      setTimeout(() => moodResultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (err) {
      setMoodError(err.message)
    } finally {
      setMoodLoading(false)
    }
  }

  const handleSearchResults = (results) => {
    setSearchResults(results)
    setSearchActive(results.length > 0)
  }

  const handleSearchSelect = (movie) => {
    navigate(`/movie/${movie.tmdb_id}`)
    setSearchActive(false)
    setSearchResults([])
  }

  return (
    <div className="min-h-screen bg-film-black">
      {/* ─── HERO ─── */}
      <div className="relative pt-16 pb-0 overflow-hidden">
        {/* Background atmosphere */}
        <div className="absolute inset-0 bg-gradient-radial from-film-amber/5 via-transparent to-transparent pointer-events-none" style={{ top: '-20%' }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-film-amber/30 to-transparent" />

        <div className="max-w-[1440px] mx-auto px-6 pt-16 pb-12">
          {/* Hero text */}
          <div className="text-center mb-10 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-film-amber/10 border border-film-amber/20 text-film-amber text-xs font-mono tracking-widest mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-film-amber animate-pulse-slow" />
              AI-POWERED RECOMMENDATIONS
            </div>
            <h1 className="font-display text-6xl md:text-8xl tracking-widest text-film-white leading-none mb-4">
              FIND YOUR{' '}
              <span className="text-gradient-amber">FILM</span>
            </h1>
            <p className="text-film-muted text-lg max-w-xl mx-auto leading-relaxed">
              Describe your mood, search by title, or browse curated collections — your perfect movie is one click away.
            </p>

          </div>

          {/* Hero search bar (large, visible on mobile) */}
          <div className="max-w-2xl mx-auto mb-4 sm:hidden animate-fade-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
            <SearchBar onSelect={handleSearchSelect} onResults={handleSearchResults} />
          </div>

          {/* Hero search results (mobile) */}
          {searchActive && searchResults.length > 0 && (
            <div className="mb-10">
              <SectionHeader icon="🔍" title="SEARCH RESULTS" />
              <MovieGrid movies={searchResults.slice(0, 24)} loading={false} />
            </div>
          )}
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="max-w-[1440px] mx-auto px-6 pb-20 space-y-14">

        {/* ─── MOOD SECTION ─── */}
        <section className="animate-fade-up" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
          <MoodInput onSubmit={handleMood} loading={moodLoading} />
        </section>

        {/* Mood results */}
        {(moodLoading || moodMovies.length > 0 || moodError) && (
          <section ref={moodResultsRef} className="animate-fade-up">
            <SectionHeader
              icon="✨"
              title="MOOD PICKS"
              subtitle={moodQuery ? `Because you wanted: "${moodQuery}"` : undefined}
              accent
            />
            {moodError ? (
              <ErrorState message={moodError} onRetry={() => handleMood(moodQuery)} />
            ) : (
              <MovieGrid movies={moodMovies} loading={moodLoading} />
            )}
          </section>
        )}

        {/* ─── HOME FEED ─── */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <SectionHeader
              icon={category === 'trending' ? '🔥' : category === 'top_rated' ? '🏆' : category === 'upcoming' ? '🚀' : '🎬'}
              title={category.replace('_', ' ').toUpperCase()}
            />
          </div>

          {/* Category selector */}
          <div className="mb-6">
            <CategoryPills selected={category} onChange={setCategory} />
          </div>

          {homeError ? (
            <ErrorState message={homeError} onRetry={() => setCategory(category)} />
          ) : (
            <MovieGrid movies={homeMovies} loading={homeLoading} />
          )}
        </section>
      </div>

      {showWakeMessage && (
        <Loader fullPage text="Waking up server... this may take ~30 seconds" />
      )}
    </div>
  )
}
