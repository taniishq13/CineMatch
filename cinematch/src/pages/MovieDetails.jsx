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
      <section className="relative isolate overflow-hidden border-b border-film-border bg-film-black">
        <div className="absolute inset-0 bg-film-grain opacity-[0.12] pointer-events-none" />
        <div className="pointer-events-none absolute left-[-140px] top-[12%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,107,53,0.16)_0%,transparent_72%)] blur-3xl" />
        <div className="pointer-events-none absolute right-[-180px] top-[18%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,107,53,0.12)_0%,transparent_74%)] blur-3xl" />

        {movie.backdrop_url ? (
          <div className="relative h-[56vh] min-h-[420px] md:h-[68vh] md:min-h-[540px]">
            <img
              src={movie.backdrop_url}
              alt={`${movie.title} backdrop`}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ${
                backdropLoaded ? 'opacity-90 scale-100' : 'opacity-0 scale-105'
              }`}
              onLoad={() => setBackdropLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-film-black via-film-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-film-black/90 via-film-black/45 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-film-black/20" />
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-film-black/70 to-transparent" />
          </div>
        ) : (
          <div className="relative h-[28vh] min-h-[240px] md:h-[36vh] md:min-h-[320px]">
            <div className="absolute inset-0 bg-gradient-to-br from-film-black via-film-surface to-film-black" />
            <div className="absolute inset-0 bg-gradient-to-r from-film-black/95 via-film-black/40 to-transparent" />
            <div className="absolute inset-0 bg-film-grain opacity-[0.08]" />
          </div>
        )}
      </section>

      {/* ─── MAIN CONTENT ─── */}
      <div className={`mx-auto max-w-[1200px] px-[15px] sm:px-[20px] md:px-[30px] lg:px-[50px] ${movie.backdrop_url ? '-mt-28 pb-20 relative z-10 sm:-mt-36 lg:-mt-44' : 'pt-24 pb-20'}`}>

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-film-muted transition-colors group hover:text-film-amber"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>

        {/* ─── DETAILS PANEL ─── */}
        <div className="relative overflow-hidden rounded-[24px] border border-film-border bg-[linear-gradient(180deg,rgba(26,26,26,0.94)_0%,rgba(17,17,17,0.88)_100%)] shadow-[0_32px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,107,53,0.08)_0%,transparent_45%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-film-amber/30 to-transparent" />

          <div className="flex items-center justify-between border-b border-film-border/70 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-film-amber/20 bg-film-amber/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[1px] text-film-amber">
                Now Showing
              </span>
              <span className="text-[12px] uppercase tracking-[1px] text-film-muted">
                Cinematic Details
              </span>
            </div>
            <span className="text-[12px] text-film-soft">
              {year || '—'}
            </span>
          </div>

          <div className="grid gap-8 px-5 py-6 sm:px-6 sm:py-7 md:grid-cols-[280px_minmax(0,1fr)] md:px-8 md:py-8">
            {/* Poster */}
            <div className="w-full shrink-0">
              <div className="relative overflow-hidden rounded-[20px] border border-film-border bg-film-card aspect-[2/3] shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
                {movie.poster_url && !imgError ? (
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-film-card via-[#1f1f1f] to-film-black">
                    <div className="absolute right-[-18%] top-[-12%] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(255,107,53,0.12)_0%,transparent_72%)] blur-3xl" />
                    <div className="flex flex-col items-center justify-center px-6 text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-film-amber/20 bg-film-black/40 shadow-[0_12px_32px_rgba(0,0,0,0.25)]">
                        <svg className="h-10 w-10 text-film-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7.5h16M7 7.5V6a1 1 0 011-1h8a1 1 0 011 1v1.5M6 7.5v9A2.5 2.5 0 008.5 19h7A2.5 2.5 0 0018 16.5v-9M9.5 11.5h.01M14.5 11.5h.01M10 15.5h4" />
                        </svg>
                      </div>
                      <p className="mt-5 text-[12px] font-semibold uppercase tracking-[1px] text-film-soft">
                        Poster unavailable
                      </p>
                      <p className="mt-1 max-w-[180px] text-[11px] leading-4 text-film-muted">
                        We still have the movie title, details, and recommendations.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col justify-end pb-2 animate-fade-up">
              {/* Genre pills */}
              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
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

              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-film-border bg-film-black/40 px-3 py-1 text-[11px] uppercase tracking-[1px] text-film-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-film-amber" />
                Featured Film
              </div>

              {/* Title */}
              <h1 className="mb-4 font-display text-4xl leading-none tracking-wider text-film-white md:text-5xl lg:text-6xl">
                {movie.title}
              </h1>

              {/* Meta row */}
              <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-film-muted">
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
              <div className="mb-6 h-px bg-gradient-to-r from-film-border/60 via-film-amber/20 to-transparent" />

              {/* Overview */}
              <div>
                <h3 className="mb-3 text-xs font-mono uppercase tracking-widest text-film-amber">Overview</h3>
                <p className="max-w-2xl text-base leading-relaxed text-film-soft">
                  {movie.overview || 'No overview available for this title.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── RECOMMENDATIONS ─── */}
        <div className="space-y-12 py-20">
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
