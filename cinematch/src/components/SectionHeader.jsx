export default function SectionHeader({ icon, title, subtitle, accent = false }) {
  return (
    <div className="flex items-center gap-4">
      {icon && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] bg-film-amber text-[20px] shadow-[0_8px_20px_rgba(255,107,53,0.18)]">
          <span aria-hidden="true">{icon}</span>
        </div>
      )}

      <div className="min-w-0">
        <h2
          className={`text-[28px] font-bold tracking-[-0.5px] leading-none ${
            accent ? 'text-film-amber' : 'text-white'
          }`}
          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif' }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-[13px] text-film-muted">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
