import { useState } from 'react'

const MOOD_CHIPS = [
  'Something funny & light',
  'Dark and thrilling',
  'Relaxing after work',
  'Inspiring and hopeful',
  'Action-packed adventure',
  'Romantic evening',
  'Mind-bending sci-fi',
  'Classic masterpiece',
]

export default function MoodInput({ onSubmit, loading }) {
  const [text, setText] = useState('')

  const handleChip = (chip) => {
    setText(chip)
  }

  const handleSubmit = () => {
    if (text.trim()) onSubmit(text.trim())
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="relative rounded-2xl overflow-hidden border border-film-border/60 bg-gradient-to-br from-film-surface to-film-card">
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-film-amber/5 blur-3xl rounded-full pointer-events-none" />

      <div className="relative p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-film-amber to-film-ember flex items-center justify-center shrink-0 shadow-lg shadow-film-amber/20">
            <svg className="w-5 h-5 text-film-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div>
            <h2 className="text-film-white font-semibold text-lg leading-tight">
              What are you in the mood for?
            </h2>
            <p className="text-film-muted text-sm mt-1">
              Describe a feeling, theme, or vibe — our AI will find the perfect film.
            </p>
          </div>
        </div>

        {/* Input area */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKey}
              placeholder="e.g. something light and funny after a long week…"
              className="w-full bg-film-black/50 border border-film-border/60 focus:border-film-amber/50 focus:ring-1 focus:ring-film-amber/30 rounded-xl px-4 py-3.5 text-sm text-film-text placeholder-film-muted outline-none transition-all duration-200"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
            className="shrink-0 px-6 py-3.5 rounded-xl bg-gradient-to-r from-film-amber to-film-gold text-film-black text-sm font-semibold tracking-wide hover:shadow-lg hover:shadow-film-amber/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-film-black/30 border-t-film-black rounded-full animate-spin" />
                Finding…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
                </svg>
                Recommend
              </>
            )}
          </button>
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          {MOOD_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => handleChip(chip)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 hover:-translate-y-0.5 ${
                text === chip
                  ? 'bg-film-amber/10 border-film-amber/50 text-film-amber'
                  : 'bg-film-black/30 border-film-border/40 text-film-muted hover:border-film-amber/30 hover:text-film-soft'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
