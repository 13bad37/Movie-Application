import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-10">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <Link to="/" aria-label="Home" className="text-xl font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
            Movie Explorer
          </Link>
          <Link to="/movies" className="hover:text-indigo-800 transition-colors">
            Movies
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {token ? (
            <>
              <span className="text-gray-700">{userEmail}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-800 transition-colors">
                Login
              </Link>
              <Link to="/register" className="hover:text-indigo-800 transition-colors">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
