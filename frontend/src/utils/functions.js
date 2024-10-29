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
    
    localStorage.clear()

    return true;

  } catch (error) {
    console.error('Failed to logout:', error);
    return false;
  }
}

export const userLoggedIn = async (data) => {
  localStorage.setItem("authToken", data.token);
  localStorage.setItem("user_id", data.user._id);
  localStorage.setItem("email", data.user.email);
}

export const getUserId = async () => {
  const user_id = localStorage.getItem('user_id');

  if (!user_id) {
    return null;
  }

  return { user_id }
}

export const getUserInfo = async () => {
  const { user_id } = getUserId();

  if (!user_id) {
    return null
  }

  try {
    const info = await api.get('/get-user-info', )
  } catch (err) {

  }
}