import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Clock,
  Globe,
  Users,
  ChevronLeft,
  ChevronRight,
  DollarSign,
} from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';
import { getMovieDetails } from '../services/api';
import toast from 'react-hot-toast';

// Some country names to ISO alpha-2 codes for ReactCountryFlag
const countryMap = {
  'united states': 'US',
  'australia': 'AU',
  'new zealand': 'NZ',
  'united kingdom': 'GB',
  'finland': 'FI',
  'sweden': 'SE',
  'india': 'IN',
  'china': 'CN',
  'japan': 'JP',
  'france': 'FR',
  'germany': 'DE',
  'west germany': 'DE',
  'hong kong' : 'HK',
  'ireland' : 'IE',
  'italy' : 'IT',
  'iran' : 'IR',
  // Add more later maybe
};

function MovieDetails() {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const data = await getMovieDetails(imdbID);
        setMovie(data);
      } catch (error) {
        toast.error('Failed to fetch movie details');
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [imdbID]);

  // Retrieve stored movies for navigation
  const storedMovies = JSON.parse(sessionStorage.getItem('moviesList') || '[]');
  const currentIndex = storedMovies.findIndex((m) => m.imdbID === imdbID);

  const handleNavigation = (direction) => {
    if (direction === 'prev' && currentIndex > 0) {
      const prevMovie = storedMovies[currentIndex - 1];
      navigate(`/movies/${prevMovie.imdbID}`);
    } else if (direction === 'next' && currentIndex < storedMovies.length - 1) {
      const nextMovie = storedMovies[currentIndex + 1];
      navigate(`/movies/${nextMovie.imdbID}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }
  if (!movie) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Movie not found</h2>
      </div>
    );
  }

  // Parse up to 2 countries in alphabetical order
  const parseCountries = (cstr) => {
    if (!cstr) return [];
    return cstr
      .split(',')
      .map((c) => c.trim())
      .sort((a, b) => a.localeCompare(b))
      .slice(0, 2);
  };
  const countries = parseCountries(movie.country);

  // Format box office
  const boxOfficeRaw = movie.boxoffice;
  const boxOffice = boxOfficeRaw
    ? `$${boxOfficeRaw.toLocaleString()}`
    : 'N/A';

  // Ratings
  const imdbObj  = movie.ratings.find((r) => r.source === 'Internet Movie Database');
  const rtObj    = movie.ratings.find((r) => r.source === 'Rotten Tomatoes');
  const metaObj  = movie.ratings.find((r) => r.source === 'Metacritic');

  const imdbRating = imdbObj && imdbObj.value ? imdbObj.value : 'N/A';
  const rtRating   = rtObj   && rtObj.value   ? rtObj.value   : 'N/A';
  const metaRating = metaObj && metaObj.value ? metaObj.value : 'N/A';

  // Helper to capitalize category in Cast & Crew
  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden animate-fadeInSlide">
      <div className="md:flex">
        {/* Posters*/}
        <div className="md:w-1/3 flex justify-center items-center p-4">
          <img
            src={movie.poster || 'https://via.placeholder.com/500x750?text=No+Poster'}
            alt={movie.title}
            className="max-w-xs max-h-[700px] object-contain"
          />
        </div>

        {/* Info*/}
        <div className="md:w-2/3 p-8">
          {/* Title*/}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{movie.title}</h1>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres.map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm hover:bg-indigo-200 transition-colors"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Info Row*/}
          <div className="flex flex-wrap gap-8 items-center text-lg font-medium mb-6">
            {/* Runtime */}
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span>{movie.runtime} minutes</span>
            </div>
            {/* Release Year */}
            <div>{movie.year}</div>
            {/* Countries */}
            <div className="flex items-center gap-2">
              {countries.map((cName, idx) => {
                const isoCode = countryMap[cName.toLowerCase()];
                return (
                  <div key={idx} className="flex items-center gap-1">
                    {isoCode && (
                      <ReactCountryFlag
                        countryCode={isoCode}
                        svg
                        style={{ width: '1.5em', height: '1.5em' }}
                        title={cName}
                      />
                    )}
                    <span>{cName}</span>
                  </div>
                );
              })}
            </div>
            {/* Box Office */}
            <div 
              className="flex items-center gap-2 group"
              title= "Box Office Earnings (USD)"
            >
              <DollarSign className="h-5 w-5 text-gray-500 transition group-hover:text-indigo-600" />
              <span className="transition group-hover:text-indigo-600">
                {boxOffice}
              </span>
            </div>
          </div>
          
          {/* Ratings */}
          <div className="flex items-center gap-6 mb-6">
            {/* IMDb */}
            <div className="flex items-center gap-1 group">
              <img
                src="/images/imdb.png"
                alt="IMDb"
                className="h-6 w-6 transition-transform group-hover:scale-110"
                title="Internet Movie Database"
              />
              <span className="text-gray-700">{imdbRating}</span>
            </div>
            {/* Rotten Tomatoes */}
            <div className="flex items-center gap-1 group">
              <img
                src="/images/Rotten_Tomatoes.svg.png"
                alt="Rotten Tomatoes"
                className="h-6 w-6 transition-transform group-hover:scale-110"
                title="Rotten Tomatoes"
              />
              <span className="text-gray-700">{rtRating}</span>
            </div>
            {/* Metacritic */}
            <div className="flex items-center gap-1 group">
              <img
                src="/images/Metacritic_M.png"
                alt="Metacritic"
                className="h-6 w-6 transition-transform group-hover:scale-110"
                title="Metacritic"
              />
              <span className="text-gray-700">{metaRating}</span>
            </div>
          </div>

          {/* Plot */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Plot</h2>
            <p className="text-gray-600">{movie.plot}</p>
          </div>

          {/* Cast & Crew */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Cast &amp; Crew
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {movie.principals.map((person) => (
                <Link
                  key={person.id}
                  to={`/person/${person.id}`}
                  className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">{person.name}</h3>
                    <p className="text-gray-600">
                      {person.category ? capitalize(person.category) : ''}
                    </p>
                    {person.characters && person.characters.length > 0 && (
                      <p className="text-sm text-gray-500">
                        {person.characters.join(', ')}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {storedMovies.length > 0 && currentIndex !== -1 && (
            <div className="flex justify-between mt-6">
              <button
                onClick={() => handleNavigation('prev')}
                disabled={currentIndex === 0}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition disabled:opacity-50 flex items-center gap-2"
                aria-label="Previous Movie"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleNavigation('next')}
                disabled={currentIndex === storedMovies.length - 1}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition disabled:opacity-50 flex items-center gap-2"
                aria-label="Next Movie"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
