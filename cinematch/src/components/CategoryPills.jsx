const CATEGORIES = [
  { value: 'trending', label: 'Trending' },
  { value: 'popular', label: 'Popular' },
  { value: 'top_rated', label: 'Top Rated' },
  { value: 'now_playing', label: 'Now Playing' },
  { value: 'upcoming', label: 'Coming Soon' },
]

export default function CategoryPills({ selected, onChange }) {
  return (
    <div className="flex w-full gap-10 overflow-x-auto border-b border-film-border pb-4">
      {CATEGORIES.map((cat) => {
        const active = selected === cat.value

        return (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            className={`relative flex-shrink-0 pb-1 text-[14px] transition-colors duration-300 ${
              active ? 'text-film-amber' : 'text-film-soft hover:text-white'
            }`}
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif' }}
          >
            {cat.label}
            {active && (
              <span className="absolute left-0 right-0 -bottom-[17px] h-[2px] bg-film-amber" />
            )}
          </button>
        )
      })}
    </div>
  )
}
