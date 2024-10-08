import platform, { product } from 'platform';
import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom';

import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import Logo from '../../components/Logo';
import axios from 'axios';
import { UserContext } from '../../context/UserContext'
import api from "../../utils/axios";

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

const Signup = () => {
  const { details, handleInputChange, reqVerification, user, setUser } =
    useContext(UserContext);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(details.email)) {
      setLoading(false);
      notifications.show({
        title: "Error",
        message: "Invalid email format 💔",
        color: "red",
        position: "top-right",
      });
    }  else if (details.password === confirmPassword) {
      try {
        const response = await api.post("/signup-and-login", details);

        localStorage.setItem("user_id", response.data.user.id);
        localStorage.setItem("authToken", response.data.token);

        notifications.show({
          title: "Success",
          message: "User created successfully! 🎉",
          color: "green",
          position: "top-right",
        });

        try {
          const verify = await reqVerification();
          console.log(verify.data);
          navigate("/email-sent");
        } catch (error) {
          console.error(error.response.data);
        }
      } catch (error) {
        console.log(error);

        setLoading(false);

        notifications.show({
          title: "Error",
          message: "Failed to create user 💔",
          color: "red",
          position: "top-right",
        });
      }
    } else {
      console.log("Passwords do not match");
      setLoading(false);
      notifications.show({
        title: "Error",
        message: "Passwords do not match 💔",
        color: "red",
        position: "top-right",
      });
    }
  };

  const deviceInfo = getDeviceInfo();

  return (
    <div className="h-screen w-full flex justify-center items-center bg-light bg-cover bg-no-repeat bg-center bg-[url('/bg/entry.jpg')]">
      <div className="px-4 py-6 w-1/3 max-md:w-full flex flex-col justify-center gap-y-8 bg-white rounded-xl">
        <div className="text-center">
          <Logo />
          <p className="font-semibold text-lg">Create your account</p>
        </div>
        <div className="flex flex-col gap-y-4">
          <div className="flex items-center justify-between gap-2">
            <input
              type="text"
              className="input-bx"
              placeholder="First Name"
              name="firstName"
              value={details.firstName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              className="input-bx"
              placeholder="Last Name"
              name="lastName"
              value={details.lastName}
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full">
            <input
              type="email"
              className="input-bx"
              placeholder="Your Email"
              name="email"
              value={details.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full">
            <input
              type="password"
              className="input-bx"
              placeholder="Password"
              name="password"
              value={details.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full">
            <input
              type="password"
              className="input-bx"
              placeholder="Confirm Password"
              name="passwordConfirm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            loading={loading}
            size="lg"
            className="sign-free py-3 hover:bg-blue-800"
            onClick={() => {
              setLoading(true);
              handleSubmit();
            }}
          >
            <p>Submit</p>
          </Button>
        </div>
        <div className="text-center">
          <p>Already have an account? <Link to="/login" className="text-brand font-semibold">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;