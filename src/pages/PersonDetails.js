import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { getPersonDetails } from '../services/api';
import toast from 'react-hot-toast';
import RatingChart from '../components/RatingChart';

function PersonDetails() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sorting state
  const [sortOption, setSortOption] = useState('default');
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rolesPerPage = 5;

  // Fetch person details
  useEffect(() => {
    const fetchPersonDetails = async () => {
      try {
        setLoading(true);
        const data = await getPersonDetails(id);
        setPerson(data);
      } catch (error) {
        toast.error('Failed to fetch person details');
      } finally {
        setLoading(false);
      }
    };
    fetchPersonDetails();
  }, [id]);

  // If data is still loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  // If no data or not found
  if (!person) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Person not found</h2>
      </div>
    );
  }

  // Capitalize function for role categories (e.g. "actor" -> "Actor")
  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Sorting logic
  const sortRoles = (roles) => {
    // Make a copy of roles so we don't mutate the original
    let sorted = [...roles];
    switch (sortOption) {
      case 'bestRated':
        sorted.sort((a, b) => (b.imdbRating || 0) - (a.imdbRating || 0));
        break;
      case 'lowestRated':
        sorted.sort((a, b) => (a.imdbRating || 0) - (b.imdbRating || 0));
        break;
      case 'alphabetical':
        sorted.sort((a, b) =>
          a.movieName.localeCompare(b.movieName)
        );
        break;
      default:
        // "default" - leave as is
        break;
    }
    return sorted;
  };

  const sortedRoles = sortRoles(person.roles);

  // Pagination logic
  const lastIndex = currentPage * rolesPerPage;
  const firstIndex = lastIndex - rolesPerPage;
  const currentRoles = sortedRoles.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(person.roles.length / rolesPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Check if any role has an imdbRating to show the chart
  const hasAnyRatings = person.roles.some(
    (r) => r.imdbRating !== undefined && r.imdbRating !== null
  );

  return (
    <div className="max-w-6xl mx-auto animate-fadeInSlide">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{person.name}</h1>

        <div className="flex items-center gap-6 mb-8">
          {/* Show birth year / death year if available */}
          {(person.birthYear || person.deathYear) && (
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span>
                {person.birthYear || '?'} - {person.deathYear || 'Present'}
              </span>
            </div>
          )}
        </div>

        {/* Sorting Options */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Filmography</h2>
          <select
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 transition"
            aria-label="Sort filmography"
          >
            <option value="default">Default</option>
            <option value="bestRated">Best Rated</option>
            <option value="lowestRated">Lowest Rated</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>

        {/* Filmography Table */}
        <div className="overflow-x-auto animate-popIn">
          <table className="min-w-full text-left border border-gray-200">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-4 py-2 border-b border-gray-200">Role</th>
                <th className="px-4 py-2 border-b border-gray-200">Movie</th>
                <th className="px-4 py-2 border-b border-gray-200">Characters</th>
                <th className="px-4 py-2 border-b border-gray-200">Rating</th>
              </tr>
            </thead>
            <tbody>
              {currentRoles.map((role, index) => {
                const capCategory = capitalize(role.category); // e.g. "Editor"

                return (
                  <tr
                    key={`${role.movieId}-${index}`}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-2 border-b border-gray-200">
                      {capCategory}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200">
                      {/* Link to the Movie detail page */}
                      <Link
                        to={`/movies/${role.movieId}`}
                        className="text-indigo-600 hover:underline"
                      >
                        {role.movieName}
                      </Link>
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-600">
                      {role.characters && role.characters.length > 0
                        ? role.characters.join(', ')
                        : ''}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200">
                      {role.imdbRating !== undefined && role.imdbRating !== null
                        ? role.imdbRating.toFixed(1)
                        : ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        {/* Simple Bar Chart (RatingChart) */}
        {hasAnyRatings && (
          <div className="bg-white rounded-lg p-4 mt-6 animate-fadeInSlide">
            <RatingChart roles={person.roles} />
          </div>
        )}
      </div>
    </div>
  );
}

export default PersonDetails;
