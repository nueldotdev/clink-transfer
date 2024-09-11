import React from 'react'
import Logo from '../../components/Logo'

const EmailPage = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center bg-light bg-cover bg-no-repeat bg-center bg-[url('/bg/entry.jpg')]">
      <div className='p-6 w-1/3 max-md:w-full bg-white rounded-xl'>
        <div className='text-center flex flex-col justify-center gap-y-8'>
          <Logo />
          <p className='font-[500] text-base text-gray-600'>A verification link has been sent to your email.<br />Please check your inbox, if you don't see it, it might be in your spam folder.</p>
        </div>
      </div>
    </div>
  )
}

export default EmailPage