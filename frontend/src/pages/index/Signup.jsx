import platform, { product } from 'platform';
import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';

import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import Logo from '../../components/Logo';
import axios from 'axios';
import { UserContext } from '../../context/UserContext'



function getDeviceInfo() {
  const deviceInfo = {
    platform: platform.os.family,       // e.g., 'iOS', 'Windows', 'Android'
    version: platform.os.version,       // OS version
    architecture: platform.os.architecture,  // 32-bit or 64-bit
    browser: platform.name,             // e.g., 'Chrome', 'Safari'
    deviceType: platform.product,       // Device type like 'iPhone', 'Galaxy'
    cores: navigator.hardwareConcurrency || 'N/A', // Number of CPU cores
    memory: navigator.deviceMemory || 'N/A',  // Total device memory
    hostname: navigator.userAgent,     // Device name approximation via userAgent
  };

  if (product) {
      deviceInfo.deviceType = product;
  } else {
    deviceInfo.deviceType = 'Desktop';
  }

  return deviceInfo;
}



const Signup = () => {

  const { details, handleInputChange, reqVerification } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  const handleSubmit = async () => {
    if (details.password === details.passwordConfirm) {
      axios.post('http://localhost:5500/user-signup', details)
        .then((res) => {
          console.log(res)
          setLoading(false)
          notifications.show({
            title: 'Success',
            message: 'User created successfully! 🎉',
            color: 'green',
            position: 'top-right',
          });

          reqVerification().then(() => {
            navigate('/email-sent')
          }).catch((err) => {
            console.error(err)
          })

        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
          notifications.show({
            title: 'Error',
            message: 'Failed to create user 💔',
            color: 'red',
            position: 'top-right',
          });
        })
    } else {
      console.log("Passwords do not match")
      notifications.show({
        title: 'Error',
        message: 'Passwords do not match 💔',
        color: 'red',
        position: 'top-right',
      });
    }
  }

  const deviceInfo = getDeviceInfo();

  return (
    <div className="h-screen w-full flex justify-center items-center bg-light bg-cover bg-no-repeat bg-center bg-[url('/bg/entry.jpg')]">
      <div className='px-4 py-6 w-1/3 max-md:w-full flex flex-col justify-center gap-y-8 bg-white rounded-xl'>
        <div className='text-center'>
          <Logo />
          <p className='font-semibold text-lg'>Create your account</p>
        </div>
        <div className='flex flex-col gap-y-4'>
          <div className='flex items-center justify-between gap-2'>
            <input type="text" className='input-bx' placeholder='First Name' name="first_name" value={details.first_name} onChange={handleInputChange} />
            <input type="text" className="input-bx" placeholder='Last Name' name="last_name" value={details.last_name} onChange={handleInputChange} />
          </div>
          <div className='w-full'>
            <input type="text" className="input-bx" placeholder='Your Email' name="email" value={details.email} onChange={handleInputChange} />
            </div>
          <div className='w-full'>
            <input type="password" className="input-bx" placeholder='Password' name="password" value={details.password} onChange={handleInputChange} />
          </div>
          <div className='w-full'>
            <input type="password" className="input-bx" placeholder='Confirm Password' name="passwordConfirm" value={details.passwordConfirm} onChange={handleInputChange} />
          </div>
        </div>
        <div className='flex justify-center'>
          <Button loading={loading} size='lg' className="sign-free py-3 hover:bg-blue-800"
            onClick={() => {
              setLoading(true)
              handleSubmit()
            }}
          >
            <p>Submit</p>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Signup;