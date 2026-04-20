import MovieCard from './MovieCard'
import SkeletonCard from './SkeletonCard'

export default function MovieGrid({ movies, loading, cols = 6, label }) {
  const safeMovies = Array.isArray(movies) ? movies : []

  const colClasses = {
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
    7: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7',
  }

  const gridClass = colClasses[cols] || colClasses[6]

  if (loading) {
    return (
      <div className={`grid ${gridClass} gap-4`}>
        {Array.from({ length: cols * 2 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (safeMovies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-film-muted gap-4">
        <svg className="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm">No movies found</p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridClass} gap-4`}>
      {safeMovies.map((movie, i) => (
        <MovieCard key={`${movie.tmdb_id}-${i}`} movie={movie} index={i} />
      ))}
    </div>
  )
}
