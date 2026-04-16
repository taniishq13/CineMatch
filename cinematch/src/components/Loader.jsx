export default function Loader({ text = 'Loading…', fullPage = false }) {
  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-film-black flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-film-border/30" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-film-amber animate-spin" />
          </div>
          <span className="text-film-muted text-sm font-mono">{text}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-16 gap-3 text-film-muted">
      <div className="relative w-6 h-6">
        <div className="absolute inset-0 rounded-full border-2 border-film-border/30" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-film-amber animate-spin" />
      </div>
      <span className="text-sm">{text}</span>
    </div>
  )
}
