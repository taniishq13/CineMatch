export default function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[8px] border border-film-border bg-film-surface animate-pulse">
      <div className="aspect-[2/3] shimmer-bg" />
      <div className="bg-film-card px-4 py-4">
        <div className="h-4 w-3/4 rounded-full shimmer-bg" />
        <div className="mt-3 h-3 w-1/3 rounded-full shimmer-bg" />
        <div className="mt-4 flex gap-1">
          <div className="h-3 w-3 rounded-full shimmer-bg" />
          <div className="h-3 w-3 rounded-full shimmer-bg" />
          <div className="h-3 w-3 rounded-full shimmer-bg" />
          <div className="h-3 w-3 rounded-full shimmer-bg" />
          <div className="h-3 w-3 rounded-full shimmer-bg" />
        </div>
      </div>
    </div>
  )
}
