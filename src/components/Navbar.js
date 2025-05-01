import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Navbar() {
  const user      = useAuthStore(s => s.user)
  const clearAuth = useAuthStore(s => s.clearAuth)
  const navigate  = useNavigate()

  const handleLogout = () => {
    clearAuth()
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    navigate('/login', { replace: true })
  }

  // We replace the <Link> to /movies with reloadDocument so it truly remounts.
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      <div className="flex items-center space-x-6">
        <Link
          to="/"
          className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition"
        >
          Movie Explorer
        </Link>
        <Link
          to="/movies"
          reloadDocument
          className="text-gray-700 hover:text-indigo-600 transition font-medium"
        >
          Movies
        </Link>
      </div>

      <div className="flex items-center space-x-6">
        {user ? (
          <>
            <span className="text-gray-700 font-medium">{user}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
