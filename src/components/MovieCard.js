import React, { useState, useEffect } from 'react'
import { Link }                   from 'react-router-dom'
import { useInView }              from 'react-intersection-observer'
import { getMovieDetails }        from '../services/api'

export default function MovieCard({ imdbID, title, year }) {
  const [poster, setPoster]   = useState(null)
  const [loading, setLoading] = useState(false)
  const { ref, inView }       = useInView({
    triggerOnce: true,
    rootMargin: '200px',
  })

  useEffect(() => {
    const key = `movie-${imdbID}`
    const cached = sessionStorage.getItem(key)
    if (cached) {
      setPoster(JSON.parse(cached).poster)
      return
    }
    if (!inView) return

    setLoading(true)
    getMovieDetails(imdbID)
      .then((data) => {
        setPoster(data.poster)
        sessionStorage.setItem(key, JSON.stringify({ poster: data.poster }))
      })
      .catch(() => {
        // swallow errors, leave poster null
      })
      .finally(() => setLoading(false))
  }, [inView, imdbID])

  return (
    <Link
      to={`/movies/${imdbID}`}
      ref={ref}
      className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
        {loading ? (
          <div className="animate-spin h-8 w-8 border-b-2 border-indigo-600 rounded-full" />
        ) : (
          <img
            src={
              poster ||
              'https://via.placeholder.com/300x450?text=No+Poster'
            }
            alt={title}
            className="object-cover w-full h-full transition-transform group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {title}
        </h3>
        <p className="text-gray-600">{year}</p>
      </div>
    </Link>
  )
}
