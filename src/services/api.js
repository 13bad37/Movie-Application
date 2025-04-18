import axios from 'axios';
import toast  from 'react-hot-toast';

axios.defaults.baseURL = '/api';


export const searchMovies = async (title, year, page) => {
  // build params object but only add year if it's a real number
  const params = { page };
  if (title)        params.title = title;
  if (typeof year === 'number' && !isNaN(year)) {
    params.year = year;
  }

  const response = await axios.get('/movies/search', { params });
  return {
    movies: response.data.data,
    total:  response.data.pagination.total
  };
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
  return {
    token:        response.data.bearerToken.token,
    refreshToken: response.data.refreshToken.token
  };
};

export const register = async (email, password) => {
  const response = await axios.post('/user/register', { email, password });
  return response.data;
};
