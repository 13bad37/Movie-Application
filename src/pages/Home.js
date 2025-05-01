import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Home() {
  const user      = useAuthStore(s => s.user)
  const clearAuth = useAuthStore(s => s.clearAuth)
  const navigate  = useNavigate()

  const handleLogout = () => {
    clearAuth()
    navigate('/')
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gray-50 animate-fadeInSlide px-4">
      <h1 className="text-5xl font-bold text-gray-800 mb-4 text-center animate-slideUp">
        Nonso Nkire’s Fabulous Movie Searching Website
      </h1>

      {user && (
        <p className="text-sm text-gray-600 mb-6">
          Signed in as <span className="font-medium">{user}</span>
        </p>
      )}

      <div className="flex gap-6 mb-6 animate-popIn">
        <Link
          to="/movies"
          className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
        >
          Movies
        </Link>

        {user ? (
          <button
            onClick={handleLogout}
            className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
            >
              Register
            </Link>
          </>
        )}
      </div>

      <p className="text-xl text-gray-600 animate-fadeIn delay-150 text-center">
        I hope you find the movie you’re after!
      </p>
    </div>
  )
}
