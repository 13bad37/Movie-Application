import React, { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { login, setAuthToken } from '../services/api'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const from     = location.state?.from?.pathname || '/movies'

  // pull in setAuth from Zustand store
  const setAuth = useAuthStore(s => s.setAuth)

  const handleSubmit = async e => {
    e.preventDefault()              // ← stop any native reload
    setError('')

    try {
      setLoading(true)
      const data = await login(email, password)

      // 1) Persist tokens
      localStorage.setItem('token', data.token)
      localStorage.setItem('refreshToken', data.refreshToken)

      // 1b) Make axios use this token immediately
      setAuthToken(data.token)

      // 2) Tell global store that user is logged in
      setAuth(email)

      toast.success('Logged in successfully')
      // 3) Go back to where they came from
      navigate(from, { replace: true })
    } catch (err) {
      console.error(err)
      // handle the error message without ever reloading
      const msg = err.response?.data?.message?.toLowerCase() || ''
      if (msg.includes('email not found')) {
        setError('That email is not registered.')
      } else if (msg.includes('invalid password')) {
        setError('Wrong password. Please check.')
      } else {
        setError('Email or password is invalid.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto animate-fadeInSlide">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-center mb-8">
          <div className="bg-indigo-100 p-3 rounded-full">
            <LogIn className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Log in to your account
        </h1>

        {error && (
          <div className="text-red-600 text-sm mb-4" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* email & password inputs */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              autoComplete="username"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                         focus:border-indigo-500 focus:ring-indigo-500 transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                         focus:border-indigo-500 focus:ring-indigo-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm
                       font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none
                       focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50
                       transition transform hover:scale-105"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link
            to="/register"
            className="text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}
