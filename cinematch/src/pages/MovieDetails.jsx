import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchMovieDetails, fetchRecommendations, fetchGenreRecommendations } from '../services/api'
import MovieGrid from '../components/MovieGrid'
import SectionHeader from '../components/SectionHeader'
import Loader from '../components/Loader'
import ErrorState from '../components/ErrorState'

export default function MovieDetails() {
  const { tmdbId } = useParams()
  const navigate = useNavigate()

  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [recs, setRecs] = useState({ tfidf: [], genre: [] })
  const [recsLoading, setRecsLoading] = useState(false)

  const [imgError, setImgError] = useState(false)
  const [backdropLoaded, setBackdropLoaded] = useState(false)

  // Fetch movie details
  useEffect(() => {
    if (!tmdbId) return
    setLoading(true)
    setError(null)
    setMovie(null)
    setRecs({ tfidf: [], genre: [] })
    window.scrollTo({ top: 0, behavior: 'smooth' })

    fetchMovieDetails(tmdbId)
      .then((data) => {
        setMovie(data)
        // Fetch recommendations after we have the title
        if (data?.title) {
          setRecsLoading(true)
          fetchRecommendations(data.title, 12, 12)
            .then((r) => setRecs(r))
            .catch(async () => {
              // Fallback: genre recs
              try {
                const fallback = await fetchGenreRecommendations(tmdbId, 18)
                setRecs({ tfidf: [], genre: fallback })
              } catch {}
            })
            .finally(() => setRecsLoading(false))
        }
      })
      .catch((err) => setError(err?.response?.data?.detail || err.message))
      .finally(() => setLoading(false))
  }, [tmdbId])

  if (loading) return <Loader fullPage text="Loading movie details…" />

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <ErrorState message={error} onRetry={() => window.location.reload()} />
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-5 py-2.5 rounded-xl border border-film-border/60 text-film-soft text-sm hover:border-film-amber/40 hover:text-film-amber transition-all"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (!movie) return null

  const genres = movie.genres || []
  const year = (movie.release_date || '').slice(0, 4)

  return (
    <div className="min-h-screen bg-film-black">
      {/* ─── BACKDROP ─── */}
      {movie.backdrop_url && (
        <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src={movie.backdrop_url}
            alt={`${movie.title} backdrop`}
            className={`w-full h-full object-cover transition-opacity duration-700 ${backdropLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setBackdropLoaded(true)}
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-film-black via-film-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-film-black/80 via-transparent to-transparent" />
          {/* Top nav overlay */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-film-black/60 to-transparent" />
        </div>
      )}

      {/* ─── MAIN CONTENT ─── */}
      <div className={`max-w-[1440px] mx-auto px-6 ${movie.backdrop_url ? '-mt-48 relative z-10' : 'pt-24'}`}>

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-film-muted hover:text-film-amber text-sm font-medium mb-8 transition-colors group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>

        {/* ─── DETAILS PANEL ─── */}
        <div className="flex flex-col md:flex-row gap-8 mb-14">
          {/* Poster */}
          <div className="w-full md:w-64 lg:w-72 shrink-0">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-film-border/30 aspect-[2/3]">
              {movie.poster_url && !imgError ? (
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full bg-film-card flex items-center justify-center text-film-muted">
                  <svg className="w-16 h-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-end pb-2 animate-fade-up">
            {/* Genre pills */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {genres.map((g) => (
                  <span
                    key={g.name}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-film-surface border border-film-border/60 text-film-soft"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wider text-film-white leading-none mb-3">
              {movie.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-film-muted text-sm">
              {year && (
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {movie.release_date}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-film-border/60 via-film-amber/20 to-transparent mb-6" />

            {/* Overview */}
            <div>
              <h3 className="text-film-amber text-xs font-mono tracking-widest uppercase mb-3">Overview</h3>
              <p className="text-film-soft leading-relaxed text-base max-w-2xl">
                {movie.overview || 'No overview available for this title.'}
              </p>
            </div>
          </div>
        </div>

        {/* ─── RECOMMENDATIONS ─── */}
        <div className="space-y-12 pb-20">
          {/* Similar Movies (TF-IDF) */}
          {(recsLoading || recs.tfidf.length > 0) && (
            <section>
              <SectionHeader icon="🔎" title="SIMILAR MOVIES" subtitle="Based on story, themes, and style" />
              <MovieGrid movies={recs.tfidf} loading={recsLoading} />
            </section>
          )}

          {/* More Like This (Genre) */}
          {(recsLoading || recs.genre.length > 0) && (
            <section>
              <SectionHeader icon="🎭" title="MORE LIKE THIS" subtitle="From the same genres" />
              <MovieGrid movies={recs.genre} loading={recsLoading && recs.tfidf.length === 0} />
            </section>
          )}

          {/* Empty state */}
          {!recsLoading && recs.tfidf.length === 0 && recs.genre.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-film-muted gap-3">
              <svg className="w-10 h-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">No recommendations available right now.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
