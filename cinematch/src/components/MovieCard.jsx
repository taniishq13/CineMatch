import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function MovieCard({ movie, index = 0 }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const navigate = useNavigate()

  const { tmdb_id, title, poster_url, score } = movie

  const handleClick = () => {
    if (tmdb_id) navigate(`/movie/${tmdb_id}`)
  }

  return (
    <div
      onClick={handleClick}
      className="group relative cursor-pointer card-hover animate-fade-up"
      style={{ animationDelay: `${Math.min(index * 40, 400)}ms`, animationFillMode: 'both' }}
    >
      {/* Poster */}
      <div className="relative rounded-xl overflow-hidden bg-film-card aspect-[2/3] shadow-lg">
        {/* Skeleton */}
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 shimmer-bg" />
        )}

        {/* Poster image */}
        {poster_url && !imgError ? (
          <img
            src={poster_url}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            } group-hover:scale-105 transition-transform duration-500`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-film-muted gap-3 p-4">
            <svg className="w-10 h-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <span className="text-xs text-center opacity-50 leading-tight">{title}</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-film-black via-film-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <button className="w-full py-2 rounded-lg bg-film-amber text-film-black text-xs font-semibold tracking-wide hover:bg-film-gold transition-colors">
            View Details
          </button>
        </div>

        {/* Score badge */}
        {score !== undefined && (
          <div className="absolute top-2 right-2 bg-film-black/80 backdrop-blur-sm border border-film-amber/30 rounded-full px-2 py-0.5 flex items-center gap-1">
            <svg className="w-3 h-3 text-film-amber" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-film-amber text-xs font-mono font-medium">
              {(score * 100).toFixed(0)}%
            </span>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="mt-2.5 px-0.5">
        <p className="text-film-soft text-xs font-medium leading-snug line-clamp-2 group-hover:text-film-white transition-colors duration-200">
          {title}
        </p>
      </div>
    </div>
  )
}
