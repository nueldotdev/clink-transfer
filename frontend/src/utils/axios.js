import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5500',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      // Check if the authToken is valid
      if (!await testAuthToken()) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user_id');
        localStorage.removeItem('first_name');
        localStorage.removeItem('last_name');
        localStorage.removeItem('email');
      }
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