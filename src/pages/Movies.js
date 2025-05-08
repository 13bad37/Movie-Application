import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronsLeft, ChevronsRight, ArrowUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { searchMovies } from '../services/api'
import MovieCard from '../components/MovieCard'

export default function Movies() {
  const [movies, setMovies]           = useState([])
  const [loading, setLoading]         = useState(false)

  // Controlled inputs
  const [tempTitle, setTempTitle]     = useState('')
  const [tempYear, setTempYear]       = useState('')
  const [filters, setFilters]         = useState({ title: '', year: '' })

  const [currentPage, setCurrentPage] = useState(() => {
    const last = parseInt(sessionStorage.getItem('lastPage'), 10)
    return !isNaN(last) && last > 0 ? last : 1
  })
  const [totalPages, setTotalPages]   = useState(1)
  const [gotoPage, setGotoPage]       = useState('')
  const [showTopBtn, setShowTopBtn]   = useState(false)

  const cacheRef = useRef({})         // { "title|year|page": { list, pages } }
  const abortRef = useRef(null)       // to cancel stale requests
  const restoredScrollRef = useRef(false)
  const PER_PAGE = 100

  // Fetch function, wrapped in useCallback so we can cancel it
  const fetchData = useCallback(async () => {
    const { title, year } = filters
    const page = currentPage
    const key = `${title}|${year}|${page}`

    // If the user has looked at this exact result, cache it then use it
    if (cacheRef.current[key]) {
      const { list, pages } = cacheRef.current[key]
      setMovies(list)
      setTotalPages(pages)
    } else {
      // Cancel any in-flight request
      if (abortRef.current) abortRef.current.abort()
      const ctrl = new AbortController()
      abortRef.current = ctrl

      setLoading(true)
      try {
        const yearParam = year ? parseInt(year, 10) : undefined
        const { movies: list, total } = await searchMovies(
          title,
          yearParam,
          page,
          { signal: ctrl.signal }
        )

        const pages = Math.ceil(total / PER_PAGE)
        setMovies(list)
        setTotalPages(pages)
        cacheRef.current[key] = { list, pages }

        sessionStorage.setItem('moviesList', JSON.stringify(list))
        sessionStorage.setItem('lastPage', page)
      } catch (err) {
        if (err.name !== 'CanceledError') {
          console.error(err)
          toast.error('Failed to fetch movies')
          setMovies([])
          setTotalPages(1)
        }
      } finally {
        setLoading(false)
      }
    }

    // Restore scroll once
    const lastScroll = parseInt(sessionStorage.getItem('lastScroll'), 10)
    if (!isNaN(lastScroll) && !restoredScrollRef.current) {
      window.scrollTo({ top: lastScroll, behavior: 'auto' })
      sessionStorage.removeItem('lastScroll')
      restoredScrollRef.current = true
    }
  }, [filters, currentPage])

  // Run fetchData whenever filters or page change
  useEffect(() => {
    fetchData()
    return () => {
      if (abortRef.current) abortRef.current.abort()
    }
  }, [fetchData])

  // Clean up the scroll button listener
  useEffect(() => {
    const onScroll = () =>
      setShowTopBtn(window.scrollY + window.innerHeight >= document.body.scrollHeight - 200)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Handlers
  const handleSearch = e => {
    e.preventDefault()
    restoredScrollRef.current = false
    setFilters({ title: tempTitle.trim(), year: tempYear.trim() })
    setCurrentPage(1)
  }

  const handleGoto = e => {
    e.preventDefault()
    const p = parseInt(gotoPage, 10)
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      restoredScrollRef.current = false
      setCurrentPage(p)
    } else {
      toast.error(`Enter a number between 1 and ${totalPages}`)
    }
    setGotoPage('')
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const handleCardClick = () => sessionStorage.setItem('lastScroll', window.scrollY)

  return (
    <div className="max-w-7xl mx-auto px-4 relative">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8 animate-fadeInSlide">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Movie Title
            </label>
            <input
              type="text"
              value={tempTitle}
              onChange={e => setTempTitle(e.target.value)}
              placeholder="Search movies…"
              className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              type="number"
              value={tempYear}
              onChange={e => setTempYear(e.target.value)}
              placeholder="Year"
              min="1900"
              max={new Date().getFullYear()}
              className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transform hover:scale-105 transition flex items-center gap-2 disabled:opacity-50"
          >
            <Search className="h-5 w-5" /> Search
          </button>
        </div>
      </form>

      {/* Movie Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {movies.map(m => (
          <Link
            key={m.imdbID}
            to={`/movies/${m.imdbID}`}
            onClick={handleCardClick}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow animate-popIn"
          >
            <MovieCard imdbID={m.imdbID} title={m.title} year={m.year} />
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap justify-center items-center gap-4 my-8">
        <button
          onClick={() => { setCurrentPage(1); restoredScrollRef.current = false }}
          disabled={currentPage === 1 || loading}
          className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition"
          title="First page"
        >
          <ChevronsLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); restoredScrollRef.current = false }}
          disabled={currentPage === 1 || loading}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition"
        >
          Prev
        </button>
        <span className="font-medium">Page {currentPage} of {totalPages}</span>
        <form onSubmit={handleGoto} className="flex items-center gap-2">
          <input
            type="number"
            value={gotoPage}
            onChange={e => setGotoPage(e.target.value)}
            placeholder="Go to"
            min="1"
            max={totalPages}
            className="w-20 px-2 py-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
          <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
            Go
          </button>
        </form>
        <button
          onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); restoredScrollRef.current = false }}
          disabled={currentPage === totalPages || loading}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition"
        >
          Next
        </button>
        <button
          onClick={() => { setCurrentPage(totalPages); restoredScrollRef.current = false }}
          disabled={currentPage === totalPages || loading}
          className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition"
          title="Last page"
        >
          <ChevronsRight className="h-5 w-5" />
        </button>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        </div>
      )}

      {/* Back to Top */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition"
          title="Back to top"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}
