import axios from 'axios'
import toast from 'react-hot-toast'

// Base URL for all requests
axios.defaults.baseURL = 'http://4.237.58.241:3000'

// Request interceptor
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

//Response interceptor: on 401, try refresh (excludes auth call)
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    error ? prom.reject(error) : prom.resolve(token)
  })
  failedQueue = []
}

axios.interceptors.response.use(
  res => res,
  err => {
    const { config, response } = err
    const originalRequest = config

    // if it's a 401 from login/register/refresh - just reject
    if (
      response?.status === 401 &&
      /\/user\/(login|register|refresh)/.test(originalRequest.url)
    ) {
      return Promise.reject(err)
    }

    // if not, for other 401s, attempt token refresh once
    if (
      response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refreshToken')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return axios(originalRequest)
          })
          .catch(e => Promise.reject(e))
      }

      originalRequest._retry = true
      isRefreshing = true

      return new Promise((resolve, reject) => {
        axios
          .post('/user/refresh', {
            token: localStorage.getItem('refreshToken'),
          })
          .then(({ data }) => {
            const newToken = data.bearerToken.token
            const newRefresh = data.refreshToken.token

            // persist new tokens
            localStorage.setItem('token', newToken)
            localStorage.setItem('refreshToken', newRefresh)
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

            processQueue(null, newToken)
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            resolve(axios(originalRequest))
          })
          .catch(refreshErr => {
            processQueue(refreshErr, null)
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            toast.error('Session expired, please log in again')
            window.location.href = '/login'
            reject(refreshErr)
          })
          .finally(() => {
            isRefreshing = false
          })
      })
    }

    return Promise.reject(err)
  }
)

//API methods

export const searchMovies = async (title, year, page) => {
  const params = { page }
  if (title) params.title = title
  if (typeof year === 'number' && !isNaN(year)) params.year = year

  const resp = await axios.get('/movies/search', { params })
  return {
    movies: resp.data.data,
    total: resp.data.pagination.total,
  }
}

export const getMovieDetails = async imdbID => {
  const resp = await axios.get(`/movies/data/${imdbID}`)
  return resp.data
}

export const getPersonDetails = async id => {
  const resp = await axios.get(`/people/${id}`)
  return resp.data
}

export const login = async (email, password) => {
  const resp = await axios.post('/user/login', { email, password })
  return {
    token: resp.data.bearerToken.token,
    refreshToken: resp.data.refreshToken.token,
  }
}

export const register = async (email, password) => {
  const resp = await axios.post('/user/register', { email, password })
  return resp.data
}

export const logout = async () => {
  return axios.post('/user/logout')
}

/**
 * Manually set/clear default auth header
 */
export const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common['Authorization']
  }
}
