import api from "./axios";


export const testAuthToken = async () => {
  const token = localStorage.getItem('authToken');

  if (token) {
    try {
      const response = await api.get('/test-auth');
      return true;
    } catch (error) {
      logoutUser();
      return false;
    }
  }
  return false;
};


export const logoutUser = async () => {

  try {
    const logoutResponse = await api.post('/user-logout');
    console.log(logoutResponse);
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('first_name');
    localStorage.removeItem('last_name');
    localStorage.removeItem('email');
    localStorage.removeItem('user_id');

    return true;

  } catch (error) {
    console.error('Failed to logout:', error);
    return false;
  }
}