import { useEffect, useRef, useState } from 'react'
import { fetchHome, fetchMoodRecommendations } from '../services/api'
import MovieGrid from '../components/MovieGrid'
import MoodInput from '../components/MoodInput'
import CategoryPills from '../components/CategoryPills'
import SectionHeader from '../components/SectionHeader'
import ErrorState from '../components/ErrorState'
import Loader from '../components/Loader'

export default function Home() {
  const [category, setCategory] = useState('trending')
  const [homeMovies, setHomeMovies] = useState([])
  const [homeLoading, setHomeLoading] = useState(true)
  const [homeError, setHomeError] = useState(null)
  const [showWakeMessage, setShowWakeMessage] = useState(false)

  const [moodMovies, setMoodMovies] = useState([])
  const [moodLoading, setMoodLoading] = useState(false)
  const [moodError, setMoodError] = useState(null)
  const [moodQuery, setMoodQuery] = useState('')

  const moodResultsRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    setHomeLoading(true)
    setHomeError(null)

    fetchHome(category, 24)
      .then((data) => {
        if (!cancelled) setHomeMovies(data)
      })
      .catch((err) => {
        if (!cancelled) setHomeError(err?.message || 'Unable to load movies.')
      })
      .finally(() => {
        if (!cancelled) setHomeLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [category])

  useEffect(() => {
    const shouldShowWakeMessage = homeLoading && homeMovies.length === 0 && !homeError

    if (!shouldShowWakeMessage) {
      setShowWakeMessage(false)
      return undefined
    }

    const wakeTimer = window.setTimeout(() => {
      setShowWakeMessage(true)
    }, 1200)

    return () => window.clearTimeout(wakeTimer)
  }, [homeLoading, homeMovies.length, homeError])

  const handleMood = async (text) => {
    setMoodLoading(true)
    setMoodError(null)
    setMoodMovies([])
    setMoodQuery(text)

    try {
      const data = await fetchMoodRecommendations(text, 18)
      setMoodMovies(data)
      window.setTimeout(() => {
        moodResultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err) {
      setMoodError(err?.message || 'Unable to get recommendations.')
    } finally {
      setMoodLoading(false)
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-film-black text-white">
      <section id="hero" className="relative overflow-hidden border-b border-film-border bg-film-black">
        <div className="absolute inset-0 bg-film-grain opacity-[0.14] pointer-events-none" />
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-film-border to-transparent" />

        <div className="pointer-events-none absolute right-[-220px] top-[85px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,107,53,0.24)_0%,rgba(255,107,53,0.14)_32%,rgba(255,107,53,0.04)_58%,transparent_74%)] blur-2xl" />
        <div className="pointer-events-none absolute right-[-80px] top-[220px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,107,53,0.12)_0%,rgba(255,107,53,0.08)_36%,transparent_72%)] blur-2xl" />
        <div className="pointer-events-none absolute right-[4%] top-[220px] h-[540px] w-[540px] rounded-full border border-film-amber/10 opacity-70" />

        <div className="relative mx-auto max-w-[1200px] px-[15px] pb-[80px] pt-[100px] sm:px-[20px] md:px-[30px] lg:px-[50px]">
          <div className="max-w-[560px] animate-fade-down" style={{ animationDelay: '0s', animationFillMode: 'both' }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-film-amber/70 bg-[rgba(255,107,53,0.08)] px-5 py-3 text-[12px] font-semibold uppercase tracking-[1px] text-film-amber">
              <span className="text-[10px]">✦</span>
              AI-POWERED RECOMMENDATIONS
            </div>

            <h1
              className="mt-7 max-w-[520px] text-[42px] font-bold leading-[1.05] tracking-[-2px] text-white md:text-[56px] lg:text-[88px]"
              style={{ fontFamily: 'Georgia, Times New Roman, serif' }}
            >
              Find your
              <br />
              <span className="text-film-amber">FILM</span>
            </h1>

            <p className="mt-8 max-w-[500px] text-[14px] leading-[1.8] text-film-soft md:text-[16px]">
              Describe your mood, search by title, or browse curated collections — your perfect movie is one conversation away.
            </p>
          </div>

          <div id="collections" className="mt-14 max-w-[1100px] animate-fade-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <MoodInput onSubmit={handleMood} loading={moodLoading} />
          </div>

          {(moodLoading || moodMovies.length > 0 || moodError) && (
            <section ref={moodResultsRef} className="mt-12 animate-fade-up">
              <SectionHeader
                icon="✨"
                title="Mood Picks"
                subtitle={moodQuery ? `Because you wanted: "${moodQuery}"` : 'Curated recommendations based on your vibe.'}
                accent
              />

              <div className="mt-6">
                {moodError ? (
                  <ErrorState message={moodError} onRetry={() => handleMood(moodQuery)} />
                ) : (
                  <MovieGrid movies={moodMovies} loading={moodLoading} cols={5} />
                )}
              </div>
            </section>
          )}
        </div>
      </section>

      <section id="browse" className="border-t border-film-border bg-film-black">
        <div className="mx-auto max-w-[1200px] px-[15px] py-[60px] sm:px-[20px] md:px-[30px] lg:px-[50px]">
          <div className="flex flex-col gap-6">
            <SectionHeader icon="🔥" title="Trending Now" />
            <CategoryPills selected={category} onChange={setCategory} />
          </div>

          <div className="mt-10">
            {homeError ? (
              <ErrorState message={homeError} onRetry={() => setCategory(category)} />
            ) : (
              <MovieGrid movies={homeMovies} loading={homeLoading} />
            )}
          </div>

          <p className="mt-10 text-center text-[12px] text-film-muted">
            Scroll to discover more → Hover over cards for details
          </p>
        </div>
      </section>

      {showWakeMessage && (
        <Loader fullPage text="Waking up server... this may take ~30 seconds" />
      )}
    </div>
  )
}
