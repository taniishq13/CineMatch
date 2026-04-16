export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-film-ember/10 border border-film-ember/20 flex items-center justify-center">
        <svg className="w-7 h-7 text-film-ember" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <div>
        <p className="text-film-text font-medium">Something went wrong</p>
        <p className="text-film-muted text-sm mt-1 max-w-xs">{message || 'Unable to load content. Please try again.'}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg border border-film-border/60 text-film-soft text-sm hover:border-film-amber/40 hover:text-film-amber transition-all duration-200"
        >
          Try again
        </button>
      )}
    </div>
  )
}
