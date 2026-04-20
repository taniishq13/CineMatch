import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function MovieCard({ movie, index = 0 }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const navigate = useNavigate()

  const { tmdb_id, title, poster_url, release_date } = movie
  const year = release_date ? release_date.slice(0, 4) : ''

  const handleClick = () => {
    if (tmdb_id) navigate(`/movie/${tmdb_id}`)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[8px] border border-film-border bg-film-surface text-left shadow-[0_12px_32px_rgba(0,0,0,0.32)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(0,0,0,0.5)] animate-fade-up"
      style={{
        animationDelay: `${Math.min(index * 100, 500)}ms`,
        animationFillMode: 'both',
      }}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-film-card via-film-surface to-film-black">
        {poster_url && !imgLoaded && !imgError && (
          <div className="absolute inset-0 shimmer-bg" />
        )}

        {poster_url && !imgError ? (
          <img
            src={poster_url}
            alt={title}
            className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-film-card via-[#1f1f1f] to-film-black">
            <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-film-amber/20 bg-film-black/40 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
                <svg
                  className="h-8 w-8 text-film-amber"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7.5h16M7 7.5V6a1 1 0 011-1h8a1 1 0 011 1v1.5M6 7.5v9A2.5 2.5 0 008.5 19h7A2.5 2.5 0 0018 16.5v-9M9.5 11.5h.01M14.5 11.5h.01M10 15.5h4" />
                </svg>
              </div>
              <p className="mt-4 text-[12px] font-semibold uppercase tracking-[1px] text-film-soft">
                Poster unavailable
              </p>
              <p className="mt-1 max-w-[160px] text-[11px] leading-4 text-film-muted">
                We still have the movie title and details below.
              </p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[linear-gradient(45deg,transparent_30%,rgba(255,107,53,0.1)_50%,transparent_70%)]" />
      </div>

      <div className="flex min-h-[92px] flex-col justify-end bg-film-card px-4 py-4">
        <p className="line-clamp-2 text-[15px] font-bold leading-snug text-white transition-colors duration-300 group-hover:text-film-white">
          {title}
        </p>

        <p className="mt-2 text-[12px] leading-none text-film-muted">
          {year || '—'}
        </p>
      </div>
    </button>
  )
}
