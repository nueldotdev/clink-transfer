import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5500',
  headers: {
    'Content-Type': 'application/json',
  },
});

const token = localStorage.getItem('authToken');

api.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.data.message === 'Expired Authtoken' && error.response.status === 401) {
      localStorage.clear()
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


const testAuthToken = async () => {
  try {
    const response = await api.get('/test-auth');
    return true; // Token is valid
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return false; // Token is invalid or expired
    }
    throw error; // Re-throw other errors
  }
};

export default api;