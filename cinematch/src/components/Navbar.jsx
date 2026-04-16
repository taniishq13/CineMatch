import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass border-b border-film-border/50'
          : 'bg-gradient-to-b from-film-black/90 to-transparent border-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center gap-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0 group"
        >
          <div className="relative">
            <span className="font-display text-3xl tracking-widest text-gradient-amber leading-none">
              CINE
            </span>
            <span className="font-display text-3xl tracking-widest text-film-white leading-none">
              MATCH
            </span>
            <div className="absolute -bottom-0.5 left-0 w-full h-px bg-gradient-to-r from-film-amber to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <div className="w-72 hidden sm:block">
          <SearchBar
            compact
            onSelect={(movie) => navigate(`/movie/${movie.tmdb_id}`)}
          />
        </div>

        {/* Home link */}
        <Link
          to="/"
          className="flex items-center gap-2 text-film-soft hover:text-film-white text-sm font-medium tracking-wide transition-colors duration-200 shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </Link>
      </div>
    </nav>
  )
}
