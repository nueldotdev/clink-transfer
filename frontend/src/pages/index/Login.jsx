import platform, { product } from "platform";
import React, { useState, useEffect, useContext } from "react";

import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Logo from "../../components/Logo";
import api from "../../utils/axios";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";




function getDeviceInfo() {
  const deviceInfo = {
    platform: platform.os.family, // e.g., 'iOS', 'Windows', 'Android'
    version: platform.os.version, // OS version
    architecture: platform.os.architecture, // 32-bit or 64-bit
    browser: platform.name, // e.g., 'Chrome', 'Safari'
    deviceType: platform.product, // Device type like 'iPhone', 'Galaxy'
    cores: navigator.hardwareConcurrency || "N/A", // Number of CPU cores
    memory: navigator.deviceMemory || "N/A", // Total device memory
    hostname: navigator.userAgent, // Device name approximation via userAgent
  };

  if (product) {
    deviceInfo.deviceType = product;
  } else {
    deviceInfo.deviceType = "Desktop";
  }

  return deviceInfo;
}

const Login = () => {

  const navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const [details, setDetails] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await api.post("/user-login", details);
      console.log(response);
      notifications.show({
        title: "Success",
        message: "User logged in successfully! 🎉",
        color: "green",
        position: "top-right",
      });
      setLoading(false);
      
      userLoggedIn(response.data);
      
      navigate("/app");


    } catch (error) {
      console.log(error);
      setLoading(false);
      notifications.show({
        title: "Error",
        message: "Failed to log in 💔",
        color: "red",
        position: "top-right",
      });
    } finally {
      setLoading(false)
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevState) => ({ ...prevState, [name]: value }));
  };

  const deviceInfo = getDeviceInfo();

  return (
    <div className="h-screen w-full flex justify-center items-center bg-light bg-cover bg-no-repeat bg-center bg-[url('/bg/entry.jpg')]">
      <div className="action-box">
        <div className="text-center">
          <Logo />
          <p className="font-semibold text-lg">Log in to your account</p>
        </div>
        <div className="flex flex-col gap-y-4">
          <div className="w-full">
            <input
              type="text"
              className="input-bx"
              placeholder="Your Email"
              name="email"
              value={details.email}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            loading={loading}
            size="lg"
            className="sign-free py-3 hover:bg-blue-800"
            onClick={() => {
              handleSubmit();
            }}
          >
            <p>Submit</p>
          </Button>
        </div>
        <div className="text-center">
          <p>Don't have an account? <Link to="/signup" className="text-brand font-semibold">Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
