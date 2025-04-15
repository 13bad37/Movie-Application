import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { searchMovies } from '../services/api';
import toast from 'react-hot-toast';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch movies from the API and update session storage with cumulative results
  const fetchMovies = async (page = 1, title = searchTitle, year = searchYear) => {
    try {
      setLoading(true);
      const numericYear = year ? parseInt(year) : undefined;
      const data = await searchMovies(title, numericYear, page);
      
      if (page === 1) {
        // For a new search, reset movies
        setMovies(data.movies);
        sessionStorage.setItem('moviesList', JSON.stringify(data.movies));
      } else {
        // For subsequent pages, append the new movies to the previous list
        const newMovies = [...movies, ...data.movies];
        setMovies(newMovies);
        sessionStorage.setItem('moviesList', JSON.stringify(newMovies));
      }
      
      setTotalPages(Math.ceil(data.total / 100));
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to fetch movies');
      setMovies([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll
  const loadMore = useCallback(() => {
    if (currentPage < totalPages && !loading) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [currentPage, totalPages, loading]);

  const lastMovieRef = useInfiniteScroll(loadMore);

  // Run fetchMovies when currentPage changes
  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchMovies(1);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <form onSubmit={handleSearch} className="mb-8 animate-fadeInSlide">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Movie Title
            </label>
            <input
              type="text"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="Search movies..."
            />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              type="number"
              value={searchYear}
              onChange={(e) => setSearchYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="Year"
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition transform hover:scale-105 flex items-center gap-2"
          >
            <Search className="h-5 w-5" />
            Search
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {movies.map((movie, index) => {
          const isLastElement = index === movies.length - 1;
          return (
            <Link
              key={movie.imdbID}
              ref={isLastElement ? lastMovieRef : null}
              to={`/movies/${movie.imdbID}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow animate-popIn"
            >
              <img
                src={movie.poster || 'https://via.placeholder.com/300x450?text=No+Poster'}
                alt={movie.title}
                className="w-full h-96 object-cover transition"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{movie.title}</h3>
                <p className="text-gray-600">{movie.year}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        </div>
      )}
    </div>
  );
}

export default Movies;
