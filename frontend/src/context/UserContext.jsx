import { createContext, useState } from "react";
import axios from "axios";
import api from "../utils/axios";
import { notifications } from "@mantine/notifications";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [details, setDetails] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    emaillVisibility: true,
  });

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
    if (name !== "passwordConfirm" && name !== "password") {
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
    const email = localStorage.getItem("email");

    if (email) {
      // Send verification request to the backend
      try {
        const response = await api.post("/verify-email", { email });
        return response.data;
      } catch (error) {
        // If there is an error, log the error to the console and show a notification.
        notifications.show({
          title: "Error",
          message: "Failed to send verification email &#x1F92E;",
          color: "red",
          position: "top-right",
        });
        return error.response.data;
      }
    }
  };

  return (
    <UserContext.Provider
      value={{
        details,
        setDetails,
        handleInputChange,
        reqVerification,
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
