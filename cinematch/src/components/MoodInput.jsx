import { useState } from 'react'

export const MOOD_CHIPS = [
  'Something funny & light',
  'Dark and thrilling',
  'Inspiring and hopeful',
  'Action-packed adventure',
  'Romantic evening',
  'Mind-bending sci-fi',
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
    <div className="relative overflow-hidden rounded-[12px] border border-film-border bg-film-surface shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
      <div className="pointer-events-none absolute right-[-140px] top-[-140px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,107,53,0.09)_0%,rgba(255,107,53,0.05)_35%,transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-24 w-96 -translate-x-1/2 rounded-full bg-film-amber/5 blur-3xl" />

      <div className="relative z-10 p-5 sm:p-6 md:p-10">
        <div className="grid gap-4 md:grid-cols-[50px_minmax(0,1fr)] md:gap-[15px]">
          <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[6px] bg-film-amber text-[28px] shadow-[0_10px_30px_rgba(255,107,53,0.24)]">
            🎬
          </div>

          <div className="min-w-0">
            <h2 className="text-[18px] font-semibold leading-tight text-white">
              What are you in the mood for?
            </h2>
            <p className="mt-1 max-w-[560px] text-[13px] leading-6 text-film-muted">
              Describe a feeling, theme, or vibe — our AI will find the perfect film.
            </p>

            <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKey}
                placeholder="e.g. something light and funny after a long week..."
                className="h-[46px] flex-1 rounded-[8px] border border-film-border bg-film-card px-4 text-[14px] text-white outline-none transition-all duration-300 placeholder:text-film-muted focus:border-film-amber focus:bg-[rgba(255,107,53,0.05)]"
              />

              <button
                onClick={handleSubmit}
                disabled={loading || !text.trim()}
                className="inline-flex h-[46px] shrink-0 items-center justify-center rounded-[6px] bg-gradient-to-r from-film-amber to-film-ember px-8 text-[14px] font-semibold tracking-[0.5px] text-white shadow-[0_8px_24px_rgba(255,107,53,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,107,53,0.3)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-40"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Finding...
                  </span>
                ) : (
                  '→ Recommend'
                )}
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {MOOD_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleChip(chip)}
                  className={`rounded-[6px] border px-4 py-2.5 text-[12px] transition-all duration-300 ${
                    text === chip
                      ? 'border-film-amber text-film-amber'
                      : 'border-film-border text-film-soft hover:border-film-amber hover:text-film-amber'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
