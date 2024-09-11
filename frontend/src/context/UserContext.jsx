import { createContext, useState } from "react";
import { notifications } from "@mantine/notifications";
import axios from 'axios';

export const UserContext = createContext()

export const UserProvider = ({ children }) => {

  const [details, setDetails] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    passwordConfirm: ""
  })

  /**
   * Handles input change events on the sign-up form.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update the state with the new value.
    setDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // If the field is the password or confirm password, do not store it
    if (name !== 'passwordConfirm' && name !== 'password') {
      // Store the value in local storage.
      localStorage.setItem(name, value);
    }
  };

  /**
   * Sends a verification email to the user's email address.
   * 
   * This function is used when the user signs up. It sends a verification email
   * to the user's email address. If the email is sent successfully, nothing is
   * returned. If there is an error, a notification is shown.
   * 
   * @async
   * @returns {void}
   */
  const reqVerification = async () => {
    const userEmail = localStorage.getItem('email');

    // Send the request to the backend.
    axios.post('http://localhost:5500/verify-email', {email: userEmail})
    .then((res) => {
      // If the request is successful, log the response to the console.
      console.log(res);
    })
      
    // If there is an error, log the error to the console and show a notification.
    .catch((err) => { 
      console.log(err);
      notifications.show({
        title: 'Error',
        message: 'Failed to send verification email &#x1F92E;',
        color: 'red',
        position: 'top-right',
      });
    });
  };

  return (
    <UserContext.Provider value={{details, setDetails, handleInputChange, reqVerification}}>
      {children}
    </UserContext.Provider>
  )
}
