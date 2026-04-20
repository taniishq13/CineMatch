import MovieCard from './MovieCard'
import SkeletonCard from './SkeletonCard'

export default function MovieGrid({ movies, loading, cols = 6, label }) {
  const safeMovies = Array.isArray(movies) ? movies : []
  const gridClass = 'grid grid-cols-2 gap-3 sm:gap-4 md:gap-[18px] lg:gap-[25px] md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] xl:grid-cols-[repeat(auto-fit,minmax(240px,1fr))]'

  if (loading) {
    return (
      <div className={gridClass}>
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
    <div className={gridClass}>
      {safeMovies.map((movie, i) => (
        <MovieCard key={`${movie.tmdb_id}-${i}`} movie={movie} index={i} />
      ))}
    </div>
  )
}
