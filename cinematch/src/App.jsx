import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'

export default function App() {
  return (
    <div className="min-h-screen bg-film-black">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:tmdbId" element={<MovieDetails />} />
      </Routes>
    </div>
  )
}
