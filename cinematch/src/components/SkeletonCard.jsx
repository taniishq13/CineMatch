export default function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="rounded-xl overflow-hidden aspect-[2/3] shimmer-bg" />
      <div className="mt-2.5 space-y-1.5">
        <div className="h-3 rounded-full shimmer-bg w-3/4" />
        <div className="h-3 rounded-full shimmer-bg w-1/2" />
      </div>
    </div>
  )
}
