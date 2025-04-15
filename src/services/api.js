import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.baseURL = '/api';

// Token refresh interceptor
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refreshToken')
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/user/refresh', { refreshToken });
        localStorage.setItem('token', response.data.bearerToken.token);
        originalRequest.headers['Authorization'] = 'Bearer ' + response.data.bearerToken.token;
        return axios(originalRequest);
      } catch (err) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export const searchMovies = async (title, year, page) => {
  const response = await axios.get('/movies/search', { params: { title, year, page } });
  return { movies: response.data.data, total: response.data.pagination.total };
};

export const getMovieDetails = async (imdbID) => {
  const response = await axios.get(`/movies/data/${imdbID}`);
  return response.data;
};

export const getPersonDetails = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`/people/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await axios.post('/user/login', { email, password });
  return { token: response.data.bearerToken.token, refreshToken: response.data.refreshToken.token };
};

export const register = async (email, password) => {
  const response = await axios.post('/user/register', { email, password });
  return response.data;
};
