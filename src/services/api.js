import axios from 'axios'
import toast from 'react-hot-toast'

// base URL for all requests
axios.defaults.baseURL = '/api'

// Attach bearer on every request if present 
export function setAuthToken(token) {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common['Authorization']
  }
}

// Response interceptor for 401 (refresh flow)
axios.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    const refreshToken = localStorage.getItem('refreshToken')
    if (
      err.response?.status === 401 &&
      !original._retry &&
      refreshToken
    ) {
      original._retry = true
      try {
        const r = await axios.post('/user/refresh', { refreshToken })
        const newToken = r.data.bearerToken.token

        // persist & re-attach
        localStorage.setItem('token', newToken)
        setAuthToken(newToken)

        // retry original
        original.headers['Authorization'] = `Bearer ${newToken}`
        return axios(original)
      } catch (e) {
        toast.error('Session expired. Please log in again.')
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        setAuthToken(null)
        window.location.href = '/login'
        return Promise.reject(e)
      }
    }
    return Promise.reject(err)
  }
)

// Call /user/logout endpoint ———
export async function logoutApi() {
  const refreshToken = localStorage.getItem('refreshToken')
  return (await axios.post('/user/logout', { refreshToken })).data
}

export const searchMovies = async (title, year, page) => {
  const params = { page }
  if (title) params.title = title
  if (typeof year === 'number' && !isNaN(year)) params.year = year

  const res = await axios.get('/movies/search', { params })
  return {
    movies: res.data.data,
    total:  res.data.pagination.total,
  }
}

export const getMovieDetails = async (imdbID) => {
  const res = await axios.get(`/movies/data/${imdbID}`)
  return res.data
}

export const getPersonDetails = async (id) => {
  const res = await axios.get(`/people/${id}`)
  return res.data
}

export const login = async (email, password) => {
  const res = await axios.post('/user/login', { email, password })
  return {
    token:        res.data.bearerToken.token,
    refreshToken: res.data.refreshToken.token,
  }
}

export const register = async (email, password) => {
  return (await axios.post('/user/register', { email, password })).data
}
