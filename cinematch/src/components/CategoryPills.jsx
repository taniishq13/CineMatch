const CATEGORIES = [
  { value: 'trending', label: 'Trending', icon: '🔥' },
  { value: 'popular', label: 'Popular', icon: '⭐' },
  { value: 'top_rated', label: 'Top Rated', icon: '🏆' },
  { value: 'now_playing', label: 'Now Playing', icon: '🎬' },
  { value: 'upcoming', label: 'Upcoming', icon: '🚀' },
]

export default function CategoryPills({ selected, onChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
            selected === cat.value
              ? 'bg-film-amber text-film-black border-film-amber shadow-lg shadow-film-amber/20'
              : 'bg-film-surface border-film-border/50 text-film-soft hover:border-film-amber/40 hover:text-film-white'
          }`}
        >
          <span>{cat.icon}</span>
          {cat.label}
        </button>
      ))}
    </div>
  )
}
