export default function SectionHeader({ icon, title, subtitle, accent = false }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {icon && (
        <span className="text-2xl leading-none">{icon}</span>
      )}
      <div>
        <h2 className={`font-display tracking-wider text-2xl leading-none ${accent ? 'text-gradient-amber' : 'text-film-white'}`}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-film-muted text-sm mt-1">{subtitle}</p>
        )}
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-film-border/60 to-transparent ml-4" />
    </div>
  )
}
