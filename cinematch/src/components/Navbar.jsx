import { Link } from 'react-router-dom'

export default function Navbar() {
  const scrollToId = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className="sticky top-0 z-50 h-20 bg-film-black border-b border-film-border">
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-[15px] sm:px-[20px] md:px-[30px] lg:px-[50px]">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-1 shrink-0 select-none"
        >
          <span
            className="text-[24px] font-bold tracking-[2px] leading-none text-white"
            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
          >
              CINE
          </span>
          <span
            className="text-[24px] font-bold tracking-[2px] leading-none text-film-amber"
            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
          >
              MATCH
          </span>
        </Link>

        {/* Home link */}
        <div className="hidden items-center gap-10 md:flex">
          <button
            type="button"
            onClick={() => scrollToId('browse')}
            className="text-[13px] font-normal tracking-[0.5px] text-film-soft transition-colors duration-300 hover:text-film-amber"
            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
          >
            Browse
          </button>
          <button
            type="button"
            onClick={() => scrollToId('collections')}
            className="text-[13px] font-normal tracking-[0.5px] text-film-soft transition-colors duration-300 hover:text-film-amber"
            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
          >
            Collections
          </button>
          <button
            type="button"
            onClick={() => scrollToId('browse')}
            className="text-[13px] font-normal tracking-[0.5px] text-film-soft transition-colors duration-300 hover:text-film-amber"
            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
          >
            Watchlist
          </button>
        </div>
      </div>
    </nav>
  )
}
